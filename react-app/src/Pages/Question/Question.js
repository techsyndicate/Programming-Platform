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

    const [practise, setPractise] = useState('Practice');

    function showValue() {
        alert(code);
    }

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
            console.log(res)
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

    }, []);

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

    function verifyLogged() {
        if (checkLoggedIn() !== null) {
            return true;
        }
        else {
            window.location.href = '/login';
        }
    }

    async function runCode() {
        if (verifyLogged() === true) {
            var input = document.getElementById('custom-inputs').value;
            console.log(input.toString(), code.toString());
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
                console.log(await data.data);
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
                                <li className='question-nav-item'>
                                    <Link
                                        to={`/question/${questionid}/Submissions`} className='question-nav-links'>
                                        Submissions
                                    </Link>
                                </li>
                                <li className='question-nav-item'>
                                    <Link
                                        to={`/question/${questionid}/Leaderboard`} className='question-nav-links'>
                                        LeaderBoard
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </nav>
                    {(() => {
                        switch (questPart.toLowerCase()) {
                            case "problem": return (
                                <>
                                    {showProblem()}
                                </>
                            )
                            case "leaderboard": return (
                                <>
                                    {hideProblem()}
                                    <p>LeaderBoard</p>
                                </>
                            )
                            case "submissions": return (
                                <>
                                    {hideProblem()}
                                    <p>Submissions</p>
                                </>
                            )
                            default: return <p>problem</p>;
                        }
                    })()}
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
                        <div className='question-buttons'>
                            <Button onClick={runCode} buttonStyle='btn--primary--black'>Run Code</Button>
                            <Button onClick={showValue} buttonStyle='btn--primary--black'>Submit Code</Button>
                        </div>
                        <div className='problem-outputs'>
                            <p>Output</p>
                            <textarea rows={7} id='output-text'></textarea>
                            <p>Error</p>
                            <textarea rows={7} id='output-errors'></textarea>
                        </div>
                        <br></br>
                        <br></br>
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