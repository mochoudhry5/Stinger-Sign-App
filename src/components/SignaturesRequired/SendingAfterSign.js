import React, { useState } from "react";
import AWS from "aws-sdk";
import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
import {
  GET_SENT_INFO_DOCS_TO_SIGN,
  DOCS_SENT_OR_SIGNED,
} from "../../Graphql/Query";
import {
  UPDATE_SENDER_INFO_TOSIGN,
  UPDATE_SENDER_INFO_,
  UPDATE_FILE
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

export default function SendingAfterSign(props) {
  const [progress, setProgress] = useState(0);
  const loggedIn = window.localStorage.getItem("state");
  const [update, { loading: loading1 }] = useMutation(UPDATE_SENDER_INFO_);
  const [updateToSign, {loading: loading4}] = useMutation(UPDATE_SENDER_INFO_TOSIGN);
  const [updateFile, {loading: loading6}] = useMutation(UPDATE_FILE);
  const [getNextUserInfo, { data: data1, loading: loading5 }] = useLazyQuery(
    GET_SENT_INFO_DOCS_TO_SIGN
  );

  const { data, loading } = useQuery(DOCS_SENT_OR_SIGNED, {
    variables: {
      id: props.fromWho,
    },
  });

  if (loading || loading1) {
    return (
      <button disabled className="button-senduser-sign">
        Loading...
      </button>
    );
  }

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
        sendToVendia(file);
        setProgress(Math.round((evt.loaded / evt.total) * 100));
      })
      .send((err) => {
        if (err) console.log(err);
      });
  };

  const sendToVendia = (file) => {
    console.log(props.fileID)
    updateFile({
      variables: {
        id: props.fileID,
        syncMode: "NODE_LEDGERED"
      },
    });
    putInUserDocToSign(file);
    if (props.nextUsers.length > 0) {
      getDataForNextUser(file);
    } else {
      changeOrginalInfo(file);
    }
  };

  const putInUserDocToSign = (file) => {
    updateToSign({
      variables: {
        id: loggedIn,
        documentsToSignInfo: props.prevToSign,
      },
    });
  };

  const getDataForNextUser = (file) => {
    getNextUserInfo({
      variables: {
        id: props.nextUsers[0],
      },
    });
    getReasonForDocument(file);
    putInNextUserToSign(file);
  };

  const setNextUserDocToSign = (file) => {
    let tempArray = [];
    if (data1) {
      if (data1.get_UserInfo.documentsToSign) {
        data1.get_UserInfo.documentsToSign.documentsToSignInfo.map(
          (document) => {
            let tempObject = {};
            tempObject.isSigned = document.isSigned;
            tempObject.pdfName = document.pdfName;
            tempObject.nextToSend = document.nextToSend;
            tempObject.timeOfSend = document.timeOfSend;
            tempObject.fromWho = document.fromWho;
            tempObject.reasonForSigning = document.reasonForSigning;
            tempArray.push(tempObject);
          }
        );
      }
    }
    console.log(tempArray);
    return tempArray;
  };

  const putInNextUserToSign = (file) => {
    const tempArray = setNextUserDocToSign(file);
    const reason = getReasonForDocument(file);
    const d = new Date();
    const date = d.toString();
    const newFile = {
      fromWho: props.fromWho, // Will need to be the original sender
      pdfName: file.name,
      isSigned: false,
      nextToSend: props.nextUsers.slice(1), // Need to grab nextToSend data
      timeOfSend: date,
      reasonForSigning: reason,
    };
    tempArray.push(newFile);
    updateToSign({
      variables: {
        id: props.nextUsers[0],
        documentsToSignInfo: tempArray,
      },
    });
  };

  const noMoreSignatures = (file) => {
    let tempArray = [];
    if (data) {
      if (data.get_UserInfo.documentsSent) {
        data.get_UserInfo.documentsSent.documentsSentInfo.map((document) => {
          let tempObject = {};
          if (file.name === document.pdfName) {
            tempObject.isCompleted = true;
          } else {
            tempObject.isCompleted = document.isCompleted;
          }
          tempObject.pdfName = document.pdfName;
          tempObject.usersSentTo = document.usersSentTo;
          tempObject.timeSent = document.timeSent;
          tempObject.reasonForSigning = document.reasonForSigning;
          tempObject.isRejected = document.isRejected;
          tempArray.push(tempObject);
        });
      }
    }
    return tempArray;
  };

  const changeOrginalInfo = (file) => {
    let tempArray = noMoreSignatures(file);
    update({
      variables: {
        id: props.fromWho,
        documentsSentInfo: tempArray,
      },
    });
  };

  const getReasonForDocument = (file) => {
    console.log(data);
    let temp = "N";
    if (data) {
      if (data.get_UserInfo.documentsSent) {
        data.get_UserInfo.documentsSent.documentsSentInfo.map((document) => {
          if (document.pdfName === props.pdfName) {
            temp = document.reasonForSigning;
          }
        });
      }
    }
    return temp;
  };

  return (
    <div>
      {progress === 0 ? (
        <>
          <button
            className="button-senduser-sign"
            onClick={() => {
              uploadFile(props.file);
            }}
          >
            Send Document
          </button>
        </>
      ) :  loading || loading6 || loading4 || loading5 ? (
        <button
        disabled
            className="button-senduser-sign"
          >
           Loading...
          </button>
      ) : <p className="signedandsent">Signed and Sent!</p> }
    </div>
  );
}
