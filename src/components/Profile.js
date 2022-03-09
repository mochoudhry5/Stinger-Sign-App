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
    <h3 className="header-prof"> {data.get_UserInfo.userFirstName}'s Profile </h3>
      <div className="container-user">
      <hr className="hrline"/>
      <p className="userinfo">
        <strong className="first-prof">First Name:</strong> 
        <input className = "profile-det" type='text' required = {true} readOnly = {true} value={data.get_UserInfo.userFirstName} />
      </p>
      <hr className="hrline"/>
      <p className="userinfo">
        <strong className="last-prof">Last Name:</strong> 
         <input className = "profile-det" type='text' required = {true} readOnly = {true} value={data.get_UserInfo.userLastName} />
      </p>
      <hr className="hrline"/>
      <p className="userinfo">
        <strong className="email-prof">Email:</strong> 
         <input className = "profile-det" name="email" type='text' value={data.get_UserInfo.userEmail} />
      </p>
      <hr className="hrline"/>
      {data.get_UserInfo.userCompany ? (
      <p className="userinfo">
        <strong className="company-prof">Company:</strong> 
        <input className = "profile-det" name="company" type='text' required = {true} readOnly = {true} value={data.get_UserInfo.userCompany} />
      </p>
  
      ) : null}
      <hr className="hrline"/>
      {data.get_UserInfo.userJobTitle ? (
      <p className="userinfo">
        <strong className="job-prof">Job Title:</strong>  
        <input className = "profile-det" type='text' name="jobtitle" required = {true} readOnly = {true} value={data.get_UserInfo.userJobTitle} />
      </p>
      ) : null}
      <hr className="hrline"/>
      <Link to="/">
        <button onClick={handleOnClick} className="logout">
          Log out
        </button>
        <br/>
        <br/>
      </Link>
      <Link to="/">
        <button onClick={handleOnDelete} className="delete">
          Delete My Account
        </button>
      </Link>
      </div>
    </>
  );
};
