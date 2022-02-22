import React from "react";
import {Link} from "react-router-dom"
import "../App.css"


export default function UploadDocs() {
  return (
    <Link className = "upload-docs" to ="/nav/viewer" >
    <p className="titles">Upload Document</p>
     </Link>
  );
}
