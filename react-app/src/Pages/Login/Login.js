import React, { useState } from 'react';
import Axios from 'axios';
import { Notyf } from 'notyf';
import { Link } from 'react-router-dom';
import { getUser, urlPrefix } from '../../Components/reuse/Misc';

import './Login.css';

function Login() {
    // Create an instance of Notyf
    var notyf = new Notyf();

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
            url: urlPrefix() + "auth/login",
        }).then((res) => {
            if (res.data[0].sucess === true) {
                notyf.success('Login Successful');
                getUser().then((res) => {
                    window.location.href = '/profile';
                });
            }
            else {
                notyf.error(res.data[0].msg);
            }
        });
    };

    return (
        <div className='login-container'>
            <div className='login-form-div'>
                <form className='login-form' onSubmit={(e) => { e.preventDefault() }}>
                    <p className='login-input-text'>Email</p>
                    <input
                        className='login-input'
                        type={'email'}
                        onChange={(e) => setLoginEmail(e.target.value)} />

                    <p className='login-input-text'>Password</p>
                    <input
                        className='login-input'
                        type={'password'}
                        onChange={(e) => setLoginPassword(e.target.value)} />
                    <button className='login-submit' onClick={login}>Login</button>
                    <button className='login-submit' onClick={() => { window.location.href = '/auth/discord-login' }}>Login With Discord <i class="fab fa-discord"></i></button>
                </form>
            </div>
            <p>Don't Have An Account? <Link to='/Register' className='register-redirect'>Register</Link></p>
        </div>
    )
}

export default Login