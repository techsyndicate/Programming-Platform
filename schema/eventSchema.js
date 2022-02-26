// Import Modules
const mongoose = require("mongoose"),
    moment = require("moment");

// constant variables
const reqString = { type: String, required: true },
reqStringFalse = { type: String, required: false },
    reqBool = { type: Boolean, required: true, default: false },
    dateStringWithTime = moment(new Date()).format('YYYY-MM-DD HH:MM:SS');

// Schema
const eventSchema = new mongoose.Schema({
    name: reqString,
    date: {
        type: String,
        default: dateStringWithTime
    },
    startTime: reqStringFalse,
    endTime: reqStringFalse,
    public: reqBool,
    questions: [{questionid: reqString, points: reqString}],
    leaderboard: [{userid: reqStringFalse, points: reqStringFalse, time: reqStringFalse}],
})

// Export Schema
module.exports = mongoose.model("Event", eventSchema);