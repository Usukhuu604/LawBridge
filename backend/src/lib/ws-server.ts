// ws-server.ts
import { createServer } from "http";
import { useServer } from "graphql-ws/use/ws";
import { WebSocketServer } from "ws";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { typeDefs } from "@/schemas";
import { resolvers } from "@/resolvers";

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export function startWsServer(httpServer: ReturnType<typeof createServer>) {
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/api/graphql",
  });

  useServer({ schema }, wsServer);

  console.log("🟢 GraphQL WebSocket server running on /graphql");
}
