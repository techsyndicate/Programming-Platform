import Axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Oval } from 'react-loader-spinner';
import { Button } from '../../Components/button/Button';
import { urlPrefix } from '../../Components/reuse/Misc'

import './Practise.css'

function Practise() {

    const [data, setData] = useState(null);
    const [loaded, setLoaded] = useState(false);
    function getPractises() {
        Axios({ url: urlPrefix() + 'practise-back', withCredentials: true }).then(res => {
            setData(res.data);
            setLoaded(true);
        })
    }
    useEffect(() => {
        getPractises()
    }, [])

    return (
        <div className='event-question-root'>
            {
                loaded ? (
                    <div className='submissions-container'>
                        <br></br><br></br>{
                            data.map((item, index) => {
                                return (
                                    <div className='submissions-card white'>
                                        <div className='submissions-card-header'>
                                            <h2>Practice: {item.name}</h2>
                                        </div>
                                        <div className='submissions-card-button'>
                                            <Button path={'/Practice/' + item.name} buttonStyle='btn--primary--black'>Continue Preperation</Button>
                                        </div>
                                    </div>
                                )
                            })
                        }</div>
                ) : (
                    <div className='loading'>
                        <Oval color="var(--loading)" secondaryColor="var(--loading)" ariaLabel='loading' height={100} width={100} />
                    </div >
                )
            }
        </div>
    )
}


export default Practise