import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { Oval } from 'react-loader-spinner';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Link } from 'react-router-dom';
import Editor from "@monaco-editor/react";
import { Button } from '../../Components/button/Button';
import { langParser, urlPrefix, langParserForSubmission, checkLoggedIn } from '../../Components/reuse/Misc';
import Axios from 'axios';

import './Question.css'
import { Notyf } from 'notyf';

function Question() {
    const notyf = new Notyf();
    const { questionid, questPart } = useParams();
    const [questionExist, setQuestionExist] = useState(false);
    const [data, setData] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const [code, setCode] = useState('');
    const [logged, setLogged] = useState(false);
    const [practise, setPractise] = useState('Practice');
    const [executing, setExecuting] = useState(true);
    const [submissionData, setSubmissionData] = useState(null);
    const [language, setLanguage] = useState('python');

    const checkQuestion = async () => {
        await fetch(urlPrefix() + 'question/', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: questionid
            })
        }).then(res => res.json()).then(res => {
            if (res.success) {
                console.log(res)

                if (!res.practise && !checkLoggedIn()) {
                    window.location.href = '/login'
                }

                setData(res);
                window.onload = setQuestionExist(true);
                if (res.hasOwnProperty('practise') && res.practise) {
                    setPractise('Practice');
                } else {
                    setPractise('Events');
                }
            } else {
                window.location.href = '/404';
            }
        })
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
            document.getElementById('output-errors').value = '';
            document.getElementById('output-text').value = '';
            Axios({
                url: urlPrefix() + 'ans/run/' + document.getElementById('editor').value,
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
                    if (data.data.err !== undefined && data.data.err.length > 0) {
                        document.getElementById('output-errors').value = '';
                        document.getElementById('output-errors').value = data.data.err.join('\n');
                    }
                    else {
                        document.getElementById('output-errors').value = '';
                    }
                    if (data.data.exit.code !== 0 && data.data.exit.code === null) {
                        notyf.error({ dismissible: true, duration: 0, message: `Exit code: ${data.data.exit.code}, CODE DIDN'T EXECUTE IN GIVEN TIMELIMIT OF 15 SECONDS` });
                    }
                    if (data.data.data !== undefined && data.data.data.length > 0) {
                        document.getElementById('output-text').value = data.data.data.join('\n');
                    }
                    else {
                        document.getElementById('output-text').value = '';
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
            const val = document.getElementById('editor').value;
            setExecuting(false);
            Axios({
                url: urlPrefix() + 'ans/submit/' + document.getElementById('editor').value,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true,
                data: {
                    code: code.toString(),
                    quesid: questionid,
                    language: val
                }
            }).then(async data => {
                setExecuting(true);
                window.location.href = '/submissions/' + data.data.data._id;
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
                setSubmissionData(await data.data);
            })
        }
    }

    function getLanguage() {
        const val = document.getElementById('editor').value;
        setLanguage(langParser(val));
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
            window.location.href = `/question/${questionid}/Problem`;
        }
    } else {
        window.location.href = `/question/${questionid}/Problem`;
    }

    return (
        <div className='question-all-root'>
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
                        <p className='navar-min-80'><Link className='question-quicknav-link' to={'/' + practise}>{practise} </Link>
                            {'>'} <Link className='question-quicknav-link' to={'/' + practise + '/' + data.prac_even_name}> {data.prac_even_name} </Link>
                            {'>'} <Link className='question-quicknav-link' to={'/question/' + questionid}>{data.name}</Link>
                        </p>
                        <h1 className='question-title'>{data.name}</h1>
                        <br></br>
                        <div className='question-problem-markdown' id='question-problem-markdown'>
                            <div className='question-markdown-comp'>
                                <ReactMarkdown children={data.ques} remarkPlugins={[remarkGfm]} />
                                <br></br>
                                <br></br>
                            </div>
                        </div>
                        <br></br>
                        <br></br>
                        <h2>Code Editor</h2>
                        <div className='select-container'>
                            <div className="select" onChange={getLanguage}>
                                <select name="editor" id="editor">
                                    <option value="python3">Python 3</option>
                                    <option value="python2">Python 2</option>
                                    <option value="gpp">C++</option>
                                    <option value="gcc">C</option>
                                    <option value="mcs">C#</option>
                                </select>
                            </div>
                        </div>
                        <br></br>
                        <div className='code-editor'>
                            <Editor
                                height="70vh"
                                language={language}
                                defaultValue={code}
                                onChange={(newValue) => { setCode(newValue); }}
                                theme="vs-dark"
                                style={{ borderRadius: '5px' }}
                            />
                        </div>
                        <div className='question-input'>
                            <h3>Custom Input</h3>
                            <textarea id='custom-inputs' rows={10}></textarea>
                        </div>
                        {executing ? (
                            <>
                                <div className='question-buttons'>
                                    <Button onClick={runCode} buttonStyle='btn--primary--black'>Run Code</Button>
                                    <Button onClick={submitCode} buttonStyle='btn--primary--black'>Submit Code</Button>
                                </div>
                            </>
                        ) : (
                            <>
                                <br></br>
                                <br></br>
                                <Oval color="var(--loading)" secondaryColor="var(--loading)" ariaLabel='loading' height={60} width={60} />
                            </>
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
                                <p className='navar-min-80'><Link className='question-quicknav-link' to={'/' + practise}>{practise} </Link>
                                    {'>'} <Link className='question-quicknav-link' to={'/' + practise + '/' + data.prac_even_name}> {data.prac_even_name} </Link>
                                    {'>'} <Link className='question-quicknav-link' to={'/question/' + questionid}>{data.name}</Link></p>
                                <br></br>
                                <h1 className='question-title'>Submissions</h1>
                                <br></br>
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
                                                <h4>Submission {index + 1} In {langParserForSubmission(submission.language)}</h4>
                                                <p className='submission-card-status'>Staus: &nbsp; {submission.accepted ? (<div className='Accepted'>Accepted</div>) : (<div className='Not-Accepted'>Not Accepted</div>)}</p>
                                            </div>
                                            <div className='submissions-card-button'>
                                                <Button onClick={() => { window.open('/submissions/' + submission._id, "_blank") }} buttonStyle='btn--primary--black'>View Submission</Button>
                                            </div>

                                        </div>
                                    )
                                })}
                                <br></br>
                            </div>
                        ) : (
                            <div className='loading'>
                                <Oval color="var(--loading)" secondaryColor="var(--loading)" ariaLabel='loading' height={100} width={100} />
                            </div>
                        )}
                    </div>

                </>
            ) : (
                <div className='loading'>
                    <Oval color="var(--loading)" secondaryColor="var(--loading)" ariaLabel='loading' height={100} width={100} />
                </div>
            )}

        </div>
    )
}

export default Question