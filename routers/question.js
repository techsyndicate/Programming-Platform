// Import Modules
const express = require('express'),
    question_router = express.Router();

const { isValidObjectId } = require('mongoose');
const { QuesSchema } = require('../schema/questionSchema');

question_router.post('/', (req, res) => {
    if (isValidObjectId(req.body.id)) {
        QuesSchema.findById(req.body.id).then(ques => {
            if (ques) {
                ques = JSON.parse(JSON.stringify(ques));
                delete ques.testcases;
                ques['success'] = true;
                if (ques.practise) {
                    res.send(ques)
                } else if (!ques.practise && req.user) {
                    res.send(ques)
                } else {
                    res.send({ "success": false, msg: "You are not allowed to view this question" })
                }
            }
            else {
                res.send({ "success": false })
            }
        });
    }
    else {
        res.send({ "success": false })
    }
})

module.exports = question_router;