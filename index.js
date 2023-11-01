const discord_router = require('./routers/discord');
const email_router = require('./routers/email');
const event_router = require('./routers/event');
const { ReportWebVital, ReportCrash, CheckServerHealth, ReportCodeExec } = require('./utilities/misc');

require('dotenv').config()

const express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    session = require("cookie-session"),
    path = require('path'),
    cookieParser = require("cookie-parser"),
    passport = require('passport');

const port = process.env.PORT || 3200,
    passport_init = require('./passport'),
    bloatRouter = require('./routers/bloat'),
    adminRouter = require('./routers/admin'),
    questionRouter = require('./routers/question'),
    practiseRouter = require('./routers/practise'),
    answerRouter = require('./routers/answer'),
    authRouter = require("./routers/auth");


if (process.env.NODE_ENV === 'production') {
    app.enable('trust proxy');
}
else {
    app.disable('trust proxy');
}

app.use((req, res, next) => {
    if (req.headers.hasOwnProperty('x-forwarded-proto') && req.headers['x-forwarded-proto'].toString() !== 'https' && process.env.NODE_ENV === 'production') {
        res.redirect('https://' + req.headers.host + req.url);
    }
    else {
        next();
    }
})

//ejs
app.set('view engine', 'ejs');

//mongo
const db = process.env.MONGO_URI;

//passportJs
if (process.env.NODE_ENV === 'production') {
app.use(session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
    sameSite: 'none',
    overwrite: true,
    secure: true,
    maxAge: 1000 * 60 * 60 * 24 * 7
}));
} else {
    app.use(session({
        secret: process.env.SECRET,
        resave: true,
        saveUninitialized: true,
    }));
}

app.use(cookieParser(process.env.SECRET));

passport_init(passport);

//initializing passport
app.use(passport.initialize());
app.use(passport.session());

app.use(bloatRouter);
app.use("/auth", authRouter)
app.use('/admin', adminRouter)
app.use('/question', questionRouter)
app.use('/ans', answerRouter)
app.use('/practise-back', practiseRouter)
app.use('/event-back', event_router)
app.use('/discord-back', discord_router)
app.use('/email-back', email_router)

app.use((err, req, res, next) => {
    ReportCrash(err.stack.toString())
    ReportWebVital("App Has Crashed, Please Check The Logs, Trying To Restart On My Own!");
    next(err)
})

async function serverHealth() {
    CheckServerHealth(process.env.SERVER_BACKEND_VM + '/language').then(async (res) => {
        if (res.status !== 200) {
            ReportCodeExec('Code Execution Service Has Crashed Please Check')
        }
    })
}

serverHealth();
setInterval(() => {
    serverHealth()
}, 60000);

app.get('*', (req, res) => {
    console.log(req.url)
    res.redirect(process.env.FRONT_END_URL + req.url);
});

mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    ReportWebVital(`Connected to Mongo DB`);
    console.log("Connected to Mongo DB")
    app.listen(port, () => {
        ReportWebVital(`TS Prog listening at port ${port}`);
        console.log(`TS Prog listening at http://localhost:${port}`)
    })
}).catch(err => {
    ReportCrash(err.stack.toString())
    ReportWebVital("App Has Crashed, Please Check The Logs, Trying To Restart On My Own!");
})