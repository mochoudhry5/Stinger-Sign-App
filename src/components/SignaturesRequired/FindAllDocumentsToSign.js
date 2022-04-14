import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_DOCS_TO_SIGN_INFO } from "../../Graphql/Query";
import ShowAllDocumentsToSign from "./ShowAllDocumentsToSign";
import { Link } from "react-router-dom";

export default function FindAllDocumentsToSign() {
  const [noSignDocs, setNoSignDocs] = useState(true);
  const loggedIn = window.localStorage.getItem("state");
  const { data, error, loading } = useQuery(GET_DOCS_TO_SIGN_INFO, {
    variables: {
      id: loggedIn,
    },
  });

  useEffect(() => {
    console.log("USE EFFECT -> AllDocsToSign")
    setNoSignDocs(false)
    if (data) {
      if (data.get_UserInfo.documentsToSign) {
        data.get_UserInfo.documentsToSign.documentsToSignInfo.map(
          (document) => {
            if (!document.isSigned) {
              setNoSignDocs(true);
            }
          }
        );
      }
  }
  }, [data]);

  if (loading) return <div></div>;
  if (error) return <div>Error. Please Try Again</div>;

  return (
    <div className="Sig-Req-Page">
      <Link
        className="upload-docs"
        to={{
          pathname: "/nav/dashboard",
        }}
      >
        <button className="backclick5"> &lt;&nbsp;Dashboard</button>
      </Link>
      <h1 className="sig-req">Signatures Required</h1>
      {noSignDocs ? (
        data.get_UserInfo.documentsToSign ? (
        data.get_UserInfo.documentsToSign.documentsToSignInfo.map(
          (document) => {
            if (!document.isSigned)
              return (
                <div key={document.pdfName} >
                <ShowAllDocumentsToSign
                  senderID={document.fromWho}
                  pdfName={document.pdfName}
                  reason={document.reasonForSigning}
                  time={document.timeOfSend.substring(3, 16)}
                />
                </div>
              );
          }
        )
        ): null
      ) : (
        <p className="noDocsToSign"> No Documents To Sign...Sadly </p>
      )}
    </div>
  );
}
