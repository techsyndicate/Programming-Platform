const express = require('express'),
    bodyParser = require('body-parser'),
    cors = require('cors');

const bloat_router = express.Router();

//serve public folder
bloat_router.use(express.static('public'));

//cors middleware
const whitelist = ['http://localhost:3000', 'http://localhost:3200', 'https://ts-prog.herokuapp.com', 'http://192.168.1.33:3200/'];
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            console.log(origin, "Not allowed by CORS ORIGIN policy")
            callback(new Error("Not allowed by CORS ORIGIN: "+origin))
        }
    },
    credentials: true
}
bloat_router.use(cors(corsOptions))

// Allowed hosts
const allowedHosts = ['localhost', 'ts-prog.herokuapp.com', '192.168.1.33'];
const checkHosts = (req, res, next) => {
    if (allowedHosts.includes(req.hostname)) {
        return next();
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