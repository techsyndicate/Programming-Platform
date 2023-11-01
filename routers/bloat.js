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

// Allowed hosts
const allowedHosts = whitelist;
const checkHosts = (req, res, next) => {
    for (i in allowedHosts) {
        if (req.hostname.includes(allowedHosts[i])) {
            return next();
        }
    }
    return res.sendStatus(403);
}
bloat_router.use(checkHosts);

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