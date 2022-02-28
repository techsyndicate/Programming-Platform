import React, { useEffect, useState } from 'react'
import { Oval } from 'react-loader-spinner'

import './Profile.css'
import { logout, urlPrefix } from '../../Components/reuse/Misc';
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
                                <h3>Username: {data.username}</h3>
                                <h3>Email: {data.email}</h3>
                                {/* FIXME: ADD SEND VERIFICATION STUFF IN SERVER */}
                                <h3 className='flex'>Email Verified: {data.email_verified ? <>Verified</> : <>Not Verified</>}</h3>
                                <div className='profile-logout' style={{ visibility: data.email_verified ? 'hidden' : 'visible' }}>
                                    <Button onClick={() => { window.location.href = urlPrefix() + 'discord-back/auth' }} buttonStyle='btn--primary--black'>Send Verification Email</Button>
                                </div>
                            </div>
                            <div style={{ marginLeft: '10px' }}>
                                <h3>Discord Username: {data.discordUser.username}</h3>
                                <h3>Discord Email: {data.discordUser.email}</h3>
                                <h3>Discord Email Verified: {data.discordUser.verified ? <>Verified</> : <>Not Verified</>}</h3>
                                <div className='profile-logout' style={{ visibility: data.discord ? 'hidden' : 'visible' }}>
                                    <Button onClick={() => { window.location.href = urlPrefix() + 'discord-back/auth' }} buttonStyle='btn--primary--black'>LinkDiscord</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='profile-bio'>
                        <div className='profile-bio-text'>
                            {/*FIXME: ADD THE PARTS TO ALLOW FOR USER TO SAVE SCHOOL*/}
                            <h2 className='ts-green flex'>School: &nbsp;<div className='white'>{true ? (
                                "Amity International School"
                            ) : (
                                <div className='flex-center'>
                                    <textarea style={{ width: '70vw' }}></textarea>
                                    {/*FIXME: ADD ONCLICK*/}
                                    <Button buttonStyle='btn--primary--black'>Save</Button>
                                </div>
                            )}
                            </div></h2>
                        </div>
                        <div className='profile-bio-text'>
                            <h2 className='ts-green'>Bio:</h2>
                            {/*FIXME: ADD THE PARTS TO ALLOW FOR USER TO SAVE BIO*/}
                            {true ? (
                                <p className='margin-left-10'>how long have you been smiling? it seems like its been too long some days i dont feel like trying so what the fuck are you on? oh-woah-oh-oh i think too much, we drink too much falling in love like its just nothing i want to know where do we.<br></br>
                                    long. have you been smiling? it seems like its been too long some days i dont feel like trying so what the fuck are you on? oh-woah-oh-oh i think too much, we drink too much falling in love like its just nothing i want to know where long have. have you.been.</p>
                            ) : (
                                <div className='flex-center'>
                                    <textarea style={{ width: '70vw' }}></textarea>
                                    {/*FIXME: ADD ONCLICK*/}
                                    <Button buttonStyle='btn--primary--black'>Save</Button>
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