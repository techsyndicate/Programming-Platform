import React from 'react'
import { Oval } from 'react-loader-spinner'

function Profile() {
    return (
        <div>
            <div className='loading'>
                <Oval color="#000" secondaryColor="#000" ariaLabel='loading' height={80} width={80} />
            </div>
        </div>
    )
}

export default Profile