import React from "react";
import {Link} from "react-router-dom"
import "../../styles/App.css"


export default function UploadDocumentHeader() {
  return (
    <Link className = "upload-docs" to ="/nav/viewer" >
    <p className="titles">Upload Document</p>
     </Link>
  );
}
