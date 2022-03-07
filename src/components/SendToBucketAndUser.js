import React, { useState } from "react";
import AWS from "aws-sdk";
import { useMutation } from "@apollo/client";
import { UPDATE_SENDER_INFO } from "../Graphql/Mutations";
import { ADD_FILE_TO_VENDIA, ADD_TO_USER_TOSIGN } from "../Graphql/Mutations";
import "../styles/sendingpdf.css";

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
  const [update_UserInfo_async] = useMutation(UPDATE_SENDER_INFO);
  const [addVendia_File_async] = useMutation(ADD_FILE_TO_VENDIA);
  const [updateToSign] = useMutation(ADD_TO_USER_TOSIGN)

  const uploadFile = (file) => {
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
        destinationKey: file.name
      },
    });

    putInMyDocsSent(file);
    putInUserDocToSign(file)
  };

  const putInMyDocsSent = (file) => {
    const d = new Date();
    const date = d.toString();
    update_UserInfo_async({
      variables: {
        id: loggedIn,
        recieverPDFName: file.name,
        usersRecieved: props.userEmail,
        timeSent: date,
      },
    });
  };

  const putInUserDocToSign = (file) => {
    const d = new Date();
    const date = d.toString();
    updateToSign({
      variables: {
        id: props.ids[0],
        fromWho: loggedIn,
        isSignedOrNot: false,
        senderPDFName: file.name,
        sentToWho: props.ids.slice(1),
        timeOfSend: date
      }
    })
  }

  return (
    <div>
      {progress !== 0 && progress !== 100 ? (
        <div className="progress">Sending...({progress}%)</div>
      ) : null}
      {progress === 100 ? <div className="progress">Sent!</div> : null}
      <button className="button-adduser" onClick={() => uploadFile(props.file)}>
        {" "}
        Send to User(s){" "}
      </button>{" "}
    </div>
  );
}
