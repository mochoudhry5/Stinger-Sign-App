import React, { useEffect } from "react";
import { Link } from "react-router-dom";

export default function SentSuccessfully() {
  useEffect(() => {
    localStorage.setItem("emails", "");
  }, []);

  const reloadPage = () => {
    window.location.reload();
  };

  return (
    <div>
      <p className="signedandsentupload"> Sent Successfully! </p>
      <p className="signedandsentupload2" onClick={reloadPage}>
        Go to Home page
      </p>
    </div>
  );
}
