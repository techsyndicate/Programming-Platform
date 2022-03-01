import React, { useEffect, useState } from 'react'
import { Oval } from 'react-loader-spinner'

import './Profile.css'
import { logout, urlPrefix } from '../../Components/reuse/Misc';
import { Button } from '../../Components/button/Button';
import Axios from 'axios';

function Profile() {
    const [logged, setlogged] = useState(false);
    const [data, setData] = useState(null);

    function bio() {
        console.log(document.getElementById('profile-bio').value)
        Axios.defaults.withCredentials = true;

        Axios({
            method: 'POST',
            url: urlPrefix()+'auth/bio',
            withCreadentials: true,
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                bio: document.getElementById('profile-bio').value
            }
        }).then(res => {
            console.log(res)
            if (res.data.sucess === true) {
                setData({ ...data, bio: document.getElementById('profile-bio').value });
            }
        }).catch(err => {
            console.log(err);
        })
    }
    
    const listenStorage = () => {
        if (localStorage.getItem('User')) {
            setlogged(true);
            setData(JSON.parse(localStorage.getItem('User')));
        }
        else {
            window.location.href = '/login';
        }
    }
    window.addEventListener('storage', () => {
        listenStorage();
    })

    useEffect(() => {
        listenStorage();
    }, []);

    return (
        <div className='profile-container-root'>
            {logged ? (
                <div className='profile-container'>
                    <h1 className='profile-title'>Profile</h1>
                    <div className='profile-pfp-user-basic'>
                        <img alt='profile' className='profile-pfp' src={urlPrefix() + 'discord-back/avatar'}></img>
                        <div className='profile-info-div'>
                            <div>
                                <h3 className='ts-green flex'>Username: &nbsp;<div className='white'>{data.username}</div></h3>
                                <h3 className='ts-green flex'>Email: &nbsp;<div className='white'>{data.email}</div></h3>
                                <h3 className='ts-green flex'>Email Verified: &nbsp;<div className='white'>{data.emailVerified ? <>Verified</> : <>Not Verified</>}</div></h3>
                                <div className='profile-logout' style={{ visibility: data.emailVerified ? 'hidden' : 'visible' }}>
                                    <Button onClick={() => { window.location.href = urlPrefix() + 'email-back/send' }} buttonStyle='btn--primary--black'>Send Verification Email</Button>
                                </div>
                            </div>
                            <div style={{ marginLeft: '10px' }}>
                                <h3 className='ts-green flex'>Discord Username: &nbsp;<div className='white'>{data.discordUser.username}</div></h3>
                                <h3 className='ts-green flex'>Discord Email:  &nbsp;<div className='white'>{data.discordUser.email}</div></h3>
                                <h3 className='ts-green flex'>Discord Email Verified: &nbsp;<div className='white'>{data.discordUser.verified ? <>Verified</> : <>Not Verified</>}</div></h3>
                                <div className='profile-logout' style={{ visibility: data.discord ? 'hidden' : 'visible' }}>
                                    <Button onClick={() => { window.location.href = urlPrefix() + 'discord-back/auth' }} buttonStyle='btn--primary--black'>LinkDiscord</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='profile-bio'>
                        <div className='profile-bio-text'>
                            <h2 className='ts-green flex'>School: &nbsp;<div className='white'>{data.school}
                            </div></h2>
                        </div>
                        <div className='profile-bio-text'>
                            <h2 className='ts-green flex'>Name: &nbsp;<div className='white'>{data.name}
                            </div></h2>
                        </div>

                        <div className='profile-bio-text'>
                            <h2 className='ts-green'>Bio:</h2>
                            {data.bio ? (
                                <h2 style={{ width: '50vw', wordWrap: 'break-word', wordBreak: 'break-word' }}>{data.bio}</h2>
                            ) : (
                                <div className='flex-center'>
                                    <textarea id='profile-bio' style={{ width: '50vw' }}></textarea>
                                    <Button
                                        onClick={bio}
                                        buttonStyle='btn--primary--black'>Save</Button>
                                </div>
                            )
                            }
                        </div>
                    </div>

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