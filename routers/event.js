// Import Modules
const express = require('express'),
    event_router = express.Router();

const eventSchema = require('../schema/eventSchema'),
    { QuesSchema } = require('../schema/questionSchema');


event_router.get('/', (req, res) => {
    eventSchema.find({}).then(events => {
        let to_return = events.map(event => {
            event.questions = undefined;
            event.leaderboard = undefined;
            //console.log(event)
            return {
                event
            }
        })
        //console.log(to_return)
        res.send(to_return)
    })
})

event_router.get('/:id', async (req, res) => {
    eventSchema.findOne({ name: req.params.id }).then(async event => {
        if (event) {
            var eventof = event.questions.map(item => {
                return new Promise(async (resolve, reject) => {
                    await QuesSchema.findById(item.questionid).then(question => {
                        question = question.toObject();
                        question.id = question['_id'].toString();
                        question['_id'] = undefined;
                        question.testcases = undefined;
                        question.ques = undefined;
                        resolve(question)
                    })
                }).then(data => {
                    return data
                })
            })
            let to_return = {
                event: event,
                questions: await Promise.all(eventof)
            }
            console.log(await to_return)
            res.send(await to_return)
        }
        else {
            res.send({ "success": false, msg: "Event not found" })
        }
    })
})

module.exports = event_router;