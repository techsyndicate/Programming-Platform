import Axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Oval } from 'react-loader-spinner';
import { useParams } from 'react-router-dom';
import { Button } from '../../Components/button/Button';
import { urlPrefix } from '../../Components/reuse/Misc';
import './PractiseQuestions.css'
function PractiseQuestions() {
    const [data, setData] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const { practiceid } = useParams();

    function getPractises() {
        Axios({ url: urlPrefix() + 'practise-back/' + practiceid, withCredentials: true }).then(res => {
            if (res.data.success !== true) {
                window.location.href = '/Practice'
            } else {
                setData(res.data);
                setLoaded(true);
            }
        })
    }
    useEffect(() => {
        getPractises()
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className='practise-questions-root'>
            {
                loaded ? (
                    <div className='pract-content'>
                        <div className='submission-container'>
                            <h1 className='title-ohk'>Practice {practiceid}!</h1>
                            <br></br>
                            {data.data.map((item, index) => {
                                return (
                                    <div className='submissions-card white'>
                                        <div className='submissions-card-header'>
                                            <h2>{item.name}</h2>
                                            <p className='submission-card-status'>Staus: &nbsp; {item.accepted_code ? (<div className='Accepted'>Solved</div>) : (<div className='Not-Accepted'>Pending Solution</div>)}</p>
                                        </div>
                                        <div className='submissions-card-button'>
                                            <Button path={'/question/' + item.id +'/Problem'} buttonStyle='btn--primary--black'>{item.accepted_code ? 'Solved!' : 'Solve!'}</Button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                ) : (
                    <div className='loading'>
                        <Oval color="var(--loading)" secondaryColor="var(--loading)" ariaLabel='loading' height={100} width={100} />
                    </div >
                )
            }
        </div>
    )

}

export default PractiseQuestions