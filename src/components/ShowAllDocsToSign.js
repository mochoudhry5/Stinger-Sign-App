import React, { useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { USER_INFO_BASIC } from "../Graphql/Query";
import {Link} from "react-router-dom"

export default function ShowAllDocsToSign(props) {
  const [getBasicInfo, { data, loading, refetch }] =
    useLazyQuery(USER_INFO_BASIC);

  useEffect(() => {
    getDataForSender();
  },[]);

  if (loading) <div>Loading...</div>;

  const getDataForSender = () => {
    getBasicInfo({
      variables: {
        id: props.senderID,
      },
    });
  };

  return (
    <div>
      {data ? (
        <p className="toSignDocs">
           &nbsp; Document Name: <span className="headdoc">{props.pdfName} </span>
        From Who: <span className="headdoc"> {data.get_UserInfo.userEmail} </span>
        <Link className = "upload-docs" to = "/nav/signdocuments/signaturetime">
        <button className="buttontosign"> Sign </button>
        </Link>
        </p>
      ) : null}
      <br/>
      <br/>
      <br/>
    </div>
  );
}
