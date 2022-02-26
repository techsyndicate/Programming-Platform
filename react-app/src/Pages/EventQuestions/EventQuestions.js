import Axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Oval } from 'react-loader-spinner';
import { Link, useParams } from 'react-router-dom';
import { Button } from '../../Components/button/Button';
import { checkLoggedIn, urlPrefix } from '../../Components/reuse/Misc';
import './EventQuestions.css'

function EventQuestions() {
    const [data, setData] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const { eventid } = useParams();

    function getPractises() {
        Axios({ url: urlPrefix() + 'event-back/' + eventid, withCredentials: true }).then(res => {
            console.log(res.data);
            if (res.data.success !== true) {
                alert(res.data.msg);
                window.location.href = '/Events'
            }
            setData(res.data);
            setLoaded(true);
        })
    }
    useEffect(() => {
        if (!checkLoggedIn()) {
            window.location.href = '/login'
        } else {
            getPractises()
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className='event-question-root'>
            {
                loaded ? (
                    <div>
                        <nav className="question-navbar">
                            <div className="question-navbar-container">
                                <ul className='question-nav-menu'>
                                    <li className='question-nav-item'>
                                        <Link
                                            to={`/Events/${eventid}/Questions`} className='question-nav-links'>
                                            Questions
                                        </Link>
                                    </li >
                                    <li className='question-nav-item'>
                                        <Link
                                            to={`/Events/${eventid}/LeaderBoard`} className='question-nav-links'>
                                            Leaderboard
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </nav>

                        <br></br>
                        <div className='question-container'>
                            <h1 className='event-title'>Event: {data.event.name}</h1>
                            <br></br>
                            {data.questions.map((item, index) => {
                                return (
                                    <div className='submissions-card white'>
                                        <div className='submissions-card-header'>
                                            <h2>{item.name}</h2>
                                            <p className='submission-card-status'>Points: &nbsp; <div className='white'>{data.event.questions[index].points}</div></p>
                                            <p className='submission-card-status'>Staus: &nbsp; {item.accepted_code ? (<div className='Accepted'>Solved</div>) : (<div className='Not-Accepted'>Pending Solution</div>)}</p>
                                        </div>
                                        <div className='submissions-card-button'>
                                            <Button
                                                onClick={() => { window.location.href = '/question/' + item.id }}
                                                buttonStyle='btn--primary--black'>
                                                {item.accepted_code ? 'Solved!' : 'Solve!'}
                                            </Button>
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

export default EventQuestions