import React, { useContext, useState, useEffect } from "react";
import { USER_INFO, ALL_USERS } from "../../Graphql/Query";
import { UPDATED_USER_INFO } from "../../Graphql/Mutations";
import { useQuery, useMutation } from "@apollo/client";
import { Link } from "react-router-dom";
import AuthApi from "../../AuthApi";
import Cookies from "js-cookie";
import DeleteAccount from "./DeleteAccount";
import { useLocation } from "react-router-dom";
import "../../styles/stylesheet.css";

export const Profile = () => {
  const initialValues = {
    email: "",
    company: "",
    jobtitle: "",
  };
  const Auth = useContext(AuthApi);
  const loggedIn = window.localStorage.getItem("state");
  const [buttonHit, setButtonHit] = useState(false);
  const location = useLocation();
  const image = location.state.image;
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState();
  const [updateUserInfo, { loading }] = useMutation(UPDATED_USER_INFO);
  const { data: data1 } = useQuery(ALL_USERS);
  const { error, data } = useQuery(USER_INFO, {
    variables: {
      id: loggedIn,
    },
  });

  useEffect(() => {
    if (data) {
      const tempObject = {
        email: data.get_UserInfo.userEmail,
        company: data.get_UserInfo.userCompany,
        jobtitle: data.get_UserInfo.userJobTitle,
      };
      setFormValues(tempObject);
    }
  }, [data]);

  if (error) return <div> ERROR </div>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    setButtonHit(false);
    setFormErrors("");
  };

  const handleOnClick = () => {
    Auth.setAuth(false);
    Cookies.remove("user", "loginTrue");
    window.localStorage.clear();
  };

  const validateEmail = () => {
    let errors = ""; 
    data1.list_UserInfoItems._UserInfoItems.map((item) => {
      if (item.userEmail === formValues.email && formValues.email !== data.get_UserInfo.userEmail) {
        setFormErrors("Email is already in use");
        errors = "Email is already in use"; 
      }
    });

    return errors; 
  };

  const handleSave = () => {
    let err = validateEmail();
    console.log(formErrors);
    if (err !== "Email is already in use") {
      updateUserInfo({
        variables: {
          id: loggedIn,
          userEmail: formValues.email,
          userCompany: formValues.company,
          userJobTitle: formValues.jobtitle,
        },
      });
      setButtonHit(true);
    }
  };

  return (
    <>
      {data ? (
        <>
          <h3 className="header-prof">
            {" "}
            {data.get_UserInfo.userFirstName}'s Profile{" "}
          </h3>
          <hr className="hrline" />
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
                    className="changeableinfo"
                    name="email"
                    type="text"
                    value={formValues.email}
                    onChange={handleChange}
                  />
                </p>
                {data.get_UserInfo.userCompany ? (
                  <p className="userinfo">
                    <strong className="company-prof">Company:</strong>
                    <input
                      className="changeableinfo"
                      name="company"
                      type="text"
                      value={formValues.company}
                      onChange={handleChange}
                    />
                  </p>
                ) : null}
                {data.get_UserInfo.userJobTitle ? (
                  <p className="userinfo">
                    <strong className="job-prof">Job Title:</strong>
                    <input
                      className="changeableinfo"
                      type="text"
                      name="jobtitle"
                      value={formValues.jobtitle}
                      onChange={handleChange}
                    />
                    <br />
                  </p>
                ) : null}
                {formErrors !== "Email is already in use" ? (
                  !buttonHit ? (
                    data.get_UserInfo.userJobTitle !== formValues.jobtitle ||
                    data.get_UserInfo.userCompany !== formValues.company ||
                    data.get_UserInfo.userEmail !== formValues.email ? (
                      <>
                        <button onClick={handleSave} className="savechange">
                          Save Changes
                        </button>
                        <p className="onsaveredirect">
                          You will be Redirected to the Dashboard on Save!
                        </p>
                      </>
                    ) : null
                  ) : !loading ? (
                    window.location.reload()
                  ) : (
                    <p className="saving">Saving Changes...</p>
                  )
                ) : (
                  <p className="err">{formErrors}</p>
                )}
              </div>
            </div>

            <div className="flex-child2 magenta">
              <div style={styles.container}>
                <img className="nav--logo3" src={image} alt="" />
              </div>
            </div>
          </div>
          <hr className="profilebottomhr" />
          <Link to="/">
            <button onClick={handleOnClick} className="logout">
              Log out
            </button>
            <br />
            <br />
          </Link>
          <DeleteAccount />
        </>
      ) : null}
    </>
  );
};

// Just some styles
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  preview: {
    display: "flex",
    flexDirection: "column",
  },
  delete: {
    cursor: "pointer",
    marginBottom: 10,
    padding: 10,
    width: 180,
    color: "white",
    border: "none",
  },
  upload: {
    cursor: "pointer",
    marginTop: 20,
    padding: 10,
    background: "green",
    color: "white",
    border: "none",
  },
};
