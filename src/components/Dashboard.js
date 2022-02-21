import ReqSignatures from "./ReqSignatures";
import UploadDocs from "./UploadDocs";
import ManageDoc from "./ManageDoc";
import AuthApi from "../AuthApi";
import React, {useContext} from "react";

export default function Dashboard(props) {
  const Auth = useContext(AuthApi);
  const loggedIn = window.localStorage.getItem('state');

  
  return (
    <div>
      <h1 className="titles" align="center"> The SIMPLE Dashboard</h1>
      <h2> {loggedIn} </h2>
      <h2> {Auth.auth} </h2>
      <hr></hr>
      <ReqSignatures />
      <br />
      <hr></hr>
      <UploadDocs />
      <br />
      <hr></hr>
      <ManageDoc />
      <br />
      <hr></hr>
    </div>
  );
}
