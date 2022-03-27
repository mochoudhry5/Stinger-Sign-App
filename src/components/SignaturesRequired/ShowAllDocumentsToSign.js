import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { USER_INFO_BASIC } from "../../Graphql/Query";
import { Link } from "react-router-dom";
import AWS from "aws-sdk";

const S3_BUCKET = process.env.REACT_APP_S3_BUCKET_NAME;

AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
});


export default function ShowAllDocsToSign(props) {
  const [blobData, setBlobData] = useState()
  const { data, loading, error } = useQuery(USER_INFO_BASIC, {
    variables: {
      id: props.senderID
    }
  });

  useEffect(() => {
    console.log("USE EFFECT -> ShowAllDocsToSign")
    const s3 = new AWS.S3();
    const params = {
      Bucket: S3_BUCKET,
      Key: props.pdfName,
    };

    s3.getObject(params, (err, data) => {
      if (err) {
        console.log(err, err.stack);
      } else {
        const blob = new Blob([data.Body], { type: "application/pdf" });
        setBlobData(blob)
      }
    });
  }, [props.pdfName])


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
              state: { pdfName: props.pdfName,  blobData:blobData, redirect: "/nav/signdocuments" },
            }}
          >
            <button className="buttontoview" > View </button>
          </Link>

          <Link className="upload-docs" to={{
              pathname: "/nav/signdocuments/signaturetime",
              state: { pdfName: props.pdfName,  blobData:blobData },
            }}>
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
