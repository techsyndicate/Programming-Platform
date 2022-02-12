// Import Modules
const express = require('express'),
    practise_router = express.Router();

const practiseSchema = require('../schema/practiseSchema'),
    { checkAuthenticated } = require('../utilities/passportReuse');
const { QuesSchema } = require('../schema/questionSchema');


practise_router.get('/', (req, res) => {
    practiseSchema.find({}).then(practises => {
        res.send(practises)
    })
})

practise_router.get('/:id', async (req, res) => {
    practiseSchema.findOne({ name: req.params.id }).then(async practise => {
        if (practise) {
            var practice = practise.questions.map(item => {
                return new Promise(async (resolve, reject) => {
                    await QuesSchema.findById(item).then(question => {
                        var data = {
                            name: question.name,
                            id: question.id,
                        }
                        resolve(data)
                    })
                }).then(data => {
                    return data
                })
            })
            res.send(await Promise.all(
                practice
            ))
        }
        else {
            res.send({ "success": false, msg: "Practise not found" })
        }
    })
})

module.exports = practise_router;