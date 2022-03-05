import React, { useEffect, useState } from 'react'
import { Oval } from 'react-loader-spinner'
import { urlPrefix } from '../../Components/reuse/Misc';
import Axios from 'axios';

import './Profile.css'
import { useParams } from 'react-router-dom';

function PublicProfile() {
    const [logged, setlogged] = useState(false);
    const [data, setData] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        Axios({
            url: `${urlPrefix()}auth/public-prof/${id}`,
            method: 'GET',
            withCredentials: true
        }).then(res => {
            console.log(res.data);
            if (!res.data.sucess){
                window.location.href = '/404';
            }
            setData(res.data);
            setlogged(true);
        })
    });

    return (
        <div className='profile-container-root'>
            {logged ? (
                <div className='profile-container'>
                    <h1 className='profile-title'>Profile</h1>
                    <div className='profile-bio'>
                        <div className='profile-bio-text'>
                            <h2 className='ts-green flex'>Username: &nbsp;<div className='white'>{data.username}</div></h2>
                        </div>

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
                            {data.bio && (
                                <h2 style={{ width: '50vw', wordWrap: 'break-word', wordBreak: 'break-word' }}>{data.bio}</h2>
                            )}
                        </div>
                    </div>
                </div>
            ) : (<div className='loading'>
                <Oval color="var(--loading)" secondaryColor="var(--loading)" ariaLabel='loading' height={100} width={100} />
            </div>)}
        </div >
    )
}

export default PublicProfile