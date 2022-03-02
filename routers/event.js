// Import Modules
const express = require('express'),
    event_router = express.Router();

const eventSchema = require('../schema/eventSchema'),
    { QuesSchema } = require('../schema/questionSchema'),
    { checkAuthenticated } = require('../utilities/passportReuse');


event_router.get('/', (req, res) => {
    eventSchema.find().then(events => {
        let to_return = events.map(event => {
            event.questions = undefined;
            event.leaderboard = undefined;
            return {
                event
            }
        })
        res.send(to_return)
    })
})

event_router.get('/:id', checkAuthenticated, async (req, res) => {
    eventSchema.findOne({ name: req.params.id }).then(async event => {
        if (!event) {
            return res.send({ "success": false, msg: "Event not found" })
        }
        else if (!(req.user.discordUser.verified === true && req.user.emailVerified === true)) {
            return res.send({ "success": false, msg: "You are not Verified, Please Complete Your Profile" })
        }
        else if (new Date(Date()) < new Date(event.startTime)) {
            event.questions = undefined;
            event.leaderboard = undefined;
            return res.send({ "success": true, event, started: false })
        }
        var eventof = event.questions.map(async item => {
            var data = await new Promise(async (resolve, reject) => {
                await QuesSchema.findById(item.questionid).then(question => {
                    question = question.toObject();
                    question.id = question['_id'].toString();
                    question['_id'] = undefined;
                    question.testcases = undefined;
                    question.ques = undefined;
                    resolve(question);
                });
            });

            data.accepted_code = Object.keys(data.accepted_submissions).some((k) => {
                return data.accepted_submissions[k].userid === req.user.id;
            });
            return data;
        })
        let to_return = {
            success: true,
            event: event,
            started: true,
            questions: await Promise.all(eventof)
        }
        res.send(to_return)
    })
})

module.exports = event_router;