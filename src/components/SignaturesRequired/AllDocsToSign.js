import React from "react";
import { useQuery } from "@apollo/client";
import { GET_SENT_INFO_DOCS_TO_SIGN } from "../../Graphql/Query";
import ShowAllDocsToSign from "./ShowAllDocsToSign";
import { useLocation } from "react-router-dom";

export default function AllDocsToSign() {
  const loggedIn = window.localStorage.getItem("state");
  const location = useLocation();
  const fileData = location.state.fileData
  const { data, error, loading } = useQuery(GET_SENT_INFO_DOCS_TO_SIGN, {
    variables: {
      id: loggedIn,
    },
  });


  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;


  return (
    <div className="Sig-Req-Page">
      <h1 className="sig-req">Signatures Required</h1>
      {data.get_UserInfo.documentsToSign.documentsToSignInfo.length !== 0 ? (
        data.get_UserInfo.documentsToSign.documentsToSignInfo.map((document) => {
              if (!document.isSigned)
                return (
                  <ShowAllDocsToSign
                    senderID={document.fromWho}
                    pdfName={document.pdfName}
                    dataFile={fileData}
                  />
                );
            })
      ) : (
        <p className="noDocsToSign"> No Documents To Sign...Sadly </p>
      )}
    </div>
  );
}
