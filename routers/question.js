// Import Modules
const express = require('express'),
    question_router = express.Router(),
    { isValidObjectId } = require('mongoose');

// Import Files
const eventSchema = require('../schema/eventSchema'),
    { QuesSchema } = require('../schema/questionSchema');

// Return Question Details For The Given Question
question_router.post('/', (req, res) => {
    if (!isValidObjectId(req.body.id)) {
        return res.send({ "success": false })
    }
    QuesSchema.findById(req.body.id).then(ques => {
        if (!ques) {
            return res.send({ "success": false })
        }
        ques = JSON.parse(JSON.stringify(ques));
        delete ques.testcases;
        ques['success'] = true;
        if (ques.practise) {
            res.send(ques)
        } else if (!ques.practise && req.user && req.user.discordUser.verified === true && req.user.emailVerified === true) {
            eventSchema.findById(ques.prac_evenid).then(event => {
                if (!event) {
                    return res.send({ "success": false, msg: "You are not allowed to view this question" })
                }
                if (new Date(Date()) < new Date(event.startTime) && req.user.admin != true) {
                    return res.send({ "success": false, msg: "You are not allowed to view this qsuestion" })
                }
                res.send(ques)
            })
        } else {
            res.send({ "success": false, msg: "You are not allowed to view this question" })
        }
    });
})

module.exports = question_router;