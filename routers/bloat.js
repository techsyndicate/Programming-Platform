const express = require('express'),
    bodyParser = require('body-parser'),
    path = require('path')
cors = require('cors');

const bloat_router = express.Router();

//serve public folder
bloat_router.use(express.static('public'));
bloat_router.use(express.static('react-app/build'));

//cors middleware
const whitelist = ['https://ts-prog-frontend.trafficmanager.net/', 'http://localhost:3000', 'http://localhost:3200', 'https://ts-prog.herokuapp.com', 'https://ts-prog1.herokuapp.com/'];
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            console.log(origin, "Not allowed by CORS ORIGIN policy")
            callback(new Error("Not allowed by CORS ORIGIN: " + origin))
        }
    },
    credentials: true
}
bloat_router.use(cors(corsOptions))

// Allowed hosts
const allowedHosts = ['localhost', 'herokuapp.com','trafficmanager.net'];
const checkHosts = (req, res, next) => {
    console.log(req.hostname)
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