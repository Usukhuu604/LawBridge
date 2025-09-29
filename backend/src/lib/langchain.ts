// /lib/langchain.ts

import { ChatOpenAI } from "@langchain/openai";
import { MongoDBChatMessageHistory } from "@langchain/mongodb";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { OpenAIEmbeddings } from "@langchain/openai";
import { MongoClient, Db } from "mongodb";
import { MongoDBAtlasVectorSearch } from "@langchain/community/vectorstores/mongodb_atlas";
import { BaseMessage } from "@langchain/core/messages";

// Environment validation
const MONGODB_URI = process.env.MONGODB_CONNECTION_URL || "";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
const DB_NAME = process.env.DB_NAME || "LawBridge";

if (!MONGODB_URI) throw new Error("MONGODB_CONNECTION_URL is not defined");
if (!OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is not defined");

// Singleton MongoDB client
let mongoClient: MongoClient | null = null;
let isConnecting = false;

// Connection pool management
async function getMongoClient(): Promise<MongoClient> {
  if (mongoClient) {
    return mongoClient;
  }

  if (isConnecting) {
    // Wait for existing connection attempt
    while (isConnecting) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    if (mongoClient) return mongoClient;
  }

  isConnecting = true;
  try {
    mongoClient = new MongoClient(MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    await mongoClient.connect();
    console.log("✅ MongoDB connected successfully");
    return mongoClient;
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    throw error;
  } finally {
    isConnecting = false;
  }
}

// Cache for embeddings and vector store
const embeddingsCache = new Map<string, OpenAIEmbeddings>();
const vectorStoreCache = new Map<string, MongoDBAtlasVectorSearch>();

function getEmbeddings(): OpenAIEmbeddings {
  if (!embeddingsCache.has(OPENAI_API_KEY)) {
    embeddingsCache.set(
      OPENAI_API_KEY,
      new OpenAIEmbeddings({
        apiKey: OPENAI_API_KEY,
        batchSize: 512,
        maxRetries: 3,
      })
    );
  }
  return embeddingsCache.get(OPENAI_API_KEY)!;
}

async function getVectorStore(db: Db): Promise<MongoDBAtlasVectorSearch> {
  const cacheKey = `${DB_NAME}_legal_vectors`;

  if (!vectorStoreCache.has(cacheKey)) {
    const vectorStore = new MongoDBAtlasVectorSearch(getEmbeddings(), {
      collection: db.collection("legal_vectors"),
      indexName: "vector_index",
      textKey: "text",
      embeddingKey: "embedding",
    });
    vectorStoreCache.set(cacheKey, vectorStore);
  }

  return vectorStoreCache.get(cacheKey)!;
}

// Enhanced system prompt for legal assistance
const SYSTEM_PROMPT = `You are LawBridge, a professional legal AI assistant specializing in legal document analysis and consultation.

GUIDELINES:
- Provide accurate, helpful legal information based on the provided context
- Always cite relevant legal sources when available
- If information is not in the context, clearly state you don't know
- Use professional but accessible language
- For complex legal matters, recommend consulting with a qualified attorney
- Provide structured responses with clear reasoning
- If the user asks about a specific law, provide the law and its explanation
- If the user asks about a specific case, provide the case and its explanation
- If the user asks about a specific legal document, provide the document and its explanation
- If the user asks about a specific legal term, provide the term and its explanation
- If the user asks about a specific legal concept, provide the concept and its explanation
- If the user asks about a specific legal issue, provide the issue and its explanation
- If the user asks about a specific legal topic, provide the topic and its explanation
- Try to answer in mongolian language

IMPORTANT: This is for informational purposes only and does not constitute legal advice.

Context: {context}`;

interface ChatResponse {
  answer: string;
  sourceDocuments?: any[];
  metadata?: {
    tokensUsed?: number;
    retrievalTime?: number;
    responseTime?: number;
  };
}

interface ChatOptions {
  maxTokens?: number;
  temperature?: number;
  includeSourceDocs?: boolean;
  maxHistoryLength?: number;
}

export async function chatWithBot(
  message: string,
  userId: string,
  options: ChatOptions = {}
): Promise<ChatResponse> {
  const startTime = Date.now();
  let client: MongoClient | null = null;

  // Validate inputs
  if (!message?.trim()) {
    throw new Error("Message cannot be empty");
  }

  if (!userId?.trim()) {
    throw new Error("User ID is required");
  }

  const {
    maxTokens = 500,
    temperature = 0.3,
    includeSourceDocs = true,
    maxHistoryLength = 10,
  } = options;

  try {
    // Get MongoDB connection
    client = await getMongoClient();
    const db = client.db(DB_NAME);

    // Get vector store
    const retrievalStart = Date.now();
    const vectorStore = await getVectorStore(db);

    // Create retriever with enhanced configuration
    const retriever = vectorStore.asRetriever({
      k: 6,
      searchType: "similarity",
      filter: {}, // Add filters if needed
    });

    // Chat history management
    const history = new MongoDBChatMessageHistory({
      collection: db.collection("chat_histories"),
      sessionId: userId,
    });

    // Get and limit chat history
    const chatHistory = await history.getMessages();
    const limitedHistory = chatHistory.slice(-maxHistoryLength * 2); // Keep last N exchanges
    const retrievalTime = Date.now() - retrievalStart;

    // Initialize ChatOpenAI model
    const model = new ChatOpenAI({
      temperature,
      model: "gpt-4o-mini",
      apiKey: OPENAI_API_KEY,
      maxTokens,
      streaming: false,
      maxRetries: 3,
      timeout: 30000,
    });

    // Create enhanced prompt template
    const prompt = ChatPromptTemplate.fromMessages([
      ["system", SYSTEM_PROMPT],
      new MessagesPlaceholder("chat_history"),
      [
        "human",
        "Question: {input}\n\nPlease provide a comprehensive answer based on the legal context provided.",
      ],
    ]);

    // Create document and retrieval chains
    const documentChain = await createStuffDocumentsChain({
      llm: model,
      prompt,
      documentSeparator: "\n\n---\n\n",
    });

    const retrievalChain = await createRetrievalChain({
      combineDocsChain: documentChain,
      retriever,
    });

    // Execute the chain
    const response = await retrievalChain.invoke({
      input: message.trim(),
      chat_history: limitedHistory,
    });

    // Save conversation to history
    await Promise.all([
      history.addUserMessage(message.trim()),
      history.addAIMessage(response.answer),
    ]);

    const totalTime = Date.now() - startTime;

    // Prepare response with metadata
    const chatResponse: ChatResponse = {
      answer: response.answer,
      metadata: {
        retrievalTime,
        responseTime: totalTime,
      },
    };

    if (includeSourceDocs && response.sourceDocuments) {
      chatResponse.sourceDocuments = Array.isArray(response.sourceDocuments)
        ? response.sourceDocuments
        : [];
    }

    console.log(`✅ Chat completed for user ${userId} in ${totalTime}ms`);
    return chatResponse;
  } catch (error) {
    console.error("❌ chatWithBot error:", {
      userId,
      message: message.substring(0, 100),
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
    });

    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes("rate limit")) {
        throw new Error(
          "Service is temporarily busy. Please try again in a moment."
        );
      }
      if (error.message.includes("timeout")) {
        throw new Error("Request timeout. Please try with a shorter message.");
      }
    }

    throw new Error(
      "An error occurred while processing your request. Please try again."
    );
  }
}

// Utility function to clear chat history
export async function clearChatHistory(userId: string): Promise<void> {
  try {
    const client = await getMongoClient();
    const db = client.db(DB_NAME);
    const collection = db.collection("chat_histories");
    await collection.deleteMany({ sessionId: userId });
    console.log(`✅ Chat history cleared for user ${userId}`);
  } catch (error) {
    console.error("❌ Error clearing chat history:", error);
    throw error;
  }
}

// Utility function to get chat statistics
export async function getChatStats(userId: string): Promise<{
  messageCount: number;
  lastMessageTime?: Date;
}> {
  try {
    const client = await getMongoClient();
    const db = client.db(DB_NAME);

    const collection = db.collection("chat_histories");
    const messages = await collection.find({ SessionId: userId }).toArray();

    return {
      messageCount: messages.length,
      lastMessageTime:
        messages.length > 0
          ? new Date(
              Math.max(
                ...messages.map((m) => new Date(m.createdAt || 0).getTime())
              )
            )
          : undefined,
    };
  } catch (error) {
    console.error("❌ Error getting chat stats:", error);
    return { messageCount: 0 };
  }
}

// Graceful shutdown
export async function closeLangChainConnections(): Promise<void> {
  try {
    if (mongoClient) {
      await mongoClient.close();
      mongoClient = null;
      console.log("✅ MongoDB connections closed");
    }

    // Clear caches
    embeddingsCache.clear();
    vectorStoreCache.clear();
  } catch (error) {
    console.error("❌ Error closing connections:", error);
  }
}

// Handle process termination
if (typeof process !== "undefined") {
  process.on("SIGTERM", closeLangChainConnections);
  process.on("SIGINT", closeLangChainConnections);
}
