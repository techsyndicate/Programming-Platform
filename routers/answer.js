const express = require('express'),
    Axios = require('axios'),
    answer_router = express.Router();

const { isValidObjectId } = require('mongoose');
const AnsSchema = require('../schema/answerSchema');
const { QuesSchema, TestCaseSchema } = require('../schema/questionSchema'),
    { checkAdmin, checkAuthenticated } = require('../utilities/passportReuse');

answer_router.post('/run/python', checkAuthenticated, async (req, res) => {
    var text = req.body.code;
    var input = req.body.input;
    if (text != '#write ur code here' && text) {
        try {
            await Axios({
                url: 'http://40.122.201.43:3000/language/python',
                withCredentials: true,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    code: text,
                    input_exec: input.split("\n"),
                    authString: process.env.SERVER_AUTH_STRING
                }
            }).then(data => {
                data.data.success = true;
                res.send(data.data)
            })
        } catch (err) {
            res.send({
                "success": false,
                "msg": "Server Error Try Again in a few minutes",
                err
            })
        }
    }
    else {
        res.send({ "success": false, msg: "Pls fill the text code" })
    }
})

answer_router.post('/submit/python', checkAuthenticated, async (req, res) => {
    var text = req.body.code;
    var quesid = req.body.quesid;
    var userid = req.user.id;
    if (text != '#write ur code here' && text) {
        QuesSchema.findById(quesid, async (err, ques) => {
            var ans_schema = new AnsSchema({
                quesid: quesid,
                userid: userid,
                quesName: ques.name,
                ansPython: text
            })
            await Promise.all(ques.testcases.map(testcase => {
                return new Promise(async (resolve, reject) => {
                    try {
                        await Axios({
                            url: 'http://40.122.201.43:3000/language/python',
                            withCredentials: true,
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            data: {
                                code: text,
                                input_exec: testcase.input.split("\n"),
                                authString: process.env.SERVER_AUTH_STRING
                            }
                        }).then(data => {
                            var newTestcase = new TestCaseSchema({
                                input: testcase.input,
                                output: data.data.data,
                                output_compare: testcase.output_compare,
                            })
                            if (newTestcase.output = []) {
                                newTestcase.output = [""];
                            }
                            if (data.data.data.join('\n') === testcase.output_compare) {
                                newTestcase.passed = true;
                            }
                            resolve(newTestcase);
                        })
                    } catch (err) {
                        testcase.passed = false;
                        testcase.output = "Server Error Try Again in a few minutes";
                        resolve(testcase);
                    }
                })
            })).then(async data => {
                ans_schema.testcases = await data;
                if (ans_schema.testcases.every(item => item.passed)) {
                    ans_schema.accepted = true;
                }
                ans_schema.save().then((ans_submit) => {
                    res.send({ "success": true, data: ans_submit })
                })
            })
        })
    } else {
        res.send({ "success": false, msg: "Pls fill the text code" })
    }
})

answer_router.get('/submissions/all/:questionid', checkAuthenticated, async (req, res) => {
    console.log(req.params.questionid)
    var quesid = req.params.questionid;
    if (isValidObjectId(quesid)) {
        AnsSchema.find({ quesid: quesid, userid: req.user.id }).then(answers => {
            if (answers !== [] && answers !== null) {
                answers = JSON.parse(JSON.stringify(answers));
                answers = answers.map(item => {
                    return ({
                        quesName: item.quesName,
                        accepted: item.accepted,
                        _id: item._id
                    })
                })
            }
            res.send(answers)
        })
    } else {
        res.send({ success: false, msg: "Invalid Question ID" })
    }
})

answer_router.get('/submissions/:submissionid', checkAuthenticated, async (req, res) => {
    var submissionid = req.params.submissionid;
    console.log(submissionid)
    AnsSchema.findById(submissionid).then(answers => {
        if (answers.userid == req.user.id) {
            answers = JSON.parse(JSON.stringify(answers));
            answers.success = true;
            res.send(answers)
        }
        else {
            res.send({ "success": false, msg: "You are not authorized to view this submission" })
        }
    })
})

module.exports = answer_router;