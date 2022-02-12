// Import Modules
const express = require('express'),
    practise_router = express.Router();

const { QuesSchema, TestCaseSchema } = require('../schema/questionSchema'),
    { checkAdmin, checkAuthenticated } = require('../utilities/passportReuse');

module.exports = practise_router;