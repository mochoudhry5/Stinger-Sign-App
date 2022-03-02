import { ApolloClient, InMemoryCache } from "@apollo/client";


export default new ApolloClient({
  uri: "https://klhp9mmcsf.execute-api.us-west-2.amazonaws.com/graphql/",
  cache: new InMemoryCache(),
  headers: {
    "Content-Type": "application/graphsql",
    "X-API-KEY": "taCW3P7Q6nBWD6zatu-DIOPFid1Qar8tq0k5zlpe",
  },
});
