import { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom"
import '../styles/loginpage.css'

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);

    const navigate = useNavigate()
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            await login(username, password);
            navigate("/admin");
        }catch(err){
            alert("LOGIN Failed")
            console.error("Login failed", err);
        }
        
    }
    
    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="login-title">Admin Login</h2>
                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="login-input"
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="login-input"
                        />
                    </div>
                    <button type="submit" className="login-button">Sign In</button>
                </form>
                <div>
                    <button onClick={() => navigate("/")}>Go back to Homepage</button>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;