import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { checkLoggedIn, urlPrefix } from '../../Components/reuse/Misc';
import { useParams } from 'react-router-dom';

import './Submission.css'
import { Oval } from 'react-loader-spinner';

function Submission() {
    const [data, setData] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const { submissionid } = useParams();

    async function getPractises() {
        Axios({
            url: urlPrefix() + 'ans/submissions/' + submissionid,
            withCredentials: true
        }).then(res => {
            console.log(res.data)
            setData(res.data);
            setLoaded(true);
        })
    }
    useEffect(() => {
        getPractises()
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div>
            {loaded ? (
                <div className='Submission-top-level-container'>
                    <h1><a href={'/question/' + data.quesid}>{data.quesName}</a></h1>
                    <div className='middle-contain-submission'>
                        <div className='code-ans'>
                            <h4>Your Code</h4>
                            <pre><code>{data.ansPython}</code></pre>
                        </div>
                    </div>
                    <div className='accepted-container'>
                        <h3 className='accepted-container'>
                            Solution &nbsp;{data.accepted ? <div className='Accepted'>Accepted</div> : <div className='Not-Accepted'>Not Accepted</div>}
                        </h3>
                    </div>
                </div>

            ) : (
                <div className='loading'>
                    <Oval color="#000" secondaryColor="#000" ariaLabel='loading' height={100} width={100} />
                </div>
            )}

        </div>
    )
}

export default Submission