// Import Modules
const express = require('express'),
    admin_router = express.Router();

// Import Files
const PractiseSchema = require('../schema/practiseSchema'),
    EventSchema = require('../schema/eventSchema'),
    userSchema = require('../schema/userSchema'),
    { QuesSchema } = require('../schema/questionSchema'),
    { checkAdmin, checkAuthenticated } = require('../utilities/passportReuse');

// Show Admin Pannel Base
admin_router.get('/', checkAuthenticated, checkAdmin, (req, res) => {
    res.render('admin');
})

// Add Practise Section Form
admin_router.get('/practise', checkAuthenticated, checkAdmin, (req, res) => {
    res.render('admin_practise.ejs')
})

// Add Event Section Form
admin_router.get('/event', checkAuthenticated, checkAdmin, (req, res) => {
    res.render('admin_event.ejs')
})

// Add Question To Event Or Practise Form
admin_router.get('/question', checkAuthenticated, checkAdmin, (req, res) => {
    res.render('admin_ques.ejs')
})

// Add Testcases To Question
admin_router.get('/question/testcase', checkAuthenticated, checkAdmin, (req, res) => {
    res.render('admin_testcase.ejs')
})

// Show All Users In Platform
admin_router.get('/user/all', checkAuthenticated, checkAdmin, (req, res) => {
    userSchema.find().then((all_users) => {
        res.render('admin_allUsers.ejs', { users: all_users })
    })
})

// Redirect to /user/ban/:id for the given id form
admin_router.get('/user/ban', checkAuthenticated, checkAdmin, (req, res) => {
    res.render('admin_ban.ejs')
})

//confirm ban of user at :id
admin_router.get('/user/ban/:id', checkAuthenticated, checkAdmin, (req, res) => {
    userSchema.findById(req.params.id).then((user) => {
        res.render('admin_userBan.ejs', { userid: req.params.id, user })
    })
})

/* Server Requests */

//Ban User
admin_router.get('/user/ban_confirmed/:id', checkAuthenticated, checkAdmin, (req, res) => {
    userSchema.findByIdAndUpdate(req.params.id, { $set: { banned: true } }, { new: true }, (err, user) => {
        res.redirect('/admin/user/all')
    })
})

//Unban User
admin_router.get('/user/unban_confirmed/:id', checkAuthenticated, checkAdmin, (req, res) => {
    userSchema.findByIdAndUpdate(req.params.id, { $set: { banned: false } }, { new: true }, (err, user) => {
        res.redirect('/admin/user/all')
    })
})

// Add Question To Database
admin_router.post('/question', checkAuthenticated, checkAdmin, (req, res) => {
    if (req.body.practise === true) {
        PractiseSchema.findById(req.body.prac_evenid, (err, prac) => {
            if (!prac) {
                return res.send({ "success": false })
            }
            var testQues = new QuesSchema({
                practise: req.body.practise,
                prac_evenid: req.body.prac_evenid,
                prac_even_name: prac.name,
                name: req.body.name,
                ques: req.body.ques,
                testcases: {
                    input: req.body.input,
                    output_compare: req.body.output_compare
                }
            });
            testQues.save().then((ques) => {
                prac.questions.push(ques._id);
                prac.save().then(() => {
                    res.send({ "success": true, ques })
                })
            }).catch(err => {
                res.send(err)
            })
        })
    }
    else {
        EventSchema.findById(req.body.prac_evenid, (err, prac) => {
            if (!prac) {
                return res.send({ "success": false })
            }
            var testQues = new QuesSchema({
                practise: req.body.practise,
                prac_evenid: req.body.prac_evenid,
                prac_even_name: prac.name,
                name: req.body.name,
                ques: req.body.ques,
                testcases: {
                    input: req.body.input,
                    output_compare: req.body.output_compare
                }
            });
            testQues.save().then((ques) => {
                prac.questions.push({ questionid: ques._id, points: req.body.points });
                prac.save().then(() => {
                    res.send({ "success": true, ques })
                })
            }).catch(err => {
                res.send(err)
            })
        })
    }
})

// Add Testcase To Question In Database
admin_router.post('/question/testcase', checkAuthenticated, checkAdmin, (req, res) => {
    QuesSchema.findById(req.body.id).then(ques => {
        ques.testcases.push({
            input: req.body.input,
            output_compare: req.body.output_compare
        })
        ques.save().then((ques) => {
            res.send({ "success": true, ques })
        }).catch(err => {
            res.send(err)
        })
    });
})

// Add Practise Section In Database
admin_router.post('/practise', checkAuthenticated, checkAdmin, (req, res) => {
    var practise = new PractiseSchema({
        name: req.body.name
    });
    practise.save().then((ques) => {
        res.send({ "success": true, ques })
    }).catch(err => {
        res.send(err)
    })
})

// Add Event Section In Database
admin_router.post('/event', checkAuthenticated, checkAdmin, (req, res) => {
    var event = new EventSchema({
        name: req.body.name,
        startTime: req.body.start_time,
        endTime: req.body.end_time,
        public: req.body.public
    });
    event.save().then((ques) => {
        res.send({ "success": true, ques })
    }).catch(err => {
        res.send(err)
    })
})

module.exports = admin_router;