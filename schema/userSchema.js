// Import Modules
const mongoose = require("mongoose"),
    moment = require("moment");

// constant variables
const reqString = { type: String, required: true },
    dateStringWithTime = moment(new Date()).format('YYYY-MM-DD HH:MM:SS');

// Schema
const userSchema = new mongoose.Schema({
    email: reqString,
    username: reqString,
    password: reqString,
    date: {
        type: String,
        default: dateStringWithTime
    }
})

// Export Schema
module.exports = mongoose.model("User", userSchema)
