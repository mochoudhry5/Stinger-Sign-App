import AuthApi from "../AuthApi";
import React, { useContext, useState } from "react";
import Cookies from "js-cookie";
import { ALL_USERS } from "../Graphql/Query";
import { useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import "../signupform.css";

function Login() {
  const initialValues = {
    email: "",
    password: "",
  };
  const Auth = useContext(AuthApi);
  const [formError, setFormError] = useState("");
  const [formValues, setFormValues] = useState(initialValues);
  const { error, loading, data } = useQuery(ALL_USERS);
  const [isValidUser, setIsValidUser] = useState(false);

  if (loading) return <div> Loading... </div>;
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
        setIsValidUser(true);
        Auth.setLoggedInUser(item._id)
        console.log(item._id);
        window.localStorage.setItem('state', item._id);
      }
      else {
        errors = "Email or password is incorrect"
        setFormError(errors)
      }
    });
  };


  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <h1 className="login-welcometext"> Welcome to StingerSign </h1> <hr />
        <h2 className="login-logintext">Login</h2>
        <div className="ui divider"></div>
        <div className="">
          <div className="field">
            <label>Email </label>
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
            <label>Password </label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formValues.password}
              onChange={handleChange}
            />
            <p className="err"> {formError} </p>
          </div>
          <button className="log-in-button">Log In</button>
        </div>
        <span> Don't have an Account? </span>
        <Link to="/signup">
          <span> Click here </span>
        </Link>
      </form>
    </div>
  );
}

export default Login;
