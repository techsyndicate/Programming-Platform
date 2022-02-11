// Import Modules
const mongoose = require("mongoose"),
    moment = require("moment");

// constant variables
const reqString = { type: String, required: true },
    reqBool = { type: Boolean, required: true, default: false },
    dateStringWithTime = moment(new Date()).format('YYYY-MM-DD HH:MM:SS');

const testCaseSchema = new mongoose.Schema({
    input: reqString,
    output: reqString,
    date: {
        type: String,
        default: dateStringWithTime
    },
    passed: reqBool,
    output: reqString
})

// Schema
const ansSchema = new mongoose.Schema({
    date: {
        type: String,
        default: dateStringWithTime
    },
    testcases: [testCaseSchema],
    answerCode: reqString
})

var AnsSchema = mongoose.model("Answer", ansSchema);

// Export Schema
module.exports = AnsSchema