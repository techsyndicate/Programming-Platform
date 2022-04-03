const express = require('express'),
    bodyParser = require('body-parser'),
    url = require('url'),
    cors = require('cors');


const bloat_router = express.Router();

//serve public folder
bloat_router.use(express.static('public'));
bloat_router.use(express.static('react-app/build'));

//cors middleware
const whitelist = ['ts-prog1.herokuapp.com', 'localhost', 'netlify.app', 'techsyndicate.us'];
const corsOptions = {
    origin: (origin, callback) => {
        if (origin) {
            var urlParsed = url.parse(origin, true)
            var included = false;
            for (i in whitelist) {
                if (urlParsed.hostname.includes(whitelist[i])) {
                    included = true;
                    callback(null, true);
                }
                else if (i == whitelist.length - 1 && !included) {
                    console.log("not allowed", urlParsed.hostname);
                    callback(new Error("Not allowed by CORS ORIGIN: " + urlParsed.hostname))
                }
            }
        }
        else if (!origin) {
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