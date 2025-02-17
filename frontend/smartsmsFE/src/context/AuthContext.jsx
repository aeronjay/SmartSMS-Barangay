import { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user from localStorage when the app starts
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if(storedToken){
      setUser(storedToken)
    }
  }, []);

  const login = async (username, password) => {
    try {
      const res = await axios.post("http://localhost:3001/api/login", {
        username,
        password,
      });

      const token = res.data.token; 
      localStorage.setItem("user", token); 
      setUser(token);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("user"); 
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
