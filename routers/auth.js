// Import Modules
const express = require('express'),
    auth_router = express.Router(),
    bcrypt = require('bcrypt'),
    passport = require('passport');

// Import Files
const User = require('./../schema/userSchema'),
    { validateEmail } = require('../utilities/misc');

// Register
auth_router.post("/register", async (req, res, next) => {
    let errors = [];
    const { username, email, password } = req.body
    if (!username || !email || !password) {
        errors.push({ msg: "Please Fill in all the fields" })
        return res.send(errors);
    }
    if (username.length < 3 || username.length > 64) {
        errors.push({ msg: "username should be in between 4 and 64 characters" })
    }
    if (password.length < 5 || password.length > 64) {
        errors.push({ msg: "Password should be in between 6 and 64 characters" })
    }
    if (!validateEmail(email)) {
        errors.push({ msg: 'The email is not a valid email.' })
    }
    await User.findOne({ email: email }).then(user => {
        if (user) {
            errors.push({ msg: "Email already exists" })
        }
    })
    await User.findOne({ username: username }).then(user => {
        if (user) {
            errors.push({ msg: "Username already exists" })
        }
    })

    if (errors.length > 0) {
        res.send(errors)
    }
    else {
        const newUser = new User({
            "username": username,
            "email": email,
            "password": password,
        })
        bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err
            newUser.password = hash;
            newUser.save().then(_ => {
                loginUser(req, res, next);
            })
        }))
    }
})

// Login
auth_router.post('/login', (req, res, next) => {
    loginUser(req, res, next);
})

// Send User Data
auth_router.get("/user", (req, res) => {
    var user = JSON.parse(JSON.stringify(req.user));
    delete user.password;
    res.send(user);
});

// Logout User
auth_router.get('/logout', (req, res) => {
    req.logout();
    res.send("Successfully Logged Out");
})

// Login User Function
function loginUser(req, res, next) {
    passport.authenticate('local', (err, user, info) => {
        if (err) throw err;
        if (!user) res.send([{ msg: info.message }]);
        else {
            req.logIn(user, (err) => {
                if (err) throw err;
                res.send([{ msg: "Successfully Authenticated", sucess: true }]);
            });
        }
    })(req, res, next);
}

module.exports = auth_router;