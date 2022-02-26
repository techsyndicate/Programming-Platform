// Import Modules
const express = require('express'),
    practise_router = express.Router();

const practiseSchema = require('../schema/practiseSchema'),
    { QuesSchema } = require('../schema/questionSchema');


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
            let to_return = Promise.all(practice);
            //console.log(await to_return)
            res.send(await to_return)
        }
        else {
            res.send({ "success": false, msg: "Practise not found" })
        }
    })
})

module.exports = practise_router;