import AuthApi from "../AuthApi";
import React, { useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { ALL_USERS } from "../Graphql/Query";
import { useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import "../styles/loginstyle.css";
import Hornet from "../images/logo.png";

function Login() {
  const initialValues = {
    email: "",
    password: "",
  };
  const Auth = useContext(AuthApi);
  const [formError, setFormError] = useState("");
  const [formValues, setFormValues] = useState(initialValues);
  const { error, loading, data, refetch } = useQuery(ALL_USERS);

  useEffect(() => {
    refetch()
    console.log("Refetched Data")
  })

  if (loading) return <div className="loading"> Loading... </div>;
  if (error) return <div> ERROR </div>;

  const handleOnClick = () => {
    Auth.setAuth(true);
    Cookies.set("user", "loginTrue");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    validateUser();
  };

  const validateUser = () => {
    let errors = "";
    data.list_UserInfoItems._UserInfoItems.map((item) => {
      if (
        item.userEmail === formValues.email &&
        item.userPassword === formValues.password
      ) {
        handleOnClick();
        Auth.setLoggedInUser(item._id);
        window.localStorage.setItem("state", item._id);
      } else {
        errors = "Email or password is incorrect";
        setFormError(errors);
      }
      
    });
    
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
          <button onClick={() => refetch()} className="log-in-button">
            Log In
          </button>
        </div>
        <span className="link-login1"> Don't have an Account? </span>
        <Link className="link-login" to="/signup">
          <span> Sign Up </span>
        </Link>
        <br/>
        <img className="login--logo" src={Hornet} alt="StingerSign Logo" />
      </form>
    </div>
  );
}

export default Login;
