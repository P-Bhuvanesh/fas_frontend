import { useState } from "react";
import "./App.css";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import About from "./components/About";
import AddUser from "./components/AddUser";
import ActiveUsers from "./components/ActiveUsers";
import Footer from "./components/Footer";
import { Routes, Route, Navigate } from 'react-router-dom';
import InstallPWA from "./components/InstallApp";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function ProtectedRoute({ children }) {
  // Replace this with your actual logic to check if all statuses are complete
  const checkAllStatuses = () => {
    // Example: Get from localStorage, context, or state
    const statusComplete = localStorage.getItem('allStatusesComplete') === 'true';
    return statusComplete;
  };

  const allStatusesComplete = checkAllStatuses();
  
  if (!allStatusesComplete) {
    return <Navigate to="/" replace />;
  }
  
  return children;
}

function App() {
  const [count, setCount] = useState(0);

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
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/about" element={<About />} />
        <Route path="/adduser" element={<AddUser />} />
        <Route path="/activeuser" element={<ActiveUsers />} />
      </Routes>

      <Footer />
      <InstallPWA/>
    </>
  );
}

export default App;
