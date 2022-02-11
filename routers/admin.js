// Import Modules
const express = require('express'),
    admin_router = express.Router();

const { QuesSchema, TestCaseSchema } = require('../schema/questionSchema'),
    { checkAdmin, checkAuthenticated } = require('../utilities/passportReuse');

admin_router.get('/question', checkAuthenticated, checkAdmin,  (req, res) => {
    res.render('admin_ques.ejs')
})

admin_router.get('/question/testcase', checkAuthenticated, checkAdmin, (req, res) => {
    res.render('admin_testcase.ejs')
})

admin_router.post('/question/submit', checkAuthenticated, checkAdmin, (req, res) => {
    console.log(req.body)
    var testQues = new QuesSchema({
        name: req.body.name,
        ques: req.body.ques,
        testcases: new TestCaseSchema({
            input: req.body.input,
            output_compare: req.body.output_compare
        })
    });
    testQues.save().then((ques) => {
        res.send({ "success": true, ques })
    }).catch(err => {
        res.send(err)
    })
})

admin_router.post('/question/testcase', checkAuthenticated, checkAdmin, (req, res) => {
    QuesSchema.findById(req.body.id).then(ques => {
        ques.testcases.push(new TestCaseSchema({
            input: req.body.input,
            output_compare: req.body.output_compare
        }))
        ques.save().then((ques) => {
            res.send({"success": true, ques})
        }).catch(err => {
            res.send(err)
        })
    });
})

module.exports = admin_router;