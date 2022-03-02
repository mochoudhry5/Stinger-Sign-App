import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { ALL_USERS } from "../Graphql/Query";
import { ADD_USER } from "../Graphql/Mutations";
import { useQuery, useMutation } from "@apollo/client";
import "../styles/signupform.css";

function Signup() {
  const initialValues = {
    email: "",
    password: "",
    conPassword: "",
    fname: "",
    lname: "",
    company: "",
    jobtitle: "",
    gen: "",
    req:"", 
  };

  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const { error, loading, data } = useQuery(ALL_USERS);
  const [isSubmit, setIsSubmit] = useState(false);
  const [err, setErr] = useState(false)
  const [add_UserInfo_async] = useMutation(ADD_USER);

  if (loading) return <div> Loading... </div>;
  if (error) return <div> ERROR </div>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    setFormErrors(validateUser());
    setErr(false)
  };

  const validateUser = () => {
    const errors = {};
    data.list_UserInfoItems._UserInfoItems.map((item) => {
      if (item.userEmail === formValues.email) {
        errors.email = "Email is already in use";
        errors.gen = "Error";
      }
      if (!formValues.fname || !formValues.lname || !formValues.password || !formValues.email || !formValues.conPassword ) {
        errors.req = "Can not have required (*) fields blank";
        errors.gen = "Error";
      }
      if(formValues.password !== formValues.conPassword){
        errors.conPassword = "Passwords do not match"
        errors.gen = "Error";
      }
      if(formValues.password.length < 5){
        errors.password = "Password must be at least 6 characters long"
        errors.gen = "Error";
      }
    });
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormErrors(validateUser());
    if (formErrors.email === "Email is already in use" 
    || !formValues.fname 
    || !formValues.lname 
    || !formValues.email 
    || !formValues.password
    || !formValues.conPassword
    || formValues.password !== formValues.conPassword
    || formValues.password.length < 5) {
      console.log("ERROR(S)");
      setErr(true)
    } else {
      addUser();
      setErr(false)
      setIsSubmit(true);
      console.log("Added User");
    }
  };

  const addUser = () => {
    add_UserInfo_async({
      variables: {
        userEmail: formValues.email,
        userFirstName: formValues.fname,
        userLastName: formValues.lname,
        userPassword: formValues.password,
        userCompany: formValues.company,
        userJobTitle: formValues.jobtitle,
      },
    });
  };

  return (
    <div className="signup-form">
      <form onSubmit={handleSubmit}>
        {isSubmit ? <Redirect to="/" /> : null}
        <h2 className="login-logintext">Stinger Sign Up</h2>
        <div className="ui divider"></div>
        <div className="all-inputs">
          <div className="field">
            <label className="label-fname">First Name* </label>
            <input
              className="input"
              type="text"
              name="fname"
              placeholder="First Name"
              value={formValues.fname}
              onChange={handleChange}
            />
            <p> </p>
          </div>
          <div className="field">
            <label className="label-lname">Last Name* </label>
            <input
              className="input"
              type="text"
              name="lname"
              placeholder="Last Name"
              value={formValues.lname}
              onChange={handleChange}
            />
          </div>
          <div className="field">
            <label className="label-company">Company </label>
            <input
              className="input"
              type="text"
              name="company"
              placeholder="Company"
              value={formValues.company}
              onChange={handleChange}
            />
          </div>
          <div className="field">
            <label className="label-jobtitle">Job Title </label>
            <input
              className="input"
              type="text"
              name="jobtitle"
              placeholder="Job Title"
              value={formValues.jobtitle}
              onChange={handleChange}
            />
          </div>
          <div className="field">
            <label className="label-email">Email* </label>
            <input
              className="input"
              type="email"
              name="email"
              placeholder="Email"
              value={formValues.email}
              onChange={handleChange}
            />
          </div>
          <div className="field">
            <label className="label-password">Password* </label>
            <input
              className="input"
              type="password"
              name="password"
              placeholder="Password"
              value={formValues.password}
              onChange={handleChange}
            />
          </div>
          <div className="field">
            <label className="label-passcon">Confirm Password* </label>
            <input
              className="input"
              type="password"
              name="conPassword"
              placeholder="Confirm Password"
              value={formValues.conPassword}
              onChange={handleChange}
            />
          </div>

          {err ? (
            formErrors.gen === "Error" ? (
              <div>
                <hr />
                <p className="err">{formErrors.email}</p>
                <p className="err">{formErrors.req}</p>
                <p className="err">{formErrors.password}</p>
                <p className="err">{formErrors.conPassword}</p>
                <hr />
              </div>
              
            ) : null
          ) : null}

          <button className="log-in-button">Create</button>
        </div>
        <span className="label"> Already have an account? </span>
        <Link className="link-login" to="/">
          <span className="span-label"> Log In</span>
        </Link>
      </form>
    </div>
  );
}

export default Signup;
