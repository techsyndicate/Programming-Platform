// Import Modules
const mongoose = require("mongoose"),
    moment = require("moment");

// constant variables
const reqString = { type: String, required: true },
    reqStringFalse = { type: String, required: false },
    reqBool = { type: Boolean, required: true, default: false },
    dateStringWithTime = moment(new Date()).format('YYYY-MM-DD HH:MM:SS');

const testCaseSchema = new mongoose.Schema({
    input: reqString,
    output_compare: reqString,
    date: {
        type: String,
        default: dateStringWithTime
    },
    passed: reqBool,
    output: [{ type: String, required: false, default: "" }]
})

// Schema
const quesSchema = new mongoose.Schema({
    name: reqString,
    ques: reqString,
    practise: reqBool,
    prac_evenid: reqString,
    prac_even_name: reqString,
    date: {
        type: String,
        default: dateStringWithTime
    },
    testcases: [testCaseSchema],
    accepted_submissions: [{submissionid: reqStringFalse, userid: reqStringFalse}]
})

var QuesSchema = mongoose.model("Question", quesSchema);

// Export Schema
module.exports = { QuesSchema };