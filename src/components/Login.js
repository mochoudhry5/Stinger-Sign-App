import React, { useContext, useState } from "react";
import Cookies from "js-cookie";
import { ALL_USERS } from "../Graphql/Query";
import { useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import Hornet from "../images/logo.png";
import axios from "axios";
import "../styles/loginstyle.css";
import AuthApi from "../AuthApi";

function Login() {
  const initialValues = {
    email: "",
    password: "",
  };
  const Auth = useContext(AuthApi);
  const [toRefetchData, setToRefetchData] = useState(0);
  const [formError, setFormError] = useState("");
  const [formValues, setFormValues] = useState(initialValues);
  const { error, loading, data, refetch } = useQuery(ALL_USERS);

  if (error) return <div> ERROR {error.message} </div>;

  const handleOnClick = () => {
    Auth.setAuth(true);
    Cookies.set("user", "loginTrue");
  };

  const handleChange = (e) => {
    if (toRefetchData < 1) {
      refetch();
      console.log("Refetched");
      setToRefetchData((toRefetchData) => toRefetchData + 1);
    }
    setFormError("");
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    validateUser();
  };

  const validateUser = async () => {
    let errors = "";
    let hashedPasswordForUser = "";
    let validEmail = false;
    let userId = "";

    data.list_UserInfoItems._UserInfoItems.map((item) => {
      if (item.userEmail === formValues.email.toLowerCase()) {
        validEmail = true;
        hashedPasswordForUser = item.userPassword;
        userId = item._id;
      }
    });
    const isCorrectPassword = await checkPasswordWithHashedPassword(hashedPasswordForUser);
    if (validEmail && isCorrectPassword === true) {
      setFormError("");
      handleOnClick();
      Auth.setLoggedInUser(userId);
      window.localStorage.setItem("state", userId);
    } else {
      errors = "Email or password is incorrect";
      setFormError(errors);
    }
  };

  const checkPasswordWithHashedPassword = async (vendiaStoredPassword) => {
    let temp = false;
    const options = {
      method: "GET",
      url: "http://localhost:8000/comparePassword",
      params: {
        plainPassword: formValues.password,
        hashedPassword: vendiaStoredPassword,
      },
    };

    await axios
      .request(options)
      .then((response) => {
        temp = response.data;
      })
      .catch((error) => {
        console.error(error);
      });

    return temp;
  };

  return (
    <div className="login">
      <form onSubmit={handleSubmit}>
        <h1 className="login-logintext">Stinger Sign</h1>
        <div className="ui divider"></div>
        <div className="">
          <div className="field">
            <label className="email">Email </label>
            <input
              type="text"
              name="email"
              placeholder="Email"
              value={formValues.email}
              onChange={handleChange}
            />
            <p> </p>
          </div>
          <div className="field">
            <label className="password">Password </label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formValues.password}
              onChange={handleChange}
            />
            <p className="err"> {formError} </p>
          </div>
          {!loading ? (
            <button className="log-in-button">Log In</button>
          ) : (
            <button disabled className="log-in-button">
              Loading...
            </button>
          )}
        </div>
        <span className="link-login1"> Don't have an Account? </span>
        <Link className="link-login" to="/signup">
          <span onClick={refetch}> Sign Up </span>
        </Link>
        <br />
        <img className="login--logo" src={Hornet} alt="StingerSign Logo" />
      </form>
    </div>
  );
}

export default Login;
