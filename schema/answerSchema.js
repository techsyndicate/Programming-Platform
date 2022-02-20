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
    output: [{ type: String, required: false, default: "" }]
})

// Schema
const ansSchema = new mongoose.Schema({
    date: {
        type: String,
        default: dateStringWithTime
    },
    testcases: [testCaseSchema],
    quesid: reqString,
    userid: reqString,
    quesName: reqString,
    ansPython: reqString,
    accepted: reqBool,
    language: {type:String, required:false, default:"python3"}
})

var AnsSchema = mongoose.model("Answer", ansSchema);

// Export Schema
module.exports = AnsSchema