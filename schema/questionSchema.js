// Import Modules
const mongoose = require("mongoose"),
    moment = require("moment");

// constant variables
const reqString = { type: String, required: true },
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
    output: { type: String, required: false }
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
    leaderboard: [{type: String, required: false}],
    allSubmissions: [{ type: String, required: false }]
})

var QuesSchema = mongoose.model("Question", quesSchema);
var TestCaseSchema = mongoose.model("TestCase", testCaseSchema);

// Export Schema
module.exports = { QuesSchema, TestCaseSchema };