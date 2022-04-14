import React, { useEffect, useState } from "react";
import AWS from "aws-sdk";
import { Link } from "react-router-dom";
import { S3Bucket } from "../../AWS/SecurityInfo";

export default function ViewSentDocument(props) {
  const [blobData, setBlobData] = useState();

  useEffect(() => {
    const getFile = () => {
      const s3 = new AWS.S3();
      const params = {
        Bucket: S3Bucket,
        Key: props.pdfName,
      };

      s3.getObject(params, (err, data) => {
        if (err) {
          console.log(err, err.stack);
        } else {
          const blob = new Blob([data.Body], { type: "application/pdf" });
          setBlobData(blob);
        }
      });
    };
    getFile(); 

  }, [props.pdfName]);


  return (
    <div>
      <Link
        className="upload-docs"
        to={{
          pathname: "/nav/signdocuments/viewdocument",
          state: {
            pdfName: props.pdfName,
            blobData: blobData,
            redirect: "/nav/managedocs",
          },
        }}
      >
        <button className="buttontoview"> View </button>
      </Link>
    </div>
  );
}
