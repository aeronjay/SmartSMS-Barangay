import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const PrivateRoute = () => {
  const { user, loading } = useContext(AuthContext);
  
  // Show loading state while verifying token
  if (loading) {
    return <div>Loading...</div>; // Or a proper loading component
  }
  
  // Redirect if not authenticated
  return user ? <Outlet /> : <Navigate to="/loginpage" />;
};

export default PrivateRoute;