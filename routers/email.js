require('dotenv').config()

const emailQueueSchema = require('../schema/emailQueueSchema');
const nodemailer = require('nodemailer');
const userSchema = require('../schema/userSchema');
const {checkAuthenticated} = require('../utilities/passportReuse')
const express = require('express'),
    email_router = express.Router();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: false,
    secureConnection: false,
    port: 465,
    auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASSWORD // naturally, replace both with your real credentials or an application-specific password
    }, tls: {
        rejectUnauthorized: false
    }
});

email_router.get('/send', checkAuthenticated, (req, res) => {
    let email = new emailQueueSchema({
        email: req.user.email,
        status: false,
        userid: req.user.id,
        ISSUED_AT: new Date().toString()
    });
    email.save().then((res_mongo) => {
        const mailOptions = {
            from: process.env.GMAIL_EMAIL,
            to: req.user.email,
            subject: 'Verify Account For Ts-Prog',
            html: `<html><h2>Verify Account For Ts-Prog</h2><br><a href='https://ts-prog.herokuapp.com/email-back/callback/${res_mongo._id}'>https://ts-prog.herokuapp.com/email-back/callback/${res_mongo._id}</a></html>`
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                res.send({ success: false, error });
            } else {
                res.send({ success: true, msg: 'email-send', info });
            }
        });
    });
})

email_router.get('/callback/:id', (req, res) => {
    emailQueueSchema.findById(req.params.id).then((email) => {
        if (email) {
            emailQueueSchema.deleteMany({ userid: email.userid }).then(() => {
                userSchema.findById(email.userid).then((user) => {
                    user.emailVerified = true;
                    user.save().then(() => {
                        res.render('error', { error: 'Email Succesfully Verified', redirect: '/profile' });
                    });
                });
            });
        } else {
            res.render('error', { error: 'Email Verification Code, Expired Or Email Is Already Verified', redirect: '/profile' });
        }
    });
})

module.exports = email_router;