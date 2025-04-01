import { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/loginPage.css";

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [isSignUpMode, setIsSignUpMode] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isSignUpMode) {
                console.log("Sign-Up:", { email, username, password });
                // Sign-up logic here
            } else {
                await login(username, password);
                navigate("/admindashboard");
            }
        } catch (err) {
            console.error("Operation failed", err);
        }
    };

    return (
        <div className="container">
            <h2>{isSignUpMode ? 'Sign Up' : 'Login'}</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                {isSignUpMode && (
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                )}
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">{isSignUpMode ? 'Sign Up' : 'Login'}</button>
                <a href="#">Lost password? Click here!</a>
            </form>
        </div>
    );
}

export default LoginPage;