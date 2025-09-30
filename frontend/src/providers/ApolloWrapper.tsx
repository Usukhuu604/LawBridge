"use client";

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
  from,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { ReactNode, useMemo, useRef } from "react";
import { useAuth } from "@clerk/nextjs";

const httpLink = createHttpLink({
  uri: "https://lawbridge-server.onrender.com/graphql",
});

// Create error link outside component to prevent recreation
const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path }) =>
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        )
      );
    }
    if (networkError) {
      console.log(`[Network error]: ${networkError}`);
      console.log(`[Network error details]:`, {
        message: networkError.message,
        name: networkError.name,
        stack: networkError.stack,
        operation: operation.operationName,
      });
    }
  }
);

export const ApolloWrapper = ({ children }: { children: ReactNode }) => {
  const { userId, getToken, isLoaded } = useAuth();

  // Create auth link that updates when userId changes
  const authLink = useMemo(
    () =>
      setContext(async (_, { headers }) => {
        try {
          // Get the current token from Clerk
          const token = await getToken();
          console.log("🔑 Apollo auth token:", token ? "Present" : "Missing");
          return {
            headers: {
              ...headers,
              Authorization: token ? `Bearer ${token}` : "",
              "Content-Type": "application/json",
            },
          };
        } catch (error) {
          console.error("❌ Error getting auth token:", error);
          return {
            headers: {
              ...headers,
              "Content-Type": "application/json",
            },
          };
        }
      }),
    [userId, getToken]
  );

  // Create client with proper dependencies to ensure it updates when auth changes
  const client = useMemo(() => {
    return new ApolloClient({
      link: from([errorLink, authLink, httpLink]),
      cache: new InMemoryCache({
        typePolicies: {
          Query: {
            fields: {
              // Add field policies to prevent unnecessary refetches
              getLawyers: {
                merge(existing = [], incoming) {
                  return incoming;
                },
              },
              getChatRoomByUser: {
                merge(existing = [], incoming) {
                  return incoming;
                },
              },
            },
          },
        },
      }),
      defaultOptions: {
        watchQuery: {
          fetchPolicy: "cache-first",
          errorPolicy: "all",
        },
        query: {
          fetchPolicy: "cache-first",
          errorPolicy: "all",
        },
      },
    });
  }, [authLink]); // Include authLink as dependency to recreate when auth changes

  // Don't render until auth is loaded to prevent hydration issues
  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
