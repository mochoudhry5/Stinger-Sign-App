import React from "react";
import Hornet from "../images/logo.png";
import { Link } from "react-router-dom";
import "../styles/stylesheet.css"

const Navbar = () => {

const navStyle = {
  color: 'white',
  textDecoration: 'none'
}

  return (
    <div className="navbar">

      <img className="nav--logo" src={Hornet} alt="StingerSign Logo" />

      <Link style={navStyle} to="/nav/dashboard">
        <h3 className="nav--logo-text" onClick={() => window.location.reload(false)}>Stinger Sign</h3>
      </Link>

      <Link style={navStyle} to="/nav/profile">
        <button className="nav--button">My Profile</button>
      </Link>
      
    </div>
  );
};

export default Navbar;
