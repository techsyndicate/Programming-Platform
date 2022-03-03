// Import Modules
const express = require('express'),
    practise_router = express.Router();

// Import Files
const practiseSchema = require('../schema/practiseSchema'),
    { QuesSchema } = require('../schema/questionSchema');

// Return All Practise Sections
practise_router.get('/', (req, res) => {
    practiseSchema.find({}).then(practises => {
        let to_return = practises.map(practise => {
            return {
                name: practise.name
            }
        })
        //console.log(to_return)
        res.send(to_return)
    })
})

// Return All Practise Details For The Given practise id
practise_router.get('/:id', async (req, res) => {
    practiseSchema.findOne({ name: req.params.id }).then(async practise => {
        if (practise) {
            var practice = practise.questions.map(async item => {
                const data_1 = await new Promise(async (resolve, reject) => {
                    await QuesSchema.findById(item).then(question => {
                        var data = {
                            name: question.name,
                            id: question.id,
                            accepted_submissions: question.accepted_submissions,
                            prac_even_name: question.prac_even_name,
                            accepted_code: Object.keys(question.accepted_submissions).some((k) => {
                                if (req.user) {
                                    return question.accepted_submissions[k].userid === req.user.id;
                                } else {
                                    return false;
                                }
                            })
                        };
                        resolve(data);
                    });
                });
                return data_1;
            })
            let practice_data = await Promise.all(practice);
            practice_data.sort(function (x, y) {
                return (x.accepted_code === y.accepted_code) ? 0 : x.accepted_code ? 1 : -1;
            });
            let to_return = {
                success: true,
                data: practice_data
            }
            //console.log(await to_return)
            res.send(to_return)
        }
        else {
            res.send({ "success": false, msg: "Practise not found" })
        }
    })
})

module.exports = practise_router;