import React from 'react'
//import { useEffect } from 'react'

import './Index.css'

function Index() {

    // function getTimeRemaining(endtime) {
    //     const total = Date.parse(endtime) - Date.parse(new Date());
    //     const seconds = Math.floor((total / 1000) % 60);
    //     const minutes = Math.floor((total / 1000 / 60) % 60);
    //     const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    //     const days = Math.floor(total / (1000 * 60 * 60 * 24));

    //     return {
    //         total,
    //         days,
    //         hours,
    //         minutes,
    //         seconds
    //     };
    // }

    // function initializeClock(id, endtime) {
    //     const clock = document.getElementById(id);
    //     const daysSpan = clock.querySelector('.days');
    //     const hoursSpan = clock.querySelector('.hours');
    //     const minutesSpan = clock.querySelector('.minutes');
    //     const secondsSpan = clock.querySelector('.seconds');

    //     function updateClock() {
    //         const t = getTimeRemaining(endtime);

    //         daysSpan.innerHTML = ('0' + t.days).slice(-2);
    //         hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
    //         minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
    //         secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);

    //         if (t.total <= 0) {
    //             clearInterval(timeinterval);
    //         }
    //     }

    //     updateClock();
    //     const timeinterval = setInterval(updateClock, 1000);
    // }

    // const deadline = new Date(Date.parse("March 24, 2022 12:00:00 AM GMT+05:30"));

    // useEffect(() => {
    //     const loader = document.getElementById('loader');
    //     loader.style.opacity = '0';
    //     loader.style.visibility = 'hidden';
    //     setTimeout(() => {
    //         initializeClock('clockdiv', deadline);
    //     }, 1000);
    // }, []);

    return (
        <div className='index-root'>
            <div className="load" id="loader">
                <div className="one"></div>
                <div className="two"></div>
                <div className="three"></div>
            </div>
            <div id="jai-3d">
                <img src="https://encryptid.us/assets/tscircuitglow.png" alt="ts circuit"></img>
                <div className="main-heading">
                    TS Prog
                </div>
                <p>
                    An Inhouse Programming Platform
                </p>
                <div>
                {
                /* <div className='clockdiv' id="clockdiv">
                    <div className='clockText'>
                        <span className="days"></span>
                        <div className="smalltext">DAYS</div>
                    </div >
                    <div className='clockText'>
                        <span className="hours"></span>
                        <div className="smalltext">HR</div>
                    </div>
                    <div className='clockText'>
                        <span className="minutes"></span>
                        <div className="smalltext">MIN</div>
                    </div>
                    <div className='clockText'>
                        <span className="seconds"></span>
                        <div className="smalltext">SEC</div>
                    </div>
                </div> */
                }
                </div>
                <div>
                    <a href="/Faq" rel="noreferrer" target="_blank">
                        <button className="btn">
                            FAQs
                        </button>
                    </a>
                    <a href="#guidelines">
                        <button className="btn">
                            Guidelines
                        </button>
                    </a>
                    {/* <a href="https://t11e.us/encryptid/server" rel="noreferrer" target="_blank">
                        <button className="btn">
                            Discord
                        </button>
                    </a> */}
                </div>
            </div>
            <div id="guidelines">
                <div className="rules-head">
                    Guidelines
                </div>
                <ul className="rules">
                    <li>To Practise or participate in a event, you must create a profile on our platform and link the same with discord and verify your email on both discord and our platform.</li>
                    <li>Submit Code, Run Code Etc Won't Work Until The Above Condition is met.</li>
                    <li>To Participate in a event, you must be on that event's discord server. Feel Free To Practise as much as you like!</li>
                    <li>The Submissions, i.e output of your code is case sensitive, i.e "Hello" And "hello" Will be interpreted differently.</li>
                    <li>We have a zero-tolerance policy for cheating, and anyone found doing so will be disqualified immediately.</li>
                    <li>If you're new to the concept of Programming, check out the learning resource <a rel="noreferrer" href="https://techsyndicate.club/resources/programming" target="_blank" style={{ color: "#16e16e" }}>here</a>.</li>
                </ul>
            </div>
        </div>
    )
}

export default Index