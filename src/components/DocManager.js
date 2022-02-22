import { Worker } from "@react-pdf-viewer/core";
import { Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import React, { useState } from "react";
import AWS from "aws-sdk";
import "../signupform.css";

const S3_BUCKET = "signatures-stingersign";
const REGION = "us-west-2";

AWS.config.update({
  accessKeyId: process.env.REACT_APP_ACCESS_KEY,
  secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
});

const myBucket = new AWS.S3({
  params: { Bucket: S3_BUCKET },
  region: REGION,
});

function DocManager() {
  // creating new plugin instance
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const [pdfFile, setPdfFile] = useState();
  const [pdfError, setPdfError] = useState("");
  const allowedFiles = ["application/pdf"];
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFile = (e) => {
    let selectedFile = e.target.files[0];
    setSelectedFile(e.target.files[0]);
    if (selectedFile) {
      if (selectedFile && allowedFiles.includes(selectedFile.type)) {
        let reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onloadend = (e) => {
          setPdfError("");
          setPdfFile(e.target.result);
        };
      } else {
        setPdfError("Not a valid pdf: Please select only PDF");
        setPdfFile("");
      }
    } else {
      console.log("please select a PDF");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

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

  return (
    <div className="container">
      {/* Upload PDF */}
      <form className="form-doc" onSubmit={handleSubmit}>
        <label>
          <h2 className="titles">Upload and Send</h2>
        </label>
        <hr/>
        <div className="field-doc">
        <input
          type="file"
          className="send-docs"
          onChange={handleFile}
        ></input>
        {progress !== 0 && progress !== 100 ? (
          <div>Sending...({progress}%)</div>
        ) : null}
        {progress === 100 ? <div>Sent!</div> : null}
        <button className="send-doc" onClick={() => uploadFile(selectedFile)}>
          {" "}
          Send Document to User(s)
        </button>
        </div>
        {pdfError && <span className="text-danger">{pdfError}</span>}
      </form>

      {/* View PDF */}
      <div className="viewer">
        {/* render this if we have a pdf file */}
        {pdfFile && (
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.12.313/build/pdf.worker.min.js">
            <Viewer
              fileUrl={pdfFile}
              plugins={[defaultLayoutPluginInstance]}
            ></Viewer>
          </Worker>
        )}

        {/* render this if we have pdfFile state null   */}
        {!pdfFile && <div className="pdftext">Add a file to view or edit!</div>}
      </div>
    </div>
  );
}

export default DocManager;
