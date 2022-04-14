import React, { useEffect, useState } from "react";
import Hornet from "../images/logo.png";
import { Link } from "react-router-dom";
import "../styles/stylesheet.css";
import AWS from "aws-sdk";
import { useQuery } from "@apollo/client";
import { USER_INFO_BASIC } from "../Graphql/Query";
import { S3Bucket } from "./../AWS/SecurityInfo";

const navStyle = {
  color: "white",
  textDecoration: "none",
};

const Navbar = () => {
  const loggedIn = window.localStorage.getItem("state");
  const [link, setLink] = useState();
  const { data } = useQuery(USER_INFO_BASIC, {
    variables: {
      id: loggedIn,
    },
  });

  useEffect(() => {
    const getUserProfilePicture = () => {
      if (data) {
        const params = {
          Bucket: S3Bucket,
          Key: data.get_UserInfo.userProfilePicture,
        };
        new AWS.S3().getObject(params, (err, data) => {
          if (err) {
            console.log(err, err.stack);
          } else {
            let blob = new Blob([data.Body], { type: "image/*" });
            let tempLink = URL.createObjectURL(blob);
            setLink((link) => tempLink);
          }
        });
      }
    };
    getUserProfilePicture();
  }, [data]);

  const reloadPage = () => {
    window.location.reload();
  };

  return (
    <div className="navbar">
      <img
        className="nav--logo"
        src={Hornet}
        onClick={reloadPage}
        alt="StingerSign Logo"
      />

      <h3 className="nav--logo-text" onClick={reloadPage}>
        Stinger Sign
      </h3>

      {data ? (
        <Link
          style={navStyle}
          to={{
            pathname: "/nav/profile",
            state: {
              image: link,
            },
          }}
        >
          <img className="nav--logo2" src={link} alt="" />
        </Link>
      ) : null}
    </div>
  );
};

export default Navbar;
