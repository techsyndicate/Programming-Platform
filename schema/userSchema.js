// Import Modules
const mongoose = require("mongoose"),
    moment = require("moment");

// constant variables
const reqString = { type: String, required: true },
    reqStringFalseDefEmpty = { type: String, required: false, default: "" },
    reqStringFalse = { type: String, required: false},
    reqBool = { type: Boolean, required: true, default: false },
    reqBoolFalse = { type: Boolean, required: false, default: false },

    dateStringWithTime = moment(new Date()).format('YYYY-MM-DD HH:MM:SS');

// Schema
const userSchema = new mongoose.Schema({
    email: reqString,
    username: reqString,
    password: reqString,
    date: {
        type: String,
        default: dateStringWithTime
    },
    solvedQuestions: [reqString],
    solvedAnswers: [reqString],
    admin: reqBool,
    discord: {
        access_token: reqStringFalse,
        expires_in: reqStringFalse,
        refresh_token: reqStringFalse,
        scope: reqStringFalse,
        token_type: reqStringFalse,
        ISSUED_AT: reqStringFalse
    },
    discordUser: {
        ISSUED_AT: reqStringFalse,
        id: reqStringFalse,
        username: reqStringFalse,
        avatar: reqStringFalse,
        discriminator: reqStringFalse,
        public_flags: reqStringFalse,
        flags: reqStringFalse,
        banner: reqStringFalse,
        banner_color: reqStringFalse,
        accent_color: reqStringFalse,
        locale: reqStringFalse,
        mfa_enabled: reqStringFalse,
        email: reqStringFalse,
        verified: reqBoolFalse
    }
})

// Export Schema
module.exports = mongoose.model("User", userSchema)