import React, { useState } from "react";
import AWS from "aws-sdk";
import { useMutation } from "@apollo/client";
import { UPDATE_SENDER_INFO } from "../Graphql/Mutations";
import { GET_SENT_INFO } from "../Graphql/Query";
import { useQuery } from "@apollo/client";
import "../styles/sendingpdf.css";

const S3_BUCKET = "ENTER_BUCKET_NAME";
const REGION = "us-west-2";

AWS.config.update({
  accessKeyId: "ACCESS_KEY",
  secretAccessKey: "SECRET_ACCESS_KEY",
});

const myBucket = new AWS.S3({
  params: { Bucket: S3_BUCKET },
  region: REGION,
});

export default function SendToBucketAndUser(props) {
  const [progress, setProgress] = useState(0);
  const loggedIn = window.localStorage.getItem("state");
  const [update_UserInfo_async] = useMutation(UPDATE_SENDER_INFO);

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
      });
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
      <br />
      <button
        className="button-adduser"
        onClick={() => putInMyDocsSent(props.file)}
      >
        send
      </button>
      <br />
    </div>
  );
}
