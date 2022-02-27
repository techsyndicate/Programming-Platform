import Axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Oval } from 'react-loader-spinner';
import { Button } from '../../Components/button/Button';
import { checkLoggedIn, urlPrefix } from '../../Components/reuse/Misc'
import { Notyf } from 'notyf';

import './Event.css'

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
    <div>
      {
        loaded ? (
          <div className='submission-container'>{
            data.map((item, index) => {
              return (
                <div className='submission-card'>
                  <h1>{item.event.name}</h1>
                  <Button
                    onClick={() => {
                      if (!checkLoggedIn()) {
                        notyf.error('You must be logged in to Participate In an event');
                      } else {
                        window.location.href = '/Events/' + item.event.name
                      }
                    }}
                    buttonStyle='btn--primary--black'>
                    Participate In Event
                  </Button>
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