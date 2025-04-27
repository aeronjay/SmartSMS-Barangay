import { createContext, useState, useEffect } from "react";
import service from "../services/service"; // Adjust the import path as necessary
import { jwtDecode } from "jwt-decode"; // Correct import syntax
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verify token validity
  const verifyToken = async (token) => {
    if (!token) return false;

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        return false;
      }
      // Use service.js for backend verification
      return await service.verifyAdminToken(token);
    } catch (error) {
      console.error("Token verification failed:", error);
      return false;
    }
  };

  // Load and verify user token on app initialization
  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      const storedToken = localStorage.getItem("token");
      
      if (storedToken && await verifyToken(storedToken)) {
        setUser(storedToken);
        axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
      } else {
        // Clear invalid token
        localStorage.removeItem("token");
        delete axios.defaults.headers.common["Authorization"];
      }
      
      setLoading(false);
    };
    
    loadUser();
  }, []);

  const login = async (username, password) => {
    try {
      const data = await service.loginAdmin(username, password); 
      const token = data.token;
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`; 
      setUser(token);
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;