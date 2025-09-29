// lib/schema.ts
import { makeExecutableSchema } from "@graphql-tools/schema";
import { messageTypeDefs } from "@/schemas/message.schema";
import { MessageResolvers } from "@/types/generated";
import { createMessage } from "@/resolvers/mutations/message/create-message";
import { getMessages } from "@/resolvers/queries";
import { Subscription } from "@/resolvers/subscription";

export const schema = makeExecutableSchema({
  typeDefs: [messageTypeDefs],
  resolvers: [createMessage, getMessages, Subscription ] as MessageResolvers[],
});
