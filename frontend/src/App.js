import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Track from "./pages/Track";

// 🔥 Layout wrapper to control Navbar visibility
function Layout() {
  const location = useLocation();

  // Hide Navbar only on admin page
  const hideNavbar = location.pathname === "/admin";

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* User routes */}
        <Route path="/" element={<Home />} />
        <Route path="/track" element={<Track />} />

        {/* Admin route */}
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;