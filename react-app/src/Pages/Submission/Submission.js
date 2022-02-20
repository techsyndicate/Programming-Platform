import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { checkLoggedIn, langParserForSubmission, urlPrefix } from '../../Components/reuse/Misc';
import { useParams } from 'react-router-dom';
import Fourzerofour from '../../Components/404/404';

import './Submission.css'
import { Oval } from 'react-loader-spinner';
import { Notyf } from 'notyf';

function Submission() {
    const [data, setData] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const [forofor, setForofor] = useState(false);
    const { submissionid } = useParams();
    var notyf = new Notyf();

    async function getPractises() {
        Axios({
            url: urlPrefix() + 'ans/submissions/' + submissionid,
            withCredentials: true
        }).then(res => {
            console.log(res.data)
            if (!res.data.success) {
                notyf.error(res.data.msg);
                setForofor(true);
                setLoaded(true);
            }
            if (res.data.hasOwnProperty('language')) {
                console.log(res.data.language)
                res.data.language = langParserForSubmission(res.data.language)
                setData(res.data);
            }
            else {
                setData(res.data);
            }
            setLoaded(true);
        })
    }
    useEffect(() => {
        getPractises()
        if (!checkLoggedIn()) {
            window.location.href = "/login"
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div>
            {loaded ? (
                <>
                    {forofor ? (
                        <>
                            <Fourzerofour />
                        </>
                    ) : (
                        <div className='Submission-top-level-container'>
                            <h1><a href={'/question/' + data.quesid}>{data.quesName}</a></h1>
                            <div className='middle-contain-submission'>
                                <div className='code-ans'>
                                    <h4>Your Code In {data.language}</h4>
                                    <pre><code>{data.ansPython}</code></pre>
                                </div>
                            </div>
                            <div className='accepted-container'>
                                <h3 className='accepted-container'>
                                    Solution &nbsp;{data.accepted ? <div className='Accepted'>Accepted</div> : <div className='Not-Accepted'>Not Accepted</div>}
                                </h3>
                            </div>
                        </div>
                    )}
                </>

            ) : (
                <div className='loading'>
                    <Oval color="#000" secondaryColor="#000" ariaLabel='loading' height={100} width={100} />
                </div>
            )}

        </div>
    )
}

export default Submission