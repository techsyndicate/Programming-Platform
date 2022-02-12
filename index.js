require('dotenv').config()

const express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    session = require("cookie-session"),
    path = require('path'),
    cookieParser = require("cookie-parser"),
    fs = require('fs'),
    passport = require('passport');

const port = process.env.PORT || 3200,
    passport_init = require('./passport'),
    bloatRouter = require('./routers/bloat'),
    adminRouter = require('./routers/admin'),
    questionRouter = require('./routers/question'),
    authRouter = require("./routers/auth");

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

app.use(cookieParser("secretcode1"));

passport_init(passport);

//initializing passport
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.resolve(__dirname, './react-app/build')));

app.use(bloatRouter);
app.use("/auth", authRouter)
app.use('/admin', adminRouter)
app.use('/question', questionRouter)
app.get('*', (req,res,next)=> res.sendFile(path.resolve(__dirname, './react-app/build', 'index.html')));

mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connected to Mongo DB")
    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`)
    })
}).catch(err => console.log(err))