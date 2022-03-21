import React, { useEffect } from "react";
import { useLazyQuery, useQuery } from "@apollo/client";
import { USER_INFO_BASIC, GETFILE } from "../../Graphql/Query";
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
          &nbsp; Document Name:{" "}
          <span className="headdoc">{props.pdfName} </span>
          From Who:{" "}
          <span className="headdoc"> {data.get_UserInfo.userEmail} </span>
          <Link className="upload-docs" to="/nav/signdocuments/signaturetime">
            <button className="buttontosign"> Sign </button>
          </Link>
          <Link
            className="upload-docs"
            to={{
              pathname: "/nav/signdocuments/viewdocument",
              state: { pdfName: props.pdfName, fileData: "HELO" },
            }}
          >
            <button className="buttontosign" > View </button>
          </Link>
          <button className="buttontosign"> Reject </button>
        </p>
      ) : null}
      <br />
      <br />
      <br />
    </div>
  );
}
