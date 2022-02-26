const express = require('express'),
    Axios = require('axios'),
    answer_router = express.Router();

const { isValidObjectId } = require('mongoose');
const AnsSchema = require('../schema/answerSchema');
const EventSchema = require('../schema/eventSchema');
const { QuesSchema } = require('../schema/questionSchema'),
    { checkAuthenticated } = require('../utilities/passportReuse');

answer_router.post('/run/:id', checkAuthenticated, async (req, res) => {
    var text = req.body.code;
    var input = req.body.input;
    if (text) {
        try {
            await Axios({
                url: 'http://40.122.201.43:3000/language/' + req.params.id,
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
                if (data.data.data.length == 0) {
                    data.data.data = [("No Ouput On STDOUT")];
                }
                res.send(data.data)
            })
        } catch (err) {
            res.send({
                "success": false,
                "msg": "Server Error Try Again in a few minutes" + err,
            })
        }
    }
    else {
        res.send({ "success": false, msg: "Pls fill the text code" })
    }
})

answer_router.post('/submit/:id', checkAuthenticated, async (req, res) => {
    var text = req.body.code;
    var quesid = req.body.quesid;
    var userid = req.user.id;
    var language = req.body.language;
    if (text) {
        QuesSchema.findById(quesid, async (err, ques) => {
            var ans_schema = new AnsSchema({
                quesid: quesid,
                userid: userid,
                quesName: ques.name,
                ansPython: text,
                language: language
            })
            await Promise.all(ques.testcases.map(testcase => {
                return new Promise(async (resolve, reject) => {
                    try {
                        await Axios({
                            url: 'http://40.122.201.43:3000/language/' + req.params.id,
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
                            if (data.data.data.length == 0) {
                                data.data.data.push("No Ouput On STDOUT");
                            }
                            var newTestcase = {
                                input: testcase.input,
                                output: data.data.data,
                                output_compare: testcase.output_compare,
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
                ques.accepted_submissions.push({ submissionid: ans_schema._id.toString(), userid: userid.toString() });
                ques.save()
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
    var quesid = req.params.questionid;
    if (isValidObjectId(quesid)) {
        AnsSchema.find({ quesid: quesid, userid: req.user.id }).then(answers => {
            if (answers !== [] && answers !== null) {
                answers = JSON.parse(JSON.stringify(answers));
                answers = answers.map(item => {
                    return ({
                        quesName: item.quesName,
                        accepted: item.accepted,
                        language: item.language,
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