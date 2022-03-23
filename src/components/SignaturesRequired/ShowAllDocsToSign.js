import React from "react";
import { useQuery } from "@apollo/client";
import { USER_INFO_BASIC } from "../../Graphql/Query";
import { Link } from "react-router-dom";

export default function ShowAllDocsToSign(props) {
  const { data, loading, error } = useQuery(USER_INFO_BASIC, {
    variables: {
      id: props.senderID
    }
  });

  if (loading) return <div></div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      {data ? (
        <p className="toSignDocs">
          &nbsp; Sender:
          <span className="headdoc"> {data.get_UserInfo.userFirstName} {data.get_UserInfo.userLastName} ({data.get_UserInfo.userEmail}) </span>
          <br/>Sent When:
          <span className="headdoc"> {props.time} </span>
          <br/> Reason:
          <span className="headdoc"> {props.reason} </span>
          <br/>
          <Link
            className="upload-docs"
            to={{
              pathname: "/nav/signdocuments/viewdocument",
              state: { pdfName: props.pdfName, fileData: "HELO" },
            }}
          >
            <button className="buttontoview" > View </button>
          </Link>

          <Link className="upload-docs" to="/nav/signdocuments/signaturetime">
            <button className="buttontosign"> Sign </button>
          </Link>

          <Link
            className="upload-docs"
            to={{
              pathname: "/nav/signdocuments/rejectdocument",
              state: { pdfName: props.pdfName, senderID: props.senderID, fileID: props.fileId},
            }}
          >
          <button className="buttontoreject"> Reject </button>
          </Link>
        </p>
      ) : null}
      <hr className="hr-sigreq"/>
      <br />
      <br />
      <br />
    </div>
  );
}
