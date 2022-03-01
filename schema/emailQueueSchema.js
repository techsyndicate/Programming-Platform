const mongoose = require("mongoose"),
    moment = require("moment");

// constant variables
const reqString = { type: String, required: true },
    reqBool = { type: Boolean, required: true, default: false },
    dateStringWithTime = moment(new Date()).format('YYYY-MM-DD HH:MM:SS');

const EmailQueueSchema = new mongoose.Schema({
    email: reqString,
    date: {
        type: String,
        default: dateStringWithTime
    },
    status: reqBool,
    userid: reqString,
    ISSUED_AT: reqString
})

module.exports = mongoose.model("EmailQueue", EmailQueueSchema);