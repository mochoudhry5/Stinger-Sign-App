import React, { useState } from "react";
import AWS from "aws-sdk";
import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
import {
  GET_SENT_INFO_DOCS_TO_SIGN,
  DOCS_SENT_OR_SIGNED,
} from "../../Graphql/Query";
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

export default function SendingAfterSign(props) {
  const [progress, setProgress] = useState(0);
  const loggedIn = window.localStorage.getItem("state");
  const [update] = useMutation(UPDATE_SENDER_INFO_);
  const [addVendia_File_async] = useMutation(ADD_FILE_TO_VENDIA);
  const [updateToSign] = useMutation(UPDATE_SENDER_INFO_TOSIGN);
  const [getNextUserInfo, { data: data1 }] = useLazyQuery(GET_SENT_INFO_DOCS_TO_SIGN);

  const { data } = useQuery(DOCS_SENT_OR_SIGNED, {
    variables: {
      id: props.fromWho,
    },
  });

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
    console.log(props.nextUsers[0])
    getNextUserInfo({
      variables: {
        id: props.nextUsers[0]
      }
    })
    putInNextUserToSign(file)
  }

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
    const tempArray = setNextUserDocToSign(file)
    const d = new Date();
    const date = d.toString();
    const newFile = {
      fromWho: props.fromWho, // Will need to be the original sender
      pdfName: file.name,
      isSigned: false,
      nextToSend: props.nextUsers.slice(1), // Need to grab nextToSend data
      timeOfSend: date,
      reasonForSigning: props.reason,
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
      if (data.get_UserInfo.documentsToSign) {
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
    let tempArray = noMoreSignatures(file)
    update({
      variables: {
        id: props.fromWho,
        documentsSentInfo: tempArray,
      },
    });
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
            Send to User(s)
          </button>
        </>
      ) : <p> Sent! </p>}
    </div>
  );
}