import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const canAccessHome = localStorage.getItem("canAccessHome");

  return canAccessHome === "true" ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
