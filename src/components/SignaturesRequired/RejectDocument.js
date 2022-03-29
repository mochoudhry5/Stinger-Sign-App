import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { GET_SENT_INFO_DOCS_TO_SIGN, GET_SENT_INFO } from "../../Graphql/Query";
import { useLocation } from "react-router-dom";
import {
  UPDATE_SENDER_INFO_TOSIGN,
  UPDATE_SENDER_INFO_,
  DELETE_FILE_VENDIA
} from "../../Graphql/Mutations";

export default function RejectDocument() {
  const location = useLocation();
  const pdfName = location.state.pdfName;
  const senderID = location.state.senderID;
  const fileId = location.state.fileID;
  const loggedIn = window.localStorage.getItem("state");
  const [rejectDocument, setRejectDocument] = useState(false);
  const [updateToSign, { loading }] = useMutation(UPDATE_SENDER_INFO_TOSIGN);
  const [deleteFile, { loading: loading4 }] = useMutation(DELETE_FILE_VENDIA);
  const [updateSent, { loading: loading1 }] = useMutation(UPDATE_SENDER_INFO_);
  const { loading: loading2, data } = useQuery(GET_SENT_INFO_DOCS_TO_SIGN, {
    variables: {
      id: loggedIn,
    },
  });
  const { loading: loading3, data: data1 } = useQuery(GET_SENT_INFO, {
    variables: {
      id: senderID,
    },
  });

  if (loading1) (<div> Loading...</div>);
  if (loading)  (<div> Loading...</div>);
  if (loading2)  (<div> Loading...</div>);
  if (loading3)  (<div> Loading...</div>);
  if (loading4)  (<div> Loading...</div>);

  const handleOnClick = () => {
    deleteFileVendia();
    let tempArray = [];
    data.get_UserInfo.documentsToSign.documentsToSignInfo.map((document) => {
      if (document.pdfName !== pdfName) {
        let tempObject = {};
        tempObject.pdfName = document.pdfName;
        tempObject.nextToSend = document.nextToSend;
        tempObject.timeOfSend = document.timeOfSend;
        tempObject.isSigned = document.isSigned;
        tempObject.fromWho = document.fromWho;
        tempObject.reasonForSigning = document.reasonForSigning;
        tempArray.push(tempObject);
      }
    });
    modifyDocsToSign(tempArray);
  };

  const modifyDocsToSign = (tempArray) => {
    updateToSign({
      variables: {
        id: loggedIn,
        documentsToSignInfo: tempArray,
      },
    });
    handleOnClick2()
  };

  const handleOnClick2 = () => {
    let tempArray = [];
    data1.get_UserInfo.documentsSent.documentsSentInfo.map((document) => {
      let tempObject = {};
      tempObject.pdfName = document.pdfName;
      tempObject.timeSent = document.timeSent;
      tempObject.usersSentTo = document.usersSentTo;
      tempObject.reasonForSigning = document.reasonForSigning;
      if (document.pdfName === pdfName) {
        tempObject.isRejected = true;
      } else {
        tempObject.isRejected = document.isRejected;
      }
      tempArray.push(tempObject);
    });
    modifyDocsSent_Sender(tempArray);
  };

  const modifyDocsSent_Sender = (tempArray) => {
    updateSent({
      variables: {
        id: senderID,
        documentsSentInfo: tempArray,
      },
    });
    setRejectDocument(true);
  };

  const deleteFileVendia = () => {
    console.log(fileId)
    deleteFile({
      variables: {
        id: fileId,
        syncMode: "NODE_LEDGERED"
      }
    })
  }

  return (
    <div>
      <h2 className="titles"> Reject Document </h2>
      {!rejectDocument ? (
        <>
          <p className="rejectbody"> You will be rejecting this document.
            <br /> Are you sure?
          </p>
          <span>
            <button className="btnyes" onClick={handleOnClick}>
              {" "}
              Yes{" "}
            </button>
            <Link
              className="upload-docs"
              to={{
                pathname: "/nav/signdocuments",
                state: { pdfName: "placeholder", fileData: "placeholder" },
              }}
            >
              <button className="btnno"> No </button>
            </Link>
          </span>
        </>
      ) : (
        <div className="reject-title"> Document has been rejected! </div>
      )}
    </div>
  );
}
