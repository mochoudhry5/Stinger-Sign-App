import RequiredSignaturesHeader from "./SignaturesRequired/RequiredSignaturesHeader";
import React, { useEffect } from "react";
import UploadDocumentHeader from "./UploadDocument/UploadDocumentHeader";
import DocumentHistoryHeader from "./DocumentHistory/DocumentHistoryHeader";
import { USER_INFO } from "../Graphql/Query";
import { useQuery } from "@apollo/client";
import { awsConfig } from "./../AWS/ConfigAws"

export default function Dashboard() {
  const loggedIn = window.localStorage.getItem("state");
  const { error, data } = useQuery(USER_INFO, {
    variables: {
      id: loggedIn,
    },
  });

  useEffect(() => {
    awsConfig(); 
    localStorage.removeItem("emails");
    localStorage.removeItem("ids");
  }, []);

  if (error) return <div> ERROR: {error.message} </div>;

  const Footer = () => (
    <div className="footer">
      {console.log("Ran Footer Code")}
      <p>©2022 StingerSign, LLC. No Rights Reserved.</p>
    </div>
  );

  return (
    <div>
      {data ? (
        <>
          <h1 className="title" align="center">
            {data.get_UserInfo.userFirstName}'s Dashboard
          </h1>

          <RequiredSignaturesHeader />
          <br />
          <DocumentHistoryHeader />
          <br />
          <UploadDocumentHeader />
          <br />
        </>
      ) : null}
      {Footer()}
    </div>
  );
}
