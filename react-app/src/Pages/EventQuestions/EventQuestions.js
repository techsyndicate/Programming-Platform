import Axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Oval } from 'react-loader-spinner';
import { Link, useParams } from 'react-router-dom';
import { Button } from '../../Components/button/Button';
import { checkLoggedIn, urlPrefix } from '../../Components/reuse/Misc';
import './EventQuestions.css'
import moment from 'moment';

function EventQuestions() {
    const [data, setData] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const { eventid, eventpart } = useParams();
    const [logged, setLogged] = useState(false);

    useEffect(() => {
        if (!checkLoggedIn()) {
            window.location.href = '/login'
        } else {
            getPractises()
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    function showProblem() {
        let interval = setInterval(() => {
            if (loaded === true && document.getElementById('question-container') !== null) {
                document.getElementById('question-container').style.display = 'flex';
                clearInterval(interval);
            }
        }, 50)
    }

    function hideProblem() {
        let interval = setInterval(() => {
            if (loaded === true && document.getElementById('question-container') !== null) {
                document.getElementById('question-container').style.display = 'none';
                clearInterval(interval);
            }
        }, 50)
    }

    const openInNewTab = (url) => {
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
        if (newWindow) newWindow.opener = null
    }

    function showSubmission() {
        let interval = setInterval(() => {
            if (loaded === true && document.getElementById('event-submissions-container') !== null) {
                document.getElementById('event-submissions-container').style.display = 'flex';
                clearInterval(interval);
            }
        }, 50)
    }

    function hideSubmission() {
        let interval = setInterval(() => {
            if (loaded === true && document.getElementById('event-submissions-container') !== null) {
                document.getElementById('event-submissions-container').style.display = 'none';
                clearInterval(interval);
            }
        }, 50)
    }

    function verifyLogged(redirect) {
        if (checkLoggedIn() !== null) {
            setLogged(true);
            return true;
        }
        else if (redirect === true && checkLoggedIn() === null) {
            window.location.href = '/login';
        }
    }

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

    if (eventpart.toLowerCase() === "questions") {
        showProblem()
        hideSubmission()
    } else if (eventpart.toLowerCase() === "leaderboard") {
        if (logged === true) {
            hideProblem()
            showSubmission()
            //setShowLeader(true)
        } else if (verifyLogged(false) === true) {
            hideProblem()
            showSubmission()
            //setShowLeader(true)
        } else {
            window.location.href = `/Events/${eventid}/Questions`;
        }
    } else {
        window.location.href = `/Events/${eventid}/Questions`;
    }

    return (
        <div className='event-question-root'>
            {
                loaded ? (
                    <div>
                        {data.started ? (
                            <>
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
                                <div id='question-container' className='question-container'>
                                    <h1 className='event-title'>Event: {data.event.name}</h1>
                                    <h3 className='event-title'>Event Ends On {moment(new Date(data.event.endTime).toString()).format('DD-MM-YYYY HH:mm')}</h3>
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

                                <div id='event-submissions-container' className='event-submissions-container'>
                                    {!data.event.leaderboard.length > 0 && (
                                        <div style={{width:'80vw'}}>
                                            <h1 className='event-title'>No Subssions That Have Passed Yet</h1>
                                        </div>)}
                                    {data.event.leaderboard.map((item, index) => {
                                        return (
                                            <div className='submissions-card white'>
                                                <div className='submissions-card-header'>
                                                    <h2>User: {item.name}</h2>
                                                    <p className='submission-card-status'>
                                                        Points: &nbsp; <div className='white'>{item.points}</div>&nbsp; &nbsp;
                                                        TimeTaken: &nbsp; <div className='white'>{(new Date(item.time) - new Date(data.event.startTime)) / 60000} Minutes</div>
                                                    </p>
                                                </div>
                                                <div className='submissions-card-button'>
                                                    <Button
                                                        onClick={() => { openInNewTab('/Profile/' + item.name) }}
                                                        buttonStyle='btn--primary--black'>
                                                        View Profile
                                                    </Button>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </>
                        ) : (
                            <>
                                <h1>Event Has Not Started Yet</h1>
                                <h1>Event Starts On {moment(new Date(data.event.startTime)).format('DD-MM-YYYY HH:mm')}</h1>
                                <h1>Event Ends On {moment(new Date(data.event.endTime).toString()).format('DD-MM-YYYY HH:mm')}</h1>
                            </>
                        )}
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