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
    fname: "",
    lname: "",
    company: "",
    jobtitle: "",
  };

  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const { error, loading, data } = useQuery(ALL_USERS);
  const [isSubmit, setIsSubmit] = useState(false)
  const [add_UserInfo_async] = useMutation(ADD_USER)

  if (loading) return <div> Loading... </div>;
  if (error) return <div> ERROR </div>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    setFormErrors(validateUser());
  };

  const validateUser = () => {
    const errors = {};
    data.list_UserInfoItems._UserInfoItems.map((item) => {
      if (item.userEmail === formValues.email) {
        errors.email = "Email is already in use";
        errors.password = "Password is already in use";
      }
    });
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormErrors(validateUser());
    if (formErrors.email === "Email is already in use") {
      console.log("Email is already in use");
    } else {
      addUser();
      setIsSubmit(true)
      console.log("Added User")
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
      {isSubmit ? (
        <Redirect to="/" />) : null}
        <h2 className="login-logintext">Stinger Sign Up</h2>
        <div className="ui divider"></div>
        <div className="all-inputs">
          <div className="field">
            <label className="label">First Name </label>
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
            <label className="label">Last Name </label>
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
            <label className="label">Company </label>
            <input
              className="input"
              type="text"
              name="company"
              placeholder="Company"
              value={formValues.company}
              onChange={handleChange}
            />
            <p> </p>
          </div>
          <div className="field">
            <label className="label">Job Title </label>
            <input
              className="input"
              type="text"
              name="jobtitle"
              placeholder="Job Title"
              value={formValues.jobtitle}
              onChange={handleChange}
            />
            <p> </p>
          </div>
          <div className="field">
            <label className="label">Email </label>
            <input
              className="input"
              type="email"
              name="email"
              placeholder="Email"
              value={formValues.email}
              onChange={handleChange}
            />
            <p className="err">{formErrors.email}</p>
          </div>
          <div className="field">
            <label className="label">Password </label>
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
            <label className="label">Confirm Password </label>
            <input
              className="input"
              type="password"
              name="password"
              placeholder="Confirm Password"
              //   value={formValues.password}
              //   onChange={handleChange}
            />
          </div>
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
