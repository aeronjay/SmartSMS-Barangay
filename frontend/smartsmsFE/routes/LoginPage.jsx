import { useState } from "react";


function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        
    }
    
    return(
        <form onSubmit={handleSubmit}>
            <label htmlFor="username">Username</label>
            <input type="text" name="username" value={username} onChange={(e) => setUsername(e.target.value)}/>
            <br />
            <label htmlFor="password">password</label>
            <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
            <br />
            <button type="submit">Submit</button>
        </form>
    )
}

export default LoginPage;