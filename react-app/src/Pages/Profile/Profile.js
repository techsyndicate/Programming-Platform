import React, { useEffect, useState } from 'react'
import { Oval } from 'react-loader-spinner'

import './Profile.css'
import { logout } from '../../Components/reuse/Misc';
import { Button } from '../../Components/button/Button';

function Profile() {
    const [logged, setlogged] = useState(false);
    const [data, setData] = useState(null);
    const listenStorage = () => {
        if (localStorage.getItem('User')) {
            setlogged(true);
            setData(JSON.parse(localStorage.getItem('User')));
        }
        else {
            window.location.href = '/login';
        }
    }

    useEffect(() => {
        listenStorage();
    }, []);

    return (
        <div>
            {logged ? (
                <div className='profile-container'>
                    <h1>Profile</h1>
                    <h3>Username: {data.username}</h3>
                    <h3>Email: {data.email}</h3>
                    <div className='profile-logout'>
                        <Button onClick={logout} buttonStyle='btn--primary--black'>Logout</Button>
                    </div>
                </div>
            ) : (
                <div className='loading'>
                        <Oval color="var(--loading)" secondaryColor="var(--loading)" ariaLabel='loading' height={100} width={100} />
                </div>
            )}
        </div>
    )
}

export default Profile