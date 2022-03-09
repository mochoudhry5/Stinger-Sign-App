import ReqSignatures from "./ReqSignatures";
import React, { useEffect } from "react";
import UploadDocs from "./UploadDocs";
import ManageDoc from "./ManageDoc";
import { USER_INFO } from "../Graphql/Query";
import { useQuery } from "@apollo/client";

export default function Dashboard(props) {
  const loggedIn = window.localStorage.getItem("state");
  const { error, loading, data } = useQuery(USER_INFO, {
    variables: {
      id: loggedIn,
    },
  });

  useEffect(() => {
    localStorage.removeItem("emails");
    localStorage.removeItem("ids")
    
  }, [])

  if (loading) return <div> Loading... </div>;
  if (error) return <div> ERROR: {error.message} </div>;

  const Footer = () => (
    <div className="footer">
      <p>©2022 StingerSign, LLC. No Rights Reserved.</p>
    </div>
  );

  return (
    <div>
      <h1 className="title" align="center">
        {data.get_UserInfo.userFirstName}'s Dashboard
      </h1>
      <ReqSignatures />
      <br />
      <ManageDoc />

      <br />
      <UploadDocs />
      <br />
      {Footer()}
    </div>
  );
}
