import Axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Oval } from 'react-loader-spinner';
import { useParams } from 'react-router-dom';
import { Button } from '../../Components/button/Button';
import { urlPrefix } from '../../Components/reuse/Misc';

function PractiseQuestions() {
    const [data, setData] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const { practiceid } = useParams();

    function getPractises() {
        Axios({ url: urlPrefix() + 'practise-back/' + practiceid, withCredentials: true }).then(res => {
            console.log(res.data)
            setData(res.data);
            setLoaded(true);
        })
    }
    useEffect(() => {
        getPractises()
    }, [])

    return (
        <div>
            {
                loaded ? (
                    <div className='submission-container'>{
                        data.map((item, index) => {
                            return (
                                <div className='submission-card'>
                                    <h1>{item.name}</h1>
                                    <Button onClick={() => { window.location.href = '/question/' + item.id }} buttonStyle='btn--primary--black'>Solve!</Button>
                                </div>
                            )
                        })
                    }</div>
                ) : (
                    <div className='loading'>
                        <Oval color="#000" secondaryColor="#000" ariaLabel='loading' height={100} width={100} />
                    </div >
                )
            }
        </div>
    )

}

export default PractiseQuestions