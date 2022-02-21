import React, { useContext } from "react";
import { USER_INFO } from "../Graphql/Query";
import { useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import AuthApi from "../AuthApi";
import Cookies from "js-cookie";

export const ViewInfo = () => {
  const Auth = useContext(AuthApi);
  const loggedIn = window.localStorage.getItem('state');
  const {error, loading, data} = useQuery(USER_INFO, {
    variables: {
      id : loggedIn,
    }
  });

  console.log(Auth.loggedInUser)
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
        <button onClick={handleOnClick} className="fluid ui button blue">
          Log out
        </button>
      </Link>
      <h2> My Information </h2>
      {JSON.stringify(data)}
    </>
  );
};
