// Import Modules
const express = require('express'),
    admin_router = express.Router();

const PractiseSchema = require('../schema/practiseSchema'),
    { QuesSchema, TestCaseSchema } = require('../schema/questionSchema'),
    { checkAdmin, checkAuthenticated } = require('../utilities/passportReuse');

admin_router.get('/', checkAuthenticated, checkAdmin, (req, res) => {
    res.render('admin');
})

admin_router.get('/practise', checkAuthenticated, checkAdmin, (req, res) => {
    res.render('admin_practise.ejs')
})

admin_router.get('/event', checkAuthenticated, checkAdmin, (req, res) => {
    res.render('admin_event.ejs')
})

admin_router.get('/question', checkAuthenticated, checkAdmin, (req, res) => {
    res.render('admin_ques.ejs')
})

admin_router.get('/question/testcase', checkAuthenticated, checkAdmin, (req, res) => {
    res.render('admin_testcase.ejs')
})

admin_router.post('/question/submit', checkAuthenticated, checkAdmin, (req, res) => {
    console.log(req.body)
    if (req.body.practise === true) {
        PractiseSchema.findById(req.body.prac_evenid, (err, prac) => {
            if (prac) {
                var testQues = new QuesSchema({
                    practise: req.body.practise,
                    prac_evenid: req.body.prac_evenid,
                    prac_even_name: prac.name,
                    name: req.body.name,
                    ques: req.body.ques,
                    testcases: new TestCaseSchema({
                        input: req.body.input,
                        output_compare: req.body.output_compare
                    })
                });
                testQues.save().then((ques) => {
                    prac.questions.push(ques._id);
                    prac.save().then(() => {
                        res.send({ "success": true, ques })
                    })
                }).catch(err => {
                    res.send(err)
                })
            } else {
                console.log('error', err)
                res.send({ "success": false })
            }
        })
    }
    else {
        //FIXEME: ADD EVENT HANDLING
        res.send('FIXME: ADD EVENT HANDLING')
    }
})

admin_router.post('/question/testcase', checkAuthenticated, checkAdmin, (req, res) => {
    QuesSchema.findById(req.body.id).then(ques => {
        ques.testcases.push(new TestCaseSchema({
            input: req.body.input,
            output_compare: req.body.output_compare
        }))
        ques.save().then((ques) => {
            res.send({ "success": true, ques })
        }).catch(err => {
            res.send(err)
        })
    });
})

admin_router.post('/practise', checkAuthenticated, checkAdmin, (req, res) => {
    console.log(req.body)
    var testQues = new practiseSchema({
        name: req.body.name
    });
    testQues.save().then((ques) => {
        res.send({ "success": true, ques })
    }).catch(err => {
        res.send(err)
    })
})

module.exports = admin_router;