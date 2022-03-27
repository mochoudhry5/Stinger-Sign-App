import React from "react";
import { Link } from "react-router-dom";

export default function DocumentHistoryHeader() {
  return (
    <div className="titles">
      <Link className="upload-docs" to="/nav/managedocs">
        <div className="titles">Document History</div>
      </Link>
    </div>
  );
}
