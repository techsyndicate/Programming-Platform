// Import Modules
const express = require('express'),
    event_router = express.Router();

// Import Files
const eventSchema = require('../schema/eventSchema'),
    { QuesSchema } = require('../schema/questionSchema'),
    { checkAuthenticated } = require('../utilities/passportReuse');

// Send All Events
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

// Send Event Whoose Id Is given
event_router.get('/:id', checkAuthenticated, async (req, res) => {
    // Find Event
    eventSchema.findOne({ name: req.params.id }).then(async event => {

        if (!event) {
            return res.send({ "success": false, msg: "Event not found" })
        }
        else if (!(req.user.discordUser.verified === true && req.user.emailVerified === true)) {
            return res.send({ "success": false, msg: "You are not Verified, Please Complete Your Profile" })
        }
        else if (new Date(Date()) < new Date(event.startTime) && !req.user.admin) {
            event.questions = undefined;
            event.leaderboard = undefined;
            return res.send({ "success": true, event, started: false })
        }

        // For each question id in event get the question from database
        var questions = event.questions.map(async item => {
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

            // Goes through all the accepted submissions in the given question and check if any belongs to the user. 
            data.accepted_code = Object.keys(data.accepted_submissions).some((k) => {
                return data.accepted_submissions[k].userid === req.user.id;
            });
            return data;
        })
    
        // Reorder leaderboard
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

        // Send questions and event to client
        res.send({
            success: true,
            event: event,
            started: true,
            questions: await Promise.all(questions)
        })
    })
})

module.exports = event_router;