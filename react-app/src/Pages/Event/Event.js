import Axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Oval } from 'react-loader-spinner';
import { Button } from '../../Components/button/Button';
import { checkLoggedIn, urlPrefix } from '../../Components/reuse/Misc'
import { Notyf } from 'notyf';

import './Event.css'
import moment from 'moment';

function Event() {
  // Create an instance of Notyf
  var notyf = new Notyf();

  const [data, setData] = useState(null);
  const [loaded, setLoaded] = useState(false);
  function getPractises() {
    Axios({ url: urlPrefix() + 'event-back', withCredentials: true }).then(res => {
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
                      <h2>Event: {item.event.name}</h2>
                      <p className='submission-card-status'>
                        Start Time: &nbsp; <div className='white'>{moment(new Date(item.event.startTime).toString()).format('DD-MM-YYYY HH:mm')}</div>&nbsp; &nbsp;
                        End Time: &nbsp; <div className='white'>{new Date() - new Date(item.event.endTime) < 0 ?
                          <>{moment(new Date(item.event.endTime).toString()).format('DD-MM-YYYY HH:mm')} </> :
                          "Event Ended!"
                        }
                        </div>
                      </p>
                    </div>
                    <div className='submissions-card-button'>
                      <Button
                        onClick={() => {
                          let userData = JSON.parse(localStorage.getItem('User'));
                          if (!checkLoggedIn()) {
                            notyf.error('You must be logged in to Participate In an event');
                          } else if (!(userData.discordUser.verified && userData.emailVerified)) {
                            notyf.error('You must Complete Your Profile, i.e Verify Your Email On Discord and On Our platform, and Link Discord To Participate In Events');
                          } else {
                            window.location.href = '/Events/' + item.event.name
                          }
                        }}
                        buttonStyle='btn--primary--black'>
                        Participate In Event
                      </Button>
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

export default Event