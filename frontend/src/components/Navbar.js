import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <h2>SafeVoice</h2>

      <Link to="/">Home</Link> | 
      <Link to="/track">Track</Link>
    </nav>
  );
}

export default Navbar;