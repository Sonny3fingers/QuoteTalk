import React from "react";
import { NavLink } from "react-router-dom";

function LoginNav() {
  const navLinkStyle = ({ isActive }) => {
    return {
      fontWeight: isActive ? "bold" : "normal",
      textDecoration: isActive ? "underline" : "none",
    };
  };
  return (
    <nav>
      <NavLink style={navLinkStyle} to="/">
        Login
      </NavLink>
      <NavLink style={navLinkStyle} to="/register">
        Register
      </NavLink>
    </nav>
  );
}

export default LoginNav;
