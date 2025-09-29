// src/index.d.ts
import type { GraphQLContext } from "./src/types/context";

declare module "@apollo/server" {
  interface ContextFunctionParams {
    context: GraphQLContext;
  }
}
