import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
    const [loginUser, setLoginUser] = useState({
        email: "",
        password: ""
    })
    const navigate = useNavigate();
    function a(e) {
        setLoginUser({ ...loginUser, [e.target.name]: e.target.value })
    }
    async function submit() {
        try {
            const response = await axios.post(`http://localhost:8080/login`, loginUser)
            alert("User Login Success..");
            navigate("/home")
        } catch (err) {
            alert("Email or Password Incorrect....");
        }
    }

    return (
        <>
            <div className="Third-div">
                <h1>Login Here</h1>
                <h3>Email</h3>
                <input type="text" name="email" id="" onChange={a} />
                <h3>Password</h3>
                <input type="password" name="password" id="" onChange={a} />
                <button onClick={submit}>Login</button>
                <a href="/">New  User ?Create An Account</a>
            </div>

        </>


    )
}
export default Login;