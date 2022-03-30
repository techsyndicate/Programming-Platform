import React from 'react'
//import { useEffect } from 'react'

import './Index.css'

function Index() {

    return (

        <div className='index-root'>
            <div className='landing-root'>
                <div className='landing-container'>
                    <div className='landing-content'>
                        <div className='landing-head-img'>
                            <img alt='im-lnd' class='im-lnd' src='/logo.png'></img>
                            <h1 className='landing-head'>- Prog</h1>
                        </div>
                        <div className='landing-redirects'>
                            <a href='/FAQs'>FAQs</a>
                            <a style={{ marginLeft: '4vh' }} href='#guidelines'>Guidelines</a>
                        </div>
                    </div>
                    <div>
                        <img alt='group 27' className='group-27' style={{ width: '20vw' }} src='https://cdn.discordapp.com/attachments/859672291557638154/950773947752910930/Group_27.png'></img>
                    </div>
                </div>
            </div>
            <div className='guidelines-bg'>
                <div className='guidelines' id="guidelines">
                    <div className="rules-head">
                        GUIDELINES
                    </div>
                    <ul className="rules">
                        <li>To practice or participate in an event, you must create a profile on our platform and link the same with discord and verify your email on both discord and our platform.</li>
                        <li>You will not be able to run or submit your code until the verifications are completed.</li>
                        <li>To participate in an event, you must be on that event's discord server. Feel free to practice as much as you like!</li>
                        <li>The output of your code is case sensitive, "Hello" And "hello" will be interpreted differently.</li>
                        <li>We have a zero-tolerance policy for cheating, and anyone found doing so will be disqualified immediately.</li>
                        <li>If you're new to the concept of programming, check out the learning resource <a rel="noreferrer" href="https://techsyndicate.club/resources/programming" target="_blank" style={{ color: "#16e16e" }}>here</a>.</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Index