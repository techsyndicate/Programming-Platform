import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { Oval } from 'react-loader-spinner';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Link } from 'react-router-dom';
import Editor from "@monaco-editor/react";
import { Button } from '../../Components/button/Button';
import { checkLoggedIn, urlPrefix } from '../../Components/reuse/Misc';
import Axios from 'axios';

import './Question.css'
import { Notyf } from 'notyf';

function Question() {
    const notyf = new Notyf();
    const { questionid, questPart } = useParams();
    const [questionExist, setQuestionExist] = useState(false);
    const [data, setData] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const [code, setCode] = useState(`#write ur code here`);

    const [logged, setLogged] = useState(false);
    const [practise, setPractise] = useState('Practice');

    const [executing, setExecuting] = useState(true);

    const [submissionData, setSubmissionData] = useState(null);

    const checkQuestion = async () => {
        await fetch(urlPrefix() + 'question/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: questionid
            })
        }).then(res => res.json()).then(res => {
            if (res.success) {
                setData(res);
                window.onload = setQuestionExist(true);
                if (res.hasOwnProperty('practise') && res.practise) {
                    setPractise('Practice');
                } else {
                    setPractise('Event');
                }
            } else {
                window.location.href = '/404';
            }
        })
    }

    function handleEditorChange(newValue, e) {
        setCode(newValue);
    }

    useEffect(() => {
        checkQuestion();
        setInterval(() => {
            if (document.getElementById('question-container') !== null) {
                setLoaded(true);
            }
        }, 500);
        verifyLogged(false)
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    function showProblem() {
        if (loaded === true) {
            document.getElementById('question-container').style.display = 'flex';
        }
    }
    function hideProblem() {
        if (loaded === true) {
            document.getElementById('question-container').style.display = 'none';
        }
    }

    function showSubmission() {
        if (loaded === true && document.getElementById('submissions-container') !== null) {
            document.getElementById('submissions-container').style.display = 'flex';
        }
    }

    function hideSubmission() {
        if (loaded === true && document.getElementById('submissions-container') !== null) {
            document.getElementById('submissions-container').style.display = 'none';
        }
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

    async function runCode() {
        if (verifyLogged(true) === true) {
            setExecuting(false);
            var input = document.getElementById('custom-inputs').value;
            Axios({
                url: urlPrefix() + 'ans/run/python',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true,
                data: {
                    code: code.toString(),
                    input: input.toString(),
                }
            }).then(async data => {
                setExecuting(true);
                if (data.data.success) {
                    document.getElementById('output-text').value = data.data.data.join('\n');
                    document.getElementById('output-errors').value = data.data.err.join('\n');
                    if (data.data.exit.code !== 0) {
                        notyf.error(`Exit code: ${data.data.exit.code}, Likely Time Ran Out, or Code Failed.`);
                    }
                }
                else {
                    notyf.error(data.data.msg);
                }
            })
        }
    }

    async function submitCode() {
        if (verifyLogged(true) === true) {
            setExecuting(false);
            Axios({
                url: urlPrefix() + 'ans/submit/python',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true,
                data: {
                    code: code.toString(),
                    quesid: questionid
                }
            }).then(async data => {
                console.log(await data.data);
                setExecuting(true);
                window.location.href = '/submission/' + data.data.data._id;
            })
        }
    }

    async function getSubmissions() {
        if (questPart.toLowerCase() === 'submissions' && submissionData === null) {
            Axios({
                url: urlPrefix() + 'ans/submissions/all/' + questionid,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            }).then(async data => {
                console.log(await data.data);
                setSubmissionData(await data.data);
            })
        }
    }

    if (questPart.toLowerCase() === "problem") {
        showProblem()
        hideSubmission()
    } else if (questPart.toLowerCase() === "submissions") {
        if (logged === true) {
            hideProblem()
            showSubmission()
            getSubmissions()
        }
        else if (verifyLogged(false) === true) {
            hideProblem()
            showSubmission()
            getSubmissions()
        } else {
            return window.location.href = `/question/${questionid}/Problem`;
        }
    }

    return (
        <div>
            {questionExist ? (
                <>
                    <nav className="question-navbar">
                        <div className="question-navbar-container">
                            <ul className='question-nav-menu'>
                                <li className='question-nav-item'>
                                    <Link
                                        to={`/question/${questionid}/Problem`} className='question-nav-links'>
                                        Problem
                                    </Link>
                                </li >
                                {logged ? (
                                    <li className='question-nav-item'>
                                        <Link
                                            to={`/question/${questionid}/Submissions`} className='question-nav-links'>
                                            Submissions
                                        </Link>
                                    </li>
                                ) : null}
                            </ul>
                        </div>
                    </nav>
                    <br></br>
                    <br></br>
                    <div id='question-container' className='question-container'>
                        <p className='question-input'><a href={'/' + practise}>{practise} </a> {'>'} <a href={'/' + practise + '/' + data.prac_even_name}> {data.prac_even_name} </a> {'>'} <a href={'/question/' + questionid}>{data.name}</a></p>
                        <h1 className='question-title'>{data.name}</h1>
                        <br></br>
                        <div className='question-problem-markdown' id='question-problem-markdown'>
                            <div className='question-markdown-comp'>
                                <ReactMarkdown children={data.ques} remarkPlugins={[remarkGfm]} />
                            </div>
                        </div>
                        <br></br>
                        <br></br>
                        <h2>Code Editor Python 3</h2>
                        <div className='code-editor'>
                            <Editor
                                height="70vh"
                                defaultLanguage="python"
                                defaultValue={code}
                                onChange={handleEditorChange}
                                theme="vs-dark"
                            />
                        </div>
                        <div className='question-input'>
                            <h3>Custom Input</h3>
                            <textarea id='custom-inputs' cols={50} rows={10}></textarea>
                        </div>
                        {executing ? (
                            <>
                                <div className='question-buttons'>
                                    <Button onClick={runCode} buttonStyle='btn--primary--black'>Run Code</Button>
                                    <Button onClick={submitCode} buttonStyle='btn--primary--black'>Submit Code</Button>
                                </div>
                            </>
                        ) : (
                            <Oval color="#000" secondaryColor="#000" ariaLabel='loading' height={30} width={30} />
                        )}
                        <div className='problem-outputs'>
                            <p>Output</p>
                            <textarea rows={7} id='output-text'></textarea>
                            <p>Error</p>
                            <textarea rows={7} id='output-errors'></textarea>
                        </div>
                        <br></br>
                        <br></br>
                    </div>

                    <div id='submissions-container' className='question-container'>
                        {submissionData ? (
                            <div>
                                <p className='question-input'><a href={'/' + practise}>{practise} </a> {'>'} <a href={'/' + practise + '/' + data.prac_even_name}> {data.prac_even_name} </a> {'>'} <a href={'/question/' + questionid}>{data.name}</a></p>
                                {(() => {
                                    if (submissionData.length === 0) {
                                        return (
                                            <h1>No Submissions Till Now</h1>
                                        )
                                    }
                                })()}
                                {submissionData.map((submission, index) => {
                                    return (
                                        <div className='submissions-card'>
                                            <div className='submissions-card-header'>
                                                <h4>Submission {index + 1}</h4>
                                                <Button onClick={() => { window.open('/submissions/' + submission._id, "_blank") }} buttonStyle='btn--primary--black'>View Submission</Button>
                                            </div>
                                            {submission.accepted ? (<p>Accepted</p>) : (<p>Not Accepted</p>)}
                                        </div>
                                    )
                                })}
                                <br></br>
                            </div>
                        ) : (
                            <div className='loading'>
                                <Oval color="#000" secondaryColor="#000" ariaLabel='loading' height={100} width={100} />
                            </div>
                        )}

                    </div>

                </>
            ) : (
                <div className='loading'>
                    <Oval color="#000" secondaryColor="#000" ariaLabel='loading' height={100} width={100} />
                </div>
            )}

        </div>
    )
}

export default Question