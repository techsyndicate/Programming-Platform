import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { useParams } from 'react-router-dom';
import FileSaver from 'file-saver';
import { Oval } from 'react-loader-spinner';
import { Notyf } from 'notyf';
import Editor from "@monaco-editor/react";

import './Submission.css'
import Fourzerofour from '../../Components/404/404';
import { checkLoggedIn, langParser, langParserForSubmission, urlPrefix } from '../../Components/reuse/Misc';

function Submission() {
    const [data, setData] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const [forofor, setForofor] = useState(false);
    const { submissionid } = useParams();
    var notyf = new Notyf();
    async function getPractises() {
        if (data) {
            return setLoaded(true)
        }
        Axios({
            url: urlPrefix() + 'ans/submissions/' + submissionid,
            withCredentials: true
        }).then(res => {
            if (!res.data.success) {
                notyf.error(res.data.msg);
                setForofor(true);
                setLoaded(true);
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
        <div className='submission-question-root'>
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
                                    <h4>Your Code In {langParserForSubmission(data.language)}</h4>
                                    <Editor
                                        height="70vh"
                                        defaultLanguage={langParser(data.language)}
                                        defaultValue={data.ansPython}
                                        theme="vs-dark"
                                        options={{ readOnly: true }}
                                    />
                                    <br></br>
                                    <br></br>
                                    <br></br>
                                </div>
                            </div>
                            <div className='accepted-container'>
                                <h3 className='accepted-container'>
                                    Solution &nbsp;{data.accepted ? <div className='Accepted'>Accepted</div> : <div className='Not-Accepted'>Not Accepted</div>}
                                </h3>
                            </div>
                            <div className='testcase-container'>
                                {data.testcases.map((testcase, index) => {
                                    return (<div className='testcase-card'>
                                        <h3>Testcase {index + 1}</h3>
                                        <pre><code>
                                            <h4 className='download-accepted-container'>Input: <div onClick={() => { FileSaver.saveAs(new Blob([testcase.input], { type: "text/plain;charset=utf-8" }), `Input${index + 1}.txt`) }} className='download'>Download</div></h4>
                                            <h4 className='download-accepted-container'>Expected Output: <div onClick={() => { FileSaver.saveAs(new Blob([testcase.output_compare], { type: "text/plain;charset=utf-8" }), `ExpectedOutput${index + 1}.txt`) }} className='download'>Download</div></h4>
                                            <h4 className='accepted-container'>Passed: &nbsp;{testcase.passed ? <div className='Accepted'>Passed</div> : <div className='Not-Accepted'>Not Passed</div>}</h4>
                                        </code></pre>
                                    </div>)
                                })}
                            </div>

                        </div>
                    )}
                </>

            ) : (
                <div className='loading'>
                        <Oval color="var(--loading)" secondaryColor="var(--loading)" ariaLabel='loading' height={100} width={100} />
                </div>
            )}

        </div>
    )
}

export default Submission