import React, { useEffect, useState } from "react";
import { DOCS_SENT_OR_SIGNED } from "../../Graphql/Query";
import { useQuery } from "@apollo/client";

function ShowAllDocsSent() {
  const [toSign, setToSign] = useState(false);
  const loggedIn = window.localStorage.getItem("state");
  const { loading, data } = useQuery(DOCS_SENT_OR_SIGNED, {
    variables: {
      id: loggedIn,
    },
  });

  useEffect(() => {
    console.log("USE EFFECT -> ShowAllDocsSent")
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
    <div>
      <h2 className="titles-manage">Document History</h2>
      <br />
      <br />
      {/* DOCUMENTS SENT */}
      <div className="toSignDocs">
        <h3 className="titles-temp"> Sent Documents</h3>
        {data.get_UserInfo.documentsSent ? (
          data.get_UserInfo.documentsSent.documentsSentInfo ? (
            data.get_UserInfo.documentsSent.documentsSentInfo.length > 0 ? (
              data.get_UserInfo.documentsSent.documentsSentInfo.map(
                (document) => (
                  <>
                    &nbsp; Subject:
                    <span className="headdoc">
                      {" "}
                      {document.reasonForSigning}{" "}
                    </span>
                    Sent:
                    <span className="headdoc">
                      {" "}
                      {document.timeSent.substring(0, 25)}
                    </span>
                    {document.isRejected ? (
                      <span className="rejected"> REJECTED </span>
                    ) : null}
                    <br />
                    <br />
                  </>
                )
              )
            ) : (
              <p className="nodocssent"> No Sent Documents</p>
            )
          ) : (
            <p className="nodocssent"> No Sent Documents</p>
          )
        ) : (
          <p className="nodocssent"> No Sent Documents</p>
        )}
        <hr className="hr-manage" />
        {/* DOCUMENTS SIGNED */}
        <h3 className="titles-temp"> Signed Documents</h3>
        {data.get_UserInfo.documentsToSign ? (
          data.get_UserInfo.documentsToSign.documentsToSignInfo ? (
            data.get_UserInfo.documentsToSign.documentsToSignInfo.length > 0 ? (
              toSign ? (
                data.get_UserInfo.documentsToSign.documentsToSignInfo.map(
                  (document) =>
                    document.isSigned ? (
                      <>
                        &nbsp; Subject:
                        <span className="headdoc">
                          {" "}
                          {document.reasonForSigning}{" "}
                        </span>
                        Sent:
                        <span className="headdoc">
                          {" "}
                          {document.timeOfSend.substring(0, 25)}{" "}
                        </span>
                        <br />
                        <br />
                      </>
                    ) : null
                )
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
      </div>
    </div>
  );
}

export default ShowAllDocsSent;
