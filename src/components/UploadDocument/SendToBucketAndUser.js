import React, { useState } from "react";
import AWS from "aws-sdk";
import { useMutation } from "@apollo/client";
import { Redirect } from "react-router-dom";
import "../../styles/sendingpdf.css";
import {
  ADD_FILE_TO_VENDIA,
  UPDATE_SENDER_INFO_TOSIGN,
  UPDATE_SENDER_INFO_,
} from "../../Graphql/Mutations";

const S3_BUCKET = process.env.REACT_APP_S3_BUCKET_NAME;
const REGION = process.env.REACT_APP_S3_BUCKET_REGION_NAME;

AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
});

const myBucket = new AWS.S3({
  params: { Bucket: S3_BUCKET },
  region: REGION,
});

export default function SendToBucketAndUser(props) {
  const [progress, setProgress] = useState(0);
  const loggedIn = window.localStorage.getItem("state");
  const [addVendia_File_async, { loading: loading1 }] =
    useMutation(ADD_FILE_TO_VENDIA);
  const [updateToSign, { loading }] = useMutation(
    UPDATE_SENDER_INFO_TOSIGN
  );
  const [update, { loading: loading2 }] =
    useMutation(UPDATE_SENDER_INFO_);

  if (loading) <div> Loading...</div>;
  if (loading1) <div> Loading...</div>;
  if (loading2) <div> Loading...</div>;

  const uploadFile = (file) => {
    console.log("Ran uploadFile in SendToBucketAndUser.js");
    const params = {
      ACL: "public-read",
      Body: file,
      Bucket: S3_BUCKET,
      Key: file.name,
    };

    myBucket
      .putObject(params)
      .on("httpUploadProgress", (evt) => {
        setProgress(Math.round((evt.loaded / evt.total) * 100));
      })
      .send((err) => {
        if (err) console.log(err);
        else sendToVendia(file);
      });
  };

  const sendToVendia = (file) => {
    addVendia_File_async({
      variables: {
        sourceBucket: S3_BUCKET,
        sourceKey: file.name,
        sourceRegion: REGION,
        destinationKey: file.name,
      },
    });

    putInMyDocsSent(file);
    putInUserDocToSign(file);
  };

  const putInMyDocsSent = (file) => {
    const d = new Date();
    const date = d.toString();
    const newFile = {
      pdfName: file.name,
      usersSentTo: props.ids,
      timeSent: date,
      reasonForSigning: props.reason,
      isRejected: false,
      isCompleted: false,
    };
    props.prevFiles.push(newFile);
    update({
      variables: {
        id: loggedIn,
        documentsSentInfo: props.prevFiles,
      },
    });
  };

  const putInUserDocToSign = (file) => {
    const d = new Date();
    const date = d.toString();
    const newFile = {
      fromWho: loggedIn,
      pdfName: file.name,
      isSigned: false,
      nextToSend: props.ids.slice(1),
      timeOfSend: date,
      reasonForSigning: props.reason,
    };
    props.prevToSign.push(newFile);
    updateToSign({
      variables: {
        id: props.ids[0],
        documentsToSignInfo: props.prevToSign,
      },
    });
  };

  return (
    <div>
      {progress === 0 ? (
        <>
          <button
            className="button-senduser"
            onClick={() => {
              uploadFile(props.file);
            }}
          >
            Send to User(s)
          </button>
        </>
      ) : null}
      {progress === 100 ? (
        <div>
            <Redirect to="/" />
        </div>
      ) : null}
    </div>
  );
}
