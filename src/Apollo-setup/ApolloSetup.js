import { ApolloClient, InMemoryCache } from "@apollo/client";


export default new ApolloClient({
  uri: "ENTER_GRAPHQL_URL",
  cache: new InMemoryCache(),
  headers: {
    "Content-Type": "application/graphsql",
    "X-API-KEY": "ENTER_API_KEY",
  },
});
