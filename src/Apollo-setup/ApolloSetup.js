import { ApolloClient, InMemoryCache } from "@apollo/client";


export default new ApolloClient({
  uri: process.env.REACT_APP_VENDIA_URI,
  cache: new InMemoryCache(),
  headers: {
    "Content-Type": "application/graphsql",
    "X-API-KEY": process.env.REACT_APP_VENDIA_API_KEY,
  },
});
