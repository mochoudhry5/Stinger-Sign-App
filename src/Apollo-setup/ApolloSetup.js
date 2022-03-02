import { ApolloClient, InMemoryCache } from "@apollo/client";


export default new ApolloClient({
  uri: "VENDIA_GRAPHQL_URL",
  cache: new InMemoryCache(),
  headers: {
    "Content-Type": "application/graphsql",
    "X-API-KEY": "VENDIA_GRAPHQL_API_KEY",
  },
});
