import { ApolloClient, InMemoryCache } from "@apollo/client";


export default new ApolloClient({
  uri: "https://yvgr2o4rfd.execute-api.us-west-2.amazonaws.com/graphql/",
  cache: new InMemoryCache(),
  headers: {
    "Content-Type": "application/graphsql",
    "X-API-KEY": "bycvrPPj_0fyVugRHMLfIJGexEXLNr9MYex1FDFp",
  },
});