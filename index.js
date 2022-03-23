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
const MONGO_PASSWORD = process.env.MONGO_PASSWORD
const MONGO_USER = process.env.MONGO_USER
const MONGO_CLUSTER_URL = process.env.MONGO_CLUSTER_URL
const MONGO_DATABASE_NAME = process.env.MONGO_DATABASE_NAME
const db = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_CLUSTER_URL}/${MONGO_DATABASE_NAME}?retryWrites=true&w=majority`

//passportJs
app.use(session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true
}));

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

function serverHealth() {
    CheckServerHealth('http://' + process.env.SERVER_BACKEND_VM + '/language').then((res) => {
        if (res.status !== 200) {
            ReportCodeExec('Code Execution Service Has Crashed Please Check <@823237564130525184>')
        }
    })
}
serverHealth();
setInterval(() => {
    serverHealth()
}, 60000);

app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, './react-app/build', 'index.html')));

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