import React, { useContext } from "react";
import { USER_INFO } from "../../Graphql/Query";
import { useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import AuthApi from "../../AuthApi";
import Cookies from "js-cookie";
import DeleteAccount from "./DeleteAccount";
import { useLocation } from "react-router-dom";
import "../../styles/stylesheet.css";

export const Profile = () => {
  const Auth = useContext(AuthApi);
  const loggedIn = window.localStorage.getItem("state");
  const location = useLocation();
  const image = location.state.image;
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
      <h3 className="header-prof">
        {" "}
        {data.get_UserInfo.userFirstName}'s Profile{" "}
      </h3>
      <hr className="hrline"/>
      <div className="flex-container">
        <div className="flex-child">
          <div className="container-user">
          <p className="userinfo">
            <strong className="first-prof">First Name:</strong>
            <input
              className="profile-det"
              type="text"
              required={true}
              readOnly={true}
              value={data.get_UserInfo.userFirstName}
            />
          </p>
          <p className="userinfo">
            <strong className="last-prof">Last Name:</strong>
            <input
              className="profile-det"
              type="text"
              required={true}
              readOnly={true}
              value={data.get_UserInfo.userLastName}
            />
          </p>
          <p className="userinfo">
            <strong className="email-prof">Email:</strong>
            <input
              className="profile-det"
              name="email"
              type="text"
              value={data.get_UserInfo.userEmail}
            />
          </p>
          {data.get_UserInfo.userCompany ? (
            <p className="userinfo">
              <strong className="company-prof">Company:</strong>
              <input
                className="profile-det"
                name="company"
                type="text"
                required={true}
                readOnly={true}
                value={data.get_UserInfo.userCompany}
              />
            </p>
          ) : null}
          {data.get_UserInfo.userJobTitle ? (
            <p className="userinfo">
              <strong className="job-prof">Job Title:</strong>
              <input
                className="profile-det"
                type="text"
                name="jobtitle"
                required={true}
                readOnly={true}
                value={data.get_UserInfo.userJobTitle}
              />
            </p>
          ) : null}
          </div>
        </div>

        <div class="flex-child2 magenta">
        <img className="nav--logo3" src={image} alt="" />
        </div>
      </div>
      <hr className="hrline"/>
      <Link to="/">
        <button onClick={handleOnClick} className="logout">
          Log out
        </button>
        <br />
        <br />
      </Link>
      <DeleteAccount />
    </>
  );
};
