import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom';
import { Oval } from 'react-loader-spinner';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Link } from 'react-router-dom';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import Editor from "@monaco-editor/react";

import './Question.css'

function Question() {
    const { questionid, questPart } = useParams();
    const [questionExist, setQuestionExist] = useState(false);
    const [data, setData] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const [code, setCode] = useState(`#write ur code here`);
    
    const editorRef = useRef(null);

    function handleEditorDidMount(editor, monaco) {
        editorRef.current = editor;
    }

    function showValue() {
        alert(editorRef.current.getValue());
    }

    const checkQuestion = async () => {
        await fetch('/question/', {
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
            }
            else {
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
                    <div id='question-container' className='question-container'>
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
                                    height="50vh"
                                    defaultLanguage="python"
                                    defaultValue={code}
                                    onMount={handleEditorDidMount}
                                    onChange={handleEditorChange}
                                    theme="vs-dark"
                                />
                        </div>
                        <button onClick={showValue}>Run Code</button>
                        <br></br>
                        <br></br>
                        <br></br>
                        <br></br>
                        <br></br>
                        <br></br>
                        <br></br>
                        <br></br>
                        <br></br>
                        <br></br>
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