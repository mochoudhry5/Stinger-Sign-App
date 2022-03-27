import React, { useEffect, useState } from "react";
import AWS from "aws-sdk";
import { Link } from "react-router-dom";

const S3_BUCKET = process.env.REACT_APP_S3_BUCKET_NAME;

AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
});


export default function ViewSentDocument(props) {
    const [blobData, setBlobData] = useState()

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



  return (
    <div>
        <Link className="upload-docs" to={{
              pathname: "/nav/signdocuments/viewdocument",
              state: { pdfName: props.pdfName,  blobData:blobData, redirect: "/nav/managedocs" },
            }}>
            <button className="buttontoview"> View </button>
          </Link>
    </div>
  )
}
