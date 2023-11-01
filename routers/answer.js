// Import Modules
const express = require('express'),
    Axios = require('axios'),
    answer_router = express.Router();

// Import Files
const { isValidObjectId } = require('mongoose'),
    AnsSchema = require('../schema/answerSchema'),
    EventSchema = require('../schema/eventSchema'),
    { QuesSchema } = require('../schema/questionSchema'),
    { checkAuthenticated } = require('../utilities/passportReuse');
const eventSchema = require('../schema/eventSchema');
const RunSchema = require('../schema/runningSchema');

// Run Code Endpoint
answer_router.post('/run/:id', checkAuthenticated, async (req, res) => {
    var text = req.body.code;
    var input = req.body.input;
    if (!text) {
        return res.send({ "success": false, msg: "Pls fill the text code" })
    }
    if (req.user.banned) {
        return res.send({ "success": false, msg: "You are banned" })
    }
    if (!req.user.discordUser.verified || !req.user.emailVerified) {
        console.log()
        return res.send({ "success": false, msg: "Pls Complete Profile, i.e Link Discord, Verify Email And Make Sure Email Is Verified On Discord." })
    }
    await new RunSchema({
        input: input,
        userid: req.user.id,
        ansPython: text,
        language: req.params.id
    }).save().then(async (dock) => {
        await Axios({
            url: process.env.SERVER_BACKEND_VM + '/language/' + req.params.id,
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
        }).then(async (data) => {
            data.data.success = true;
            if (data.hasOwnProperty('data') && data.data.hasOwnProperty('data') && data.data.data.length == 0) {
                data.data.data = [("No Ouput On STDOUT")];
            }
            await RunSchema.findByIdAndDelete(dock._id).then(() => {
                console.log('Successfully Ran Code in ' + dock.language);
            })
            res.send(data.data)
        }).catch(err => {
            res.send({
                "success": false,
                "msg": "Server Error Try Again in a few minutes" + err,
            })
        })
    })
})

// Submit Code Endpoint
answer_router.post('/submit/:id', checkAuthenticated, async (req, res) => {
    var text = req.body.code;
    var quesid = req.body.quesid;
    var userid = req.user.id;
    var language = req.body.language;
    if (!text) {
        return res.send({ "success": false, msg: "Pls fill the text code" })
    }
    if (req.user.banned) {
        return res.send({ "success": false, msg: "You are banned" })
    }
    if (!req.user.discordUser.verified && req.user.emailVerified) {
        return res.send({ "success": false, msg: "Pls Complete Profile, i.e Link Discord, Verify Email And Make Sure Email Is Verified On Discord." })
    }

    // Check if Question is Valid
    QuesSchema.findById(quesid, async (err, ques) => {
        var ans_schema = new AnsSchema({
            quesid: quesid,
            userid: userid,
            quesName: ques.name,
            ansPython: text,
            language: language
        })
        await Promise.all(ques.testcases.map(testcase => {
            // Make API Call to Run Code and Return the output
            return new Promise(async (resolve, reject) => {
                await Axios({
                    url: process.env.SERVER_BACKEND_VM + '/language/' + req.params.id,
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
                    console.log(data.data.data)
                    if (data.data.data.join('\n') === testcase.output_compare) {
                        newTestcase.passed = true;
                    }
                    resolve(newTestcase);
                }).catch((err) => {
                    testcase.toObject();
                    testcase.serverError = true;
                    testcase.output = "Server Error Try Again in a few minutes " + err;
                    resolve(testcase);
                })
            })
        })).then(async data => {
            ans_schema.testcases = data;

            // Check if server failed on any request
            if (data.some(testcase => testcase.serverError)) {
                return res.send({ "success": false, msg: data.map(testcase => { if (testcase.output[0].includes('Server Error Try Again in a few minutes')) { return testcase.output } })[0][0] })
            }

            // Check if all testcases passed
            if (ans_schema.testcases.every(item => item.passed)) {
                ans_schema.accepted = true;
                ques.accepted_submissions.push({ submissionid: ans_schema._id.toString(), userid: userid.toString() });

                // If question is of event type
                if (ques.practise === false) {

                    // Get the event
                    EventSchema.findById(ques.prac_evenid).then(event => {
                        // Get Points of the current question
                        const GetPoints = () => {
                            for (const item of event.questions) {
                                if (item.questionid === ques.id) { return item.points }
                            }
                        }

                        // Check if user is already in leaderboard
                        const CheckIfUserExistsInLb = () => {
                            for (const item of event.leaderboard) {
                                if (item.userid === req.user.id) {
                                    let index = event.leaderboard.indexOf(item);
                                    return { item, index }
                                }
                            }
                        }
                        let checkIfUserExistsInLb = CheckIfUserExistsInLb();

                        // if the event has not ended
                        if (((new Date() - new Date(event.endTime)) / 60000) < 0 && ((new Date() - new Date(event.startTime)) / 60000) > 0) {
                            // if user is not already in lb add him
                            if (checkIfUserExistsInLb === undefined) {
                                event.leaderboard.push({
                                    name: req.user.username,
                                    time: new Date().toString(),
                                    userid: req.user.id,
                                    points: GetPoints().toString(),
                                    questionid: ques.id,
                                    solvedquestions: [{ questionid: ques.id, points: GetPoints() }]
                                })
                            }
                            // if user is already in lb update him and add his solved question
                            if (checkIfUserExistsInLb !== undefined && !event.leaderboard[checkIfUserExistsInLb.index].solvedquestions.map(item => item.questionid).includes(ques.id)) {
                                event.leaderboard[checkIfUserExistsInLb.index].solvedquestions.push({ questionid: ques.id, points: GetPoints() })
                                event.leaderboard[checkIfUserExistsInLb.index].points = (parseInt(event.leaderboard[checkIfUserExistsInLb.index].points) + parseInt(GetPoints())).toString()
                                event.leaderboard[checkIfUserExistsInLb.index].time = new Date().toString()
                            }
                            // sort the leaderboard
                            event.leaderboard = event.leaderboard.sort((a, b) => {
                                let a1 = parseInt(a.points);
                                let b2 = parseInt(b.points);
                                if (a1 > b2) {
                                    return -1;
                                }
                                else {
                                    return 1;
                                }
                            })
                            // save the event
                            event.save().then(() => {
                                console.log('LeaderBoard Updated')
                            })
                        }
                    })
                }
                ques.save()
            }

            // Save the answer
            ans_schema.save().then((ans_submit) => {
                res.send({ "success": true, data: ans_submit })
            })
        })
    })
})

// Show All Submissions For The Given QuestionID Endpoint
answer_router.get('/submissions/all/:questionid', checkAuthenticated, async (req, res) => {
    var quesid = req.params.questionid;
    if (!isValidObjectId(quesid)) {
        return res.send({ success: false, msg: "Invalid Question ID" })
    }
    AnsSchema.find({ quesid: quesid, userid: req.user.id }).then(answers => {
        if (answers.length > 0 && answers !== null) {
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

})

// Show Submission In Detail For The Gven SubmissionID
answer_router.get('/submissions/:submissionid', checkAuthenticated, async (req, res) => {
    var submissionid = req.params.submissionid;
    AnsSchema.findById(submissionid).then(answers => {
        if (!answers) {
            return res.send({
                success: false
            })
        }
        if (answers.userid !== req.user.id && !req.user.admin) {
            return res.send({ "success": false, msg: "You are not authorized to view this submission" })
        }
        answers = JSON.parse(JSON.stringify(answers));
        answers.success = true;
        QuesSchema.findById(answers.quesid).then(ques => {
            if (ques && !ques.practise === true) {
                eventSchema.findById(ques.prac_evenid).then(event => {
                    if (event) {
                        event.leaderboard = undefined;
                        if (new Date() - new Date(event.endTime) < 0) {
                            answers.testcases = answers.testcases.map((item, index) => { return { passed: item.passed } })
                        }
                        answers.event = event;
                        res.send(answers)
                    }
                })
            } else {
                res.send(answers)
            }
        }).catch(_ => {
            res.send(answers)
        });
    }).catch(_ => {
        res.send({
            success: false
        })
    });
})

module.exports = answer_router;