import Axios from 'axios'
import React, { useEffect } from 'react'
import { Oval } from 'react-loader-spinner';
import { urlPrefix } from '../../Components/reuse/Misc'

function LoginCallback() {
    useEffect(() => {
        Axios({
            method: "POST",
            data: {
                code: window.location.href.split('?code=')[1]
            },
            withCredentials: true,
            url: urlPrefix() + "discord-back/login-callback",
        }).then((res) => {
            console.log(res.data)
            if (res.data.sucess === true) {
                window.location.href = '/profile';
            }
            else {
                window.location.href = '/login';
            }
        })
    }, []);
    return (
        <div className='loading'>
            <Oval color="var(--loading)" secondaryColor="var(--loading)" ariaLabel='loading' height={100} width={100} />
        </div >
    )
}

export default LoginCallback