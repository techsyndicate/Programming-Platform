const express = require('express'),
    Axios = require('axios'),
    answer_router = express.Router();

const { QuesSchema, TestCaseSchema } = require('../schema/questionSchema'),
    { checkAdmin, checkAuthenticated } = require('../utilities/passportReuse');

answer_router.post('/run/python', checkAuthenticated, async (req, res) => {
    console.log(req.body);
    var text = req.body.code;
    var input = req.body.input;
    console.log(text, input);
    if (text != '#write ur code here' && text) {
        try {
            await Axios({
                url: 'http://40.122.201.43:3000/language/python',
                withCredentials: true,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    code: text,
                    input_exec: input.split("\n"),
                    authString: process.env.SERVER_AUTH_STRING
                }
            }).then(data => {
                data.data.success = true;
                res.send(data.data)
            })
        } catch {
            res.send({
                "success": false,
                "error": "Server Error Try Again in a few minutes"
            })
        }
    }
    else {
        res.send({ "success": false, msg: "Pls fill the text code" })
    }
})

module.exports = answer_router;