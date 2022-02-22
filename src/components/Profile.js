import React, { useContext } from "react";
import { USER_INFO } from "../Graphql/Query";
import { useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import AuthApi from "../AuthApi";
import Cookies from "js-cookie";
import "../stylesheet.css"

export const Profile = () => {
  const Auth = useContext(AuthApi);
  const loggedIn = window.localStorage.getItem("state");
  const { error, loading, data } = useQuery(USER_INFO, {
    variables: {
      id: loggedIn,
    },
  });

  if (loading) return <div> Loading... </div>;
  if (error) return <div> ERROR: {error.message} </div>;

  const handleOnClick = () => {
    Auth.setAuth(false);
    Cookies.remove("user", "loginTrue");
    window.localStorage.clear();
  };

  return (
    <>
      <Link to="/">
        <button onClick={handleOnClick} className="logout">
          Log out
        </button>
      </Link>
      <div className="container-user">
      <p>
        <strong>First Name:</strong> {data.get_UserInfo.userFirstName}{" "}
      </p>
      <p>
        <strong>Last Name:</strong> {data.get_UserInfo.userLastName}{" "}
      </p>
      <p>
        <strong>Email:</strong> {data.get_UserInfo.userEmail}{" "}
      </p>
      {data.get_UserInfo.userCompany ? (
      <p>
        <strong>Company:</strong> {data.get_UserInfo.userCompany}{" "}
      </p>
      ) : null}
      {data.get_UserInfo.userJobTitle ? (
      <p>
        <strong>Job Title:</strong> {data.get_UserInfo.userJobTitle}{" "}
      </p>
      ) : null}
      </div>

      {data.get_UserInfo.docsSent ? (
      data.get_UserInfo.docsSent.sentInfo.map((item) => {
        return (
          <div>
            <span>
              <strong>Documents that I sent: <br/></strong>
              [When: {item.timeSent}]<br /> 
              [Name of document: {item.recieverPDFName}] <br/>
            </span>
              <span>[To who:{item.usersRecieved.map((i) => " " + i)}] <br/> </span>
          </div>
        );
      })
      ) : ( <strong>Documents that I sent: NONE (Don't be shy!)<br/></strong>)}

       {data.get_UserInfo.docsToSign ? (
      data.get_UserInfo.docsToSign.info.map((item) => {
        return (
          <div>
            <span>
              <strong>Documents sent to me: <br/></strong>
              [When: {item.timeOfSend}]<br /> 
              [From: {item.fromWho}]<br /> 
              [Name of document: {item.senderPDFName}] <br/>

            </span>
              <span>[Sent to who:{item.sentToWho.map((i) => " " + i)}] <br/> </span>
          </div>
        );
      })): ( <strong>Documents sent to me: NONE (Make some friends)<br/></strong>)}
    </>
  );
};
