import React from "react";
import { NavLink } from "react-router-dom";

function Navbar() {
  const navLinkStyle = ({ isActive }) => {
    return {
      fontWeight: isActive ? "bold" : "300",
    };
  };
  return (
    <nav className="w-full flex justify-evenly p-5 text-purple-800 text-2xl">
      <NavLink style={navLinkStyle} to="/home">
        Home
      </NavLink>

      <NavLink style={navLinkStyle} to="/profile">
        Profile
      </NavLink>
    </nav>
  );
}

export default Navbar;
