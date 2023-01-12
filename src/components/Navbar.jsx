import React from "react";
import { NavLink } from "react-router-dom";

function Navbar() {
  const navLinkStyle = ({ isActive }) => {
    return {
      fontWeight: isActive ? "bold" : "normal",
      textDecoration: isActive ? "underline" : "none",
    };
  };
  return (
    <nav>
      <NavLink style={navLinkStyle} to="/chat">
        Chat
      </NavLink>

      <NavLink style={navLinkStyle} to="/profile">
        Profile
      </NavLink>
    </nav>
  );
}

export default Navbar;
