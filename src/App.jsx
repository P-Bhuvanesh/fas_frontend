import { useState } from "react";
import "./App.css";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import About from "./components/About";
import AddUser from "./components/AddUser";
import ActiveUsers from "./components/ActiveUsers";
import Footer from "./components/Footer";
import AdminLogin from "./pages/AdminLogin";
import AdminHome from "./pages/AdminHome";

import { Routes, Route, Navigate } from "react-router-dom";
import InstallPWA from "./components/InstallApp";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ProtectedRoute({ children }) {
  // Replace this with your actual logic to check if all statuses are complete
  const checkAllStatuses = () => {
    // Example: Get from localStorage, context, or state
    const statusComplete =
      localStorage.getItem("allStatusesComplete") === "true";
    return statusComplete;
  };

  const allStatusesComplete = checkAllStatuses();

  if (!allStatusesComplete) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function AdminProtectedRoute({ children }) {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  return isAdmin ? children : <Navigate to="/admin/login" replace />;
}

function App() {
  const [count, setCount] = useState(0);
  const location = useLocation();

  // useEffect(() => {
  //   const isOnAdminRoute = location.pathname.startsWith("/admin");
  //   if (!isOnAdminRoute) {
  //     localStorage.removeItem("isAdmin");
  //     localStorage.removeItem("adminToken");
  //   }
  // }, [location.pathname]);

  return (
    <>
      <Navbar />
      <ToastContainer position="top-center" autoClose={3000} />
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/login"
          element={
            localStorage.getItem("isAdmin") === "true" ? (
              <Navigate to="/admin" replace />
            ) : (
              <AdminLogin />
            )
          }
        />
        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminHome />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="admin/dashboard"
          element={
            <AdminProtectedRoute>
              <Dashboard />
            </AdminProtectedRoute>
          }
        />
        <Route path="/about" element={<About />} />
        <Route
          path="admin/adduser"
          element={
            <AdminProtectedRoute>
              <AddUser />
            </AdminProtectedRoute>
          }
        />
        <Route path="/activeuser" element={<ActiveUsers />} />
      </Routes>

      <Footer />
      <InstallPWA />
    </>
  );
}

export default App;
