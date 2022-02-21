import React, { useState, useEffect, useContext } from "react";
import { USER_INFO } from "../Graphql/Query";
import { useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import AuthApi from "../AuthApi";
import Cookies from "js-cookie";

export const ViewInfo = () => {
  const { error, loading, data } = useQuery(USER_INFO);
  const [showUsers, setShowUsers] = useState(false);
  const Auth = useContext(AuthApi);
  
  if (loading) return <div> LOADING... </div>;
  if (error) return <div> ERROR </div>;

  const handleButtonClick = () => {
    setShowUsers((prev) => !prev);
  };

  const handleOnClick = () => {
    Auth.setAuth(false);
    Cookies.remove("user");
  };

  return (
    <>
      {showUsers ? (
        <div>
          <button type="button" onClick={handleButtonClick}>
            {" "}
            Close information
          </button>
          <Link to="/">
            <button className="fluid ui button blue">Log out</button>
          </Link>
          {data.list_UserInfoItems._UserInfoItems.map((item) => {
            return (
              <div key={item._id}>
                <div key={item._id}>
                  <strong>My First Name:<br /></strong> {item.userFirstName} <br /> <hr/>
                  <strong>My Last Name:<br /></strong> {item.userLastName} <br /> <hr/>
                   <strong>Document (Sent): </strong> {item.docsSent.sentInfo.map((items) => {
                    return (
                      <div key={item._id}>
                          {items.recieverPDFName} <br /> <hr/>
                          <strong>When: <br /></strong> {items.timeSent}: <br /> <hr/>
                          <strong>Individuals I sent {items.recieverPDFName}: </strong><br />
                          {items.usersRecieved.map(name => <p>{name}</p>)} 
                      </div>
                    );
                  })}
                  <hr />
                   <strong>Document (Received): </strong> {item.docsToSign.info.map((i) => {
                    return (
                      <div key={item._id}>
                          {i.senderPDFName} <br /> <hr/>
                          <strong>When: <br /></strong> {i.timeOfSend} <br /> <hr/>
                           <strong>From who: <br /></strong> {i.fromWho} <br /> <hr/>
                          <strong>  Individuals {i.senderPDFName} sent to: </strong> <br />
                          {i.sentToWho.map(name => 
                           <p> {name} </p> )} <hr/>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div>
          <button type="button" onClick={handleButtonClick}>
            Show all Document Information
          </button>
          <Link to="/">
            <button onClick={handleOnClick} className="fluid ui button blue">Log out</button>
          </Link>
        </div>
      )}
    </>
  );
};
