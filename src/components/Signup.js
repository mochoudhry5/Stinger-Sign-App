import React, { useState, useEffect } from "react";
import AWS from "aws-sdk";
import { Link, Redirect } from "react-router-dom";
import { ALL_USERS } from "../Graphql/Query";
import { ADD_USER } from "../Graphql/Mutations";
import { useQuery, useMutation } from "@apollo/client";
import axios from "axios";
import { ADD_FILE_TO_VENDIA } from "../Graphql/Mutations";
import "../styles/signupform.css";

const S3_BUCKET = process.env.REACT_APP_S3_BUCKET_NAME;
const REGION = process.env.REACT_APP_S3_BUCKET_REGION_NAME;

AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
});

const myBucket = new AWS.S3({
  params: { Bucket: S3_BUCKET },
  region: REGION,
});

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
    req: "",
  };

  const [formValues, setFormValues] = useState(initialValues);
  const [blobData, setBlobData] = useState()
  const [progress, setProgress] = useState(0);
  const [selectedImage, setSelectedImage] = useState();
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [err, setErr] = useState(false);
  const { error, loading, data, refetch } = useQuery(ALL_USERS);
  const [addVendia_File_async] = useMutation(ADD_FILE_TO_VENDIA);
  const [add_UserInfo_async, { loading: l }] = useMutation(ADD_USER);

  useEffect(() => {
    const getDefaultProfilePicture = () => {
      const s3 = new AWS.S3();
      const params = {
        Bucket: S3_BUCKET,
        Key: "DefaultPicProfilePic.png",
      };
  
      s3.getObject(params, (err, data) => {
        if (err) {
          console.log(err, err.stack);
        } else {
          let defaultProfileBlob = new Blob([data.Body], { type:  "image/*" });
          setBlobData(defaultProfileBlob); 
        }
      });
    }

    getDefaultProfilePicture(); 

  }, [])


  if (l) return <div>Loading...</div>;
  if (error) return <div> ERROR </div>;


  const uploadFile = (file) => {
    const params = {
      ACL: "public-read",
      Body: file,
      Bucket: S3_BUCKET,
      Key: file.name,
    };

    myBucket
      .putObject(params)
      .on("httpUploadProgress", (evt) => {
        setProgress(Math.round((evt.loaded / evt.total) * 100));
      })
      .send((err) => {
        if (err) console.log(err);
        else sendToVendia(file);
      });
  };

  const sendToVendia = (file) => {
    addVendia_File_async({
      variables: {
        sourceBucket: S3_BUCKET,
        sourceKey: file.name,
        sourceRegion: REGION,
        destinationKey: file.name,
      },
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    setFormErrors(validateUser());
    setErr(false);
  };

  const validateUser = () => {
    refetch();
    const errors = {};
    data.list_UserInfoItems._UserInfoItems.map((item) => {
      if (item.userEmail === formValues.email) {
        errors.email = "Email is already in use";
        errors.gen = "Error";
      }
      if (
        !formValues.fname ||
        !formValues.lname ||
        !formValues.password ||
        !formValues.email ||
        !formValues.conPassword
      ) {
        errors.req = "Can not have required (*) fields blank";
        errors.gen = "Error";
      }

      if (formValues.password.length <= 5) {
        if (errors.req !== "Can not have required (*) fields blank") {
          errors.password = "Password must be at least 6 characters long";
          errors.gen = "Error";
        }
      }

      if (
        formValues.password !== formValues.conPassword &&
        errors.password !== "Password must be at least 6 characters long"
      ) {
        if (errors.req !== "Can not have required (*) fields blank") {
          errors.conPassword = "Passwords do not match";
          errors.gen = "Error";
        }
      }
    });
    return errors;
  };

  const handleSubmit = (e) => {
    refetch();
    setFormErrors(validateUser());
    if (
      formErrors.email === "Email is already in use" ||
      !formValues.fname ||
      !formValues.lname ||
      !formValues.email ||
      !formValues.password ||
      !formValues.conPassword ||
      (formValues.password !== formValues.conPassword &&
        formValues.password !==
          "Password must be at least 6 characters long") ||
      formValues.password.length <= 5
    ) {
      setErr(true);
      e.preventDefault();
    } else {
      addUser();
      setErr(false);
      setIsSubmit(true);
    }
  };

  const addUser = async () => {
    const hashedPW = await getHashedPassword();
    let myRenamedFile = null; 
    if(selectedImage){
     myRenamedFile = new File([selectedImage], `${formValues.fname}${formValues.lname}ProfilePic.png`)
     console.log("if")
    }
    else {
      myRenamedFile = new File([blobData], `${formValues.fname}${formValues.lname}ProfilePic.png`)
      console.log(myRenamedFile)
      console.log("else")
    }
    console.log(myRenamedFile)
    if(!formValues.company){
      formValues.company = "N/A"
    }
    if(!formValues.jobtitle){
      formValues.jobtitle = "N/A"
    }
    add_UserInfo_async({
      variables: {
        userEmail: formValues.email.toLowerCase(),
        userFirstName: formValues.fname,
        userLastName: formValues.lname,
        userPassword: hashedPW,
        userCompany: formValues.company,
        userJobTitle: formValues.jobtitle,
        userProfilePicture: myRenamedFile.name
      },
    });
    uploadFile(myRenamedFile)
  };

  const getHashedPassword = async () => {
    let tempPW = "";
    const options = {
      method: "GET",
      url: "http://localhost:8000/hashedPassword",
      params: { plainPassword: formValues.password },
    };

    await axios
      .request(options)
      .then((response) => {
        tempPW = response.data;
      })
      .catch((error) => {
        console.error(error);
      });
    return tempPW;
  };

  const imageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      let image = e.target.files[0];
      setSelectedImage(image);
    }
  };


  return (
    <div className="signup-form">
      <form onSubmit={handleSubmit}>
        {isSubmit ? <Redirect to="/" /> : null}
        <h2 className="signup-text">Stinger Sign Up</h2>
        <div className="all-inputs">
        <>
            <div style={styles.container}>
            <label className="label-profile">Choose A Profile Picture </label>
              {selectedImage ? (
                <div style={styles.preview}>
                  <img
                    style={{
                      borderRadius: "50%",
                      width: 150,
                      height: 150,
                      marginBottom: 30,
                      border: "4px solid",
                      display: "block",
                    }}
                    src={URL.createObjectURL(selectedImage)}
                    alt="Thumb"
                  />
                </div>
              ) : <div className="avatar-zone">
              </div> }
                
              <input
              className="upload_btn"
                accept="image/*"
                type="file"
                onChange={imageChange}
              />
              <img className="overlay-layer" src="https://cdn1.iconfinder.com/data/icons/hawcons/32/698394-icon-130-cloud-upload-512.png" alt="Cloud Upload" />
            </div>
            
          </>
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
          {!loading ? (
            <button className="log-in-button">Create</button>
          ) : (
            <button disabled className="log-in-button">
              Loading...
            </button>
          )}
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
    // background: "gray",
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
