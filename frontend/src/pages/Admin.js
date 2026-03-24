import React from "react";
import { useLocation } from "react-router-dom";
import Dashboard from "../components/Dashboard";

function Admin() {
  const query = new URLSearchParams(useLocation().search);
  const key = query.get("key");

  if (key !== "admin123") {
    return <h2>Access Denied </h2>;
  }

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <Dashboard />
    </div>
  );
}

export default Admin;