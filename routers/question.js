// Import Modules
const express = require('express'),
    question_router = express.Router();

const { isValidObjectId } = require('mongoose');
const { QuesSchema, TestCaseSchema } = require('../schema/questionSchema'),
    { checkAdmin, checkAuthenticated } = require('../utilities/passportReuse');

question_router.post('/', (req, res) => {
    if (isValidObjectId(req.body.id)) {
        QuesSchema.findById(req.body.id).then(ques => {
            if (ques) {
                ques = JSON.parse(JSON.stringify(ques));
                delete ques.testcases;
                ques['success'] = true;
                return setTimeout(() => {
                    res.send(ques)
                }, 1000)
            }
            res.send({ "success": false })
        });
    }
    else {
        res.send({ "success": false })
    }
})

module.exports = question_router;