import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Correct import syntax

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verify token validity
  const verifyToken = async (token) => {
    if (!token) return false;
    
    try {
      // Option 1: Check token expiration locally
      const decoded = jwtDecode(token); // Use the named import
      const currentTime = Date.now() / 1000;
      
      if (decoded.exp < currentTime) {
        return false; // Token has expired
      }
      
      // Option 2: Verify with backend (more secure)
      // Set up axios with the token
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      
      // Make a request to a protected endpoint that verifies the token
      await axios.get("/api/admin/verify-token");
      
      return true; // Token is valid
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
      const res = await axios.post("/api/admin/login", {
        username,
        password,
      });

      const token = res.data.token;
      localStorage.setItem("token", token);
      
      // Set authorization header for future requests
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