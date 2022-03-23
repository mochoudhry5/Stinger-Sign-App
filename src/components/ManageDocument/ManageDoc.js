import React from "react";
import { Link } from "react-router-dom";

export default function ManageDoc() {
  return (
    <div>
      <Link className="upload-docs" to="/nav/managedocs">
        <div className="titles">Document History</div>
      </Link>
    </div>
  );
}
