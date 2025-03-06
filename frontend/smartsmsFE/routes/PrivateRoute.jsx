import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const PrivateRoute = () => {
  const { user } = useContext(AuthContext);
  const storedUser = localStorage.getItem("user");
  
  // must check first if stored token is valid.

  return user || storedUser ? <Outlet /> : <Navigate to="/loginpage" />;
};

export default PrivateRoute;
