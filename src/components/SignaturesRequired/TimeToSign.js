import React, { useEffect, useRef, useState } from "react";
import WebViewer from "@pdftron/webviewer";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import SendingAfterSign from "./SendingAfterSign";
import { GET_DOCS_TO_SIGN_INFO } from "../../Graphql/Query";
import { useQuery } from "@apollo/client";

export default function TimeToSign(props) {
  const [file, setFile] = useState({});
  const [fromWho, setFromWho] = useState("");
  const [nextUsers, setNextUsers] = useState();
  const location = useLocation();
  const blobData = location.state.blobData;
  const fileId = location.state.fileID;
  const pdfName = location.state.pdfName;
  const viewer = useRef(null);
  const [prevToSign, setPrevToSign] = useState([]);
  const loggedIn = window.localStorage.getItem("state");
  const { loading: loading1, data: data1 } = useQuery(
    GET_DOCS_TO_SIGN_INFO,
    {
      variables: {
        id: loggedIn,
      },
    }
  );

  if (loading1) (<div>Loading...</div>);

  useEffect(() => {
    console.log("USE EFFECT -> TimeTOSIGN");
    console.log(pdfName)
    let tempArray = []
    if (data1) {
      if (data1.get_UserInfo.documentsToSign) {
        data1.get_UserInfo.documentsToSign.documentsToSignInfo.map(
          (document) => {
            let tempObject = {};
            if(pdfName === document.pdfName) {
              let tempFrom = document.fromWho; 
              let tempNext = document.nextToSend;
              setFromWho(tempFrom);
              setNextUsers(tempNext)
              tempObject.isSigned = true; 
            }
            else {
              tempObject.isSigned = document.isSigned;
            }
            tempObject.pdfName = document.pdfName;
            tempObject.nextToSend = document.nextToSend;
            tempObject.timeOfSend = document.timeOfSend;
            tempObject.fromWho = document.fromWho;
            tempObject.reasonForSigning = document.reasonForSigning;
            tempArray.push(tempObject);
          }
        );
      }
      setPrevToSign(tempArray);
    }
  }, [data1, pdfName, fileId]);

  useEffect(() => {
    WebViewer(
      {
        path: "/webviewer/lib",
      },
      viewer.current
    ).then((instance) => {
      const { documentViewer, annotationManager } = instance.Core;
      instance.UI.loadDocument(blobData, { filename: pdfName });
      instance.UI.setTheme("dark");
      instance.UI.disableElements(["toolbarGroup-Shapes"]);
      instance.UI.disableElements(["toolbarGroup-Edit"]);
      instance.UI.disableElements(["toolbarGroup-Annotate"]);
      instance.UI.setToolbarGroup(instance.UI.ToolbarGroup.FORMS);
      instance.UI.setHeaderItems((header) => {
        header.push({
          type: "actionButton",
          img: "https://www.seekpng.com/png/detail/395-3956812_save-file-button-save-button-logo-png.png",
          onClick: async () => {
            const doc = documentViewer.getDocument();
            const xfdfString = await annotationManager.exportAnnotations();
            const data = await doc.getFileData({ xfdfString });
            const arr = new Uint8Array(data);
            const blob = new Blob([arr], { type: "application/pdf" });
            const file = new File([blob], pdfName, {
              type: "application/pdf",
            });
            setFile(file);
          },
        });
      });
    });
  }, [blobData, pdfName]);

  return (
    <div>
      <Link
        className="upload-docs"
        to={{
          pathname: "/nav/signdocuments",
          state: { pdfName: props.pdfName, fileData: "HELO" },
        }}
      >
        <button className="backclick"> &lt;Back</button>
      </Link>
      <span className="title-sends">Sign Document</span>
      <div className="steps">
        <p className="stepsnum">Step 1:</p> Find Where To Sign (Hover over the
        blue rectangles) <br /> <br />
        <p className="stepsnum">Step 2:</p> Switch Tab From Forms To Fill And
        Sign <br /> <br />
        <p className="stepsnum">Step 3:</p> Click On The Respected Signatue Box{" "}
        <br /> <br />
        <p className="stepsnum">Step 4:</p> Sign The Document <br /> <br />
        <p className="stepsnum">Step 5:</p> Hit Save And Send The Document{" "}
        <br /> <br />
      </div>
      <SendingAfterSign fileID={fileId} file={file} pdfName={pdfName} prevToSign={prevToSign} fromWho={fromWho} nextUsers={nextUsers} />
      <div className="webviewer" ref={viewer}></div>
    </div>
  );
}
