import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { DELETE } from "../Graphql/Mutations";
import AuthApi from "../AuthApi";
import Cookies from "js-cookie";

export default function DeleteAccount() {
  const [remove_UserInfo_async] = useMutation(DELETE);
  const loggedIn = window.localStorage.getItem("state");
  const Auth = useContext(AuthApi);

  const handleSubmit = () => {
      handleOnDelete();
  };

  const handleOnDelete = () => {
    let answer = window.confirm(
      "Are you sure you want to delete your account?"
    );
    console.log(answer);
    if (answer) {
      Auth.setAuth(false);
      remove_UserInfo_async({
        variables: {
          id: loggedIn,
        },
      });
      Cookies.remove("user", "loginTrue");
      window.localStorage.clear();
    }
  };
  return (
    <Link to="/">
      <button onClick={handleSubmit} className="delete">
        Delete Account
      </button>
    </Link>
  );
}
