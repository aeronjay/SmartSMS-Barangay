import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthContext from "../src/context/AuthContext";

const PrivateRoute = () => {
  const { user } = useContext(AuthContext);
  const storedUser = localStorage.getItem("user");

  return user || storedUser ? <Outlet /> : <Navigate to="/loginpage" />;
};

export default PrivateRoute;
