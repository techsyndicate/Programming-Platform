// Import Modules
const mongoose = require("mongoose"),
    moment = require("moment");

// constant variables
const reqString = { type: String, required: true },
    reqBool = { type: Boolean, required: true, default: false },
    dateStringWithTime = moment(new Date()).format('YYYY-MM-DD HH:MM:SS');

// Schema
const eventSchema = new mongoose.Schema({
    name: reqString,
    date: {
        type: String,
        default: dateStringWithTime
    },
    questions: [{ type: String, required: false }],
    leaderboard: [{type:String, required:false}]
})

// Export Schema
module.exports = mongoose.model("Event", eventSchema);