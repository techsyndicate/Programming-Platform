import React, { useState } from 'react';
import Axios from 'axios';
import './Login.css';
import { Link } from 'react-router-dom';

function Login() {
    const [loginPassword, setLoginPassword] = useState("");
    const [loginEmail, setLoginEmail] = useState("");

    const login = () => {
        Axios({
            method: "POST",
            data: {
                password: loginPassword,
                email: loginEmail
            },
            withCredentials: true,
            url: "http://localhost:3200/auth/login",
        }).then((res) => console.log(res));
    };

    return (
        <div className='login-container'>
            <div className='login-form-div'>
                <form className='login-form' onSubmit={(e) => { e.preventDefault() }}>
                    <p className='login-input-text'>Email</p>
                    <input
                        className='login-input'
                        onChange={(e) => setLoginEmail(e.target.value)} />
                    <p className='login-input-text'>Password</p>
                    <input
                        className='login-input'
                        onChange={(e) => setLoginPassword(e.target.value)} />
                    <button className='login-submit' onClick={login}>Login</button>
                </form>
            </div>
            <p>Don't Have An Account? <Link to='/Register' className='register-redirect'>Register</Link></p>
        </div>
    )
}

export default Login