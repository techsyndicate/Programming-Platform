const express = require('express'),
    bodyParser = require('body-parser'),
    url = require('url'),
    cors = require('cors');


const bloat_router = express.Router();

//serve public folder
bloat_router.use(express.static('public'));

//cors middleware
const corsOptions = {
    origin: (origin, callback) => {
        callback(null, true);
    },
    credentials: true
}
bloat_router.use(cors(corsOptions))

//body parsers 
bloat_router.use(bodyParser.json({
    parameterLimit: 100000,
    limit: '50mb'
}));

bloat_router.use(bodyParser.urlencoded({
    parameterLimit: 100000,
    limit: '50mb',
    extended: true
}));

//export routers
module.exports = bloat_router;