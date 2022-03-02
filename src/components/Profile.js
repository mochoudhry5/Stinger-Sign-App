import React, { useContext } from "react";
import { USER_INFO } from "../Graphql/Query";
import { DELETE } from "../Graphql/Mutations";
import { useQuery, useMutation } from "@apollo/client";
import { Link } from "react-router-dom";
import AuthApi from "../AuthApi";
import Cookies from "js-cookie";
import "../styles/stylesheet.css"

export const Profile = () => {
  const Auth = useContext(AuthApi);
  const loggedIn = window.localStorage.getItem("state");
  const [remove_UserInfo_async] = useMutation(DELETE);
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


  const handleOnDelete = () => {
    let answer = window.confirm("Are you sure you want to delete your account?")
    console.log(answer);
    if(answer) {
    Auth.setAuth(false);
    remove_UserInfo_async({
      variables: {
        id: loggedIn,
      }
    })
    Cookies.remove("user", "loginTrue");
    window.localStorage.clear();
    }
    
  };

  return (
    <>
      <Link to="/">
        <button onClick={handleOnClick} className="logout">
          Log out
        </button>
      </Link>
      <div className="container-user">
      <hr className="hrline"/>
      <p className="userinfo">
        <strong>First Name:</strong>  <p className="userinfo-out">{data.get_UserInfo.userFirstName}</p>
      </p>
      <hr className="hrline"/>
      <p className="userinfo">
        <strong>Last Name:</strong>  <p className="userinfo-out">{data.get_UserInfo.userLastName}</p>
      </p>
      <hr className="hrline"/>
      <p className="userinfo">
        <strong>Email:</strong>  <p className="userinfo-out">{data.get_UserInfo.userEmail}</p>
      </p>
      <hr className="hrline"/>
      {data.get_UserInfo.userCompany ? (
      <p className="userinfo">
        <strong>Company:</strong> <p className="userinfo-out">{data.get_UserInfo.userCompany}</p>
      </p>
  
      ) : null}
      <hr className="hrline"/>
      {data.get_UserInfo.userJobTitle ? (
      <p className="userinfo">
        <strong>Job Title:</strong>  <p className="userinfo-out">{data.get_UserInfo.userJobTitle}</p>
      </p>
      ) : null}
      <hr className="hrline"/>
      <Link to="/">
        <button onClick={handleOnDelete} className="delete">
          Delete Account
        </button>
      </Link>
      </div>
    </>
  );
};
