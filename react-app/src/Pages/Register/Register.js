import React, { useState } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import { Notyf } from 'notyf';

import './Register.css';
import { getUser, urlPrefix } from '../../Components/reuse/Misc';

function Register() {
    const [registerUsername, setRegisterUsername] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const [registerEmail, setRegisterEmail] = useState("");
    const [registerSchool, setRegisterSchool] = useState("");
    const [registerName, setRegisterName] = useState("");

    const register = () => {
        // Create an instance of Notyf
        var notyf = new Notyf();

        Axios({
            method: "POST",
            data: {
                password: registerPassword,
                email: registerEmail,
                username: registerUsername,
                name: registerName,
                school: registerSchool
            },
            withCredentials: true,
            url: urlPrefix() + "auth/register",
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
        <div className='register-container'>
            <div className='register-form-div'>
                <form className='register-form' onSubmit={(e) => { e.preventDefault() }}>

                    <p className='register-input-text'>Username</p>
                    <input
                        type={'text'}
                        className='register-input'
                        onChange={(e) => setRegisterUsername(e.target.value)} />

                    <p className='register-input-text'>Name</p>
                    <input
                        type={'text'}
                        className='register-input'
                        onChange={(e) => setRegisterName(e.target.value)} />

                    <p className='register-input-text'>School</p>
                    <input
                        type={'text'}
                        className='register-input'
                        onChange={(e) => setRegisterSchool(e.target.value)} />

                    <p className='register-input-text'>Email</p>
                    <input
                        type={'email'}
                        className='register-input'
                        onChange={(e) => setRegisterEmail(e.target.value)} />

                    <p className='register-input-text'>Password</p>
                    <input
                        className='register-input'
                        type={'password'}
                        onChange={(e) => setRegisterPassword(e.target.value)} />

                    <button className='register-submit' onClick={register}>Submit</button>
                </form>
            </div>
            <p className='register-redirect-p'>Already Have An Account? <Link to='/Login' className='register-redirect'>Login</Link></p>
        </div>
    )
}

export default Register