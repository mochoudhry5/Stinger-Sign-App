import React, { useEffect, useState } from "react";
import { DOCS_SENT_OR_SIGNED } from "../../Graphql/Query";
import { useQuery } from "@apollo/client";
import ViewSentDocument from "./ViewSentDocument";
import GetSenderFirstName from "./GetSenderFirstName";
import { Link } from "react-router-dom";

function AllDocumentsSentOrSigned() {
  const [toSign, setToSign] = useState(false);
  const loggedIn = window.localStorage.getItem("state");
  const { loading, data } = useQuery(DOCS_SENT_OR_SIGNED, {
    variables: {
      id: loggedIn,
    },
  });
  

  useEffect(() => {
    console.log("USE EFFECT -> ShowAllDocsSent");
    if (data) {
      if (data.get_UserInfo.documentsToSign) {
        data.get_UserInfo.documentsToSign.documentsToSignInfo.map(
          (document) => {
            if (document.isSigned) {
              setToSign(true);
            }
          }
        );
      }
    }
  }, [data]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="Sig-Req-Page">
      <Link
        className="upload-docs"
        to={{
          pathname: "/nav/dashboard",
        }}
      >
        <span className="backclick5"> &lt;&nbsp;Dashboard&nbsp;</span>
      </Link>
      <span className="sig-req2">Document History</span>
      <br />
      <br />
      {/* DOCUMENTS SENT */}
      <div className="toSignDocs">
        {data.get_UserInfo.documentsSent ? (
          data.get_UserInfo.documentsSent.documentsSentInfo ? (
            data.get_UserInfo.documentsSent.documentsSentInfo.length > 0 ? (
              <div className="tablecss">
                <table>
                <th className="tableheader" colSpan="5">Documents Sent</th>
                  <tr>
                    
                    <th className="tablehead">Document Subject</th>
                    <th className="tablehead">Sent Date</th>
                    <th className="tablehead">Completed? </th>
                    <th className="tablehead">Rejected?</th>
                    <th className="tablehead">View Current Document</th>
                  </tr>
                  {data.get_UserInfo.documentsSent.documentsSentInfo.map(
                    (document) => (
                      <>
                        <tr key={document.pdfName}>
                          <td>{document.reasonForSigning}</td>
                          <td>{document.timeSent.substring(3, 16)}</td>
                          <td>
                            {" "}
                            {document.isCompleted ? (
                              <span className="completed"> YES </span>
                            ) : (
                              <span className="rejected"> NO </span>
                            )}
                          </td>
                          <td>
                            {document.isRejected ? (
                              <span className="rejected"> YES </span>
                            ) : (
                              <span className="completed"> NO </span>
                            )}
                          </td>
                          <td>
                            {" "}
                            <ViewSentDocument pdfName={document.pdfName} />{" "}
                          </td>
                        </tr>
                      </>
                    )
                  )}
            
                </table>
              </div>
            ) : (
              <p className="nodocssent"> No Sent Documents</p>
            )
          ) : (
            <p className="nodocssent"> No Sent Documents</p>
          )
        ) : (
          <p className="nodocssent"> No Sent Documents</p>
        )}
        {/* <hr className="hr-manage" /> */}
        {/* DOCUMENTS SIGNED */}
        {data.get_UserInfo.documentsToSign ? (
          data.get_UserInfo.documentsToSign.documentsToSignInfo ? (
            data.get_UserInfo.documentsToSign.documentsToSignInfo.length > 0 ? (
              toSign ? (
                <div className="tablecss">
                  <table>
                  <th className="tableheader" colSpan="3">Documents Signed</th>
                    <tr>
                      <th className="tablehead">Sender</th>
                      <th className="tablehead">Document Subject</th>
                      <th className="tablehead">Sent Date</th>
                    </tr>
                    {data.get_UserInfo.documentsToSign.documentsToSignInfo.map(
                      (document) =>
                        document.isSigned ? (
                          <>
                            <tr>
                            <td><GetSenderFirstName fromWho={document.fromWho} /> </td>
                              <td>{document.reasonForSigning}</td>
                              <td>{document.timeOfSend.substring(3, 16)}</td>
                            </tr>
                          </>
                        ) : null
                    )}
                  </table>
                </div>
              ) : (
                <p className="nodocstosign"> No Signed Documents</p>
              )
            ) : (
              <p className="nodocstosign"> No Signed Documents</p>
            )
          ) : (
            <p className="nodocstosign"> No Signed Documents</p>
          )
        ) : (
          <p className="nodocstosign"> No Signed Documents</p>
        )}
        <br />
      </div>
    </div>
  );
}

export default AllDocumentsSentOrSigned;
