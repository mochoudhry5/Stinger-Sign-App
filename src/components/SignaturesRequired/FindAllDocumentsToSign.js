import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import {
  GET_SENT_INFO_DOCS_TO_SIGN,
  LIST_ALL_FILES,
} from "../../Graphql/Query";
import ShowAllDocumentsToSign from "./ShowAllDocumentsToSign";
import { useLocation } from "react-router-dom";

export default function FindAllDocumentsToSign() {
  const [noSignDocs, setNoSignDocs] = useState(false);
  const loggedIn = window.localStorage.getItem("state");
  const location = useLocation();
  const fileData = location.state.fileData;
  const { loading: loading1, data: data1 } = useQuery(LIST_ALL_FILES);
  const { data, error, loading } = useQuery(GET_SENT_INFO_DOCS_TO_SIGN, {
    variables: {
      id: loggedIn,
    },
  });

  useEffect(() => {
    console.log("USE EFFECT -> AllDocsToSign")
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

  if (loading) return <div>Loading...</div>;
  if (loading1) return <div>Loading...</div>;
  if (error) return <div>Error</div>;

  const findFileId = (pdfName) => {
    console.log("ALL DOCS TO SIGN")
    let fileId = "";
    data1.listVendia_FileItems.Vendia_FileItems.map((file) => {
      if (file.destinationKey === pdfName) {
        fileId = file._id;
      }
    });
    return fileId;
  };

  return (
    <div className="Sig-Req-Page">
      <h1 className="sig-req">Signatures Required</h1>
      {noSignDocs ? (
        data.get_UserInfo.documentsToSign.documentsToSignInfo.map(
          (document) => {
            if (!document.isSigned)
              return (
                <ShowAllDocumentsToSign
                  senderID={document.fromWho}
                  pdfName={document.pdfName}
                  reason={document.reasonForSigning}
                  time={document.timeOfSend.substring(3, 16)}
                  dataFile={fileData}
                  fileId={findFileId(document.pdfName)}
                />
              );
          }
        )
      ) : (
        <p className="noDocsToSign"> No Documents To Sign...Sadly </p>
      )}
    </div>
  );
}
