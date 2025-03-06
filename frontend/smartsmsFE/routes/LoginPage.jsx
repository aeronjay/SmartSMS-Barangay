import { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom"

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);

    const navigate = useNavigate()
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            await login(username, password);
            navigate("/admindashboard");
        }catch(err){
            console.error("Login failed", err);
        }
        
    }
    
    return(
        <form onSubmit={handleSubmit}>
            <label htmlFor="username">Username</label>
            <input type="text" name="username" id="username" value={username} onChange={(e) => setUsername(e.target.value)}/>
            <br />
            <label htmlFor="password">password</label>
            <input type="password" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
            <br />
            <button type="submit">Submit</button>
        </form>
    )
}

export default LoginPage;