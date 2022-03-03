// Import Modules
const express = require('express'),
    auth_router = express.Router(),
    bcrypt = require('bcrypt'),
    passport = require('passport');
const { checkAuthenticated } = require('../utilities/passportReuse');

// Import Files
const User = require('./../schema/userSchema'),
    { validateEmail } = require('../utilities/misc');

var scopes = ['identify', 'email', 'guilds', 'guilds.join', 'guilds.members.read', 'gdm.join'];

// Register
auth_router.post("/register", async (req, res, next) => {
    let errors = [];
    const { username, email, password, school, name} = req.body
    if (!username || !email || !password || !school || !name) {
        errors.push({ msg: "Please Fill in all the fields" })
        return res.send(errors);
    }
    if (username.length < 3 || username.length > 64) {
        errors.push({ msg: "username should be in between 4 and 64 characters" })
    }
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~/\s/g]/;
    if (specialChars.test(username)) {
        errors.push({ msg: "username should not contain special characters or spaces" })
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
            "school": school,
            "name": name
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

// Discord Login
auth_router.get('/discord-login', (req,res,next)=>{
    res.redirect(`https://discord.com/api/oauth2/authorize?response_type=code&client_id=${process.env.DISCORD_CLIENT_ID}&scope=${encodeURI(scopes.join(' '))}&redirect_uri=${process.env.DISCORD_REDIRECT_URI_LOGIN}&prompt=consent`);
})

//FIXME: Public Profiles
// Send User Data
auth_router.get("/user", (req, res) => {
    if (req.user) {
        var user = JSON.parse(JSON.stringify(req.user));
        delete user.password;
        user.sucess = true;
        res.send(user);
    }
    else {
        res.send({sucess:false, msg:"User not found"});
    }
});

// Logout User
auth_router.get('/logout', (req, res) => {
    req.logout();
    res.send("Successfully Logged Out");
})

// Update User Bio
auth_router.post('/bio', checkAuthenticated , (req,res,next)=>{
    const {bio} = req.body;
    User.findOneAndUpdate({email:req.user.email},{$set:{bio:bio}},{new:true}).then(_=>{
        res.send({sucess:true});
    })
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