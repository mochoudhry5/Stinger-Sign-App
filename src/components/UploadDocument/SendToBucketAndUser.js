import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Redirect } from "react-router-dom";
import { S3Bucket, MyBucket, Region } from "../../AWS/SecurityInfo";
import { GET_DOCS_TO_SIGN_INFO } from "../../Graphql/Query";
import {
  ADD_FILE_TO_VENDIA,
  UPDATE_DOCS_TO_SIGN_FOR_USER,
  UPDATE_DOCS_SENT_FOR_USER,
} from "../../Graphql/Mutations";
import "../../styles/sendingpdf.css";

export default function SendToBucketAndUser(props) {
  const [progress, setProgress] = useState(0);
  const loggedIn = window.localStorage.getItem("state");
  let { loading: loading3, data: data3 } = useQuery(GET_DOCS_TO_SIGN_INFO, {
    variables: {
      id: props.ids[0],
    },
  });
  const [addVendia_File_async, { loading: loading1 }] =
    useMutation(ADD_FILE_TO_VENDIA);
  const [updateToSign, { loading, data: data1 }] = useMutation(
    UPDATE_DOCS_TO_SIGN_FOR_USER
  );
  const [update, { loading: loading2, data }] = useMutation(
    UPDATE_DOCS_SENT_FOR_USER
  );

  if(loading3) return <div></div>

  if (loading || loading1 || loading2 ) {
    return (
      <button disabled className="button-senduser">
        Loading...
      </button>
    );
  }

  const uploadFile = (file) => {
    console.log("Ran uploadFile in SendToBucketAndUser.js");
    const params = {
      ACL: "public-read",
      Body: file,
      Bucket: S3Bucket,
      Key: file.name,
    };

    MyBucket.putObject(params)
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
        sourceBucket: S3Bucket,
        sourceKey: file.name,
        sourceRegion: Region,
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

  const setPrevToSignFiles = () => {
    let tempArray = [];
    if (data3.get_UserInfo.documentsToSign) {
      data3.get_UserInfo.documentsToSign.documentsToSignInfo.map((document) => {
        let tempObject = {};
        tempObject.pdfName = document.pdfName;
        tempObject.nextToSend = document.nextToSend;
        tempObject.timeOfSend = document.timeOfSend;
        tempObject.isSigned = document.isSigned;
        tempObject.fromWho = document.fromWho;
        tempObject.reasonForSigning = document.reasonForSigning;
        tempArray.push(tempObject);
      });
    }
    return tempArray;
  };

  const putInUserDocToSign = (file) => {
    let docsToSign = setPrevToSignFiles();
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
    docsToSign.push(newFile);
    updateToSign({
      variables: {
        id: props.ids[0],
        documentsToSignInfo: docsToSign,
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
      ) : (!data && !data1) || loading || loading1 || loading2 ? (
        <button disabled className="button-senduser">
          Loading...
        </button>
      ) : (
        <Redirect to="/nav/signdocuments/sentsuccess" />
      )}
    </div>
  );
}
