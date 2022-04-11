import React, { useEffect, useState } from "react";
import Hornet from "../images/logo.png";
import { Link } from "react-router-dom";
import "../styles/stylesheet.css";
import AWS from "aws-sdk";
import { USER_INFO_BASIC } from "../Graphql/Query";
import { useQuery } from "@apollo/client";

const S3_BUCKET = process.env.REACT_APP_S3_BUCKET_NAME;

AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
});

const Navbar = () => {
  const [link, setLink] = useState();
  const loggedIn = window.localStorage.getItem("state");
  const { error, loading, data } = useQuery(USER_INFO_BASIC, {
    variables: {
      id: loggedIn,
    },
  });
  const navStyle = {
    color: "white",
    textDecoration: "none",
  };

  useEffect(() => {
    if (data) {
      console.log(data.get_UserInfo.userProfilePicture);
      const s3 = new AWS.S3();
      const params = {
        Bucket: S3_BUCKET,
        Key: data.get_UserInfo.userProfilePicture,
      };

      s3.getObject(params, (err, data) => {
        if (err) {
          console.log(err, err.stack);
        } else {
          const blob = new Blob([data.Body], { type: "application/image/*" });
          let tempLink = URL.createObjectURL(blob);
          setLink(tempLink);
        }
      });
    }
  }, [data]);

  if (loading) <div> </div>;

  return (
    <div className="navbar">
      <Link style={navStyle} to="/nav/dashboard">
        <img className="nav--logo" src={Hornet} alt="StingerSign Logo" />
      </Link>

      <Link style={navStyle} to="/nav/dashboard">
        <h3 className="nav--logo-text">Stinger Sign</h3>
      </Link>

      <Link
        style={navStyle}
        to={{
          pathname: "/nav/profile",
          state: { image: link },
        }}
      >
        <img className="nav--logo2" src={link} alt="" />
      </Link>
    </div>
  );
};

export default Navbar;
