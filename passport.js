const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const User = require('./schema/userSchema');

const { validateEmail } = require('./utilities/misc')

async function initialize(passport) {
    const authenticateUser = async (email, password, done) => {
        if (!validateEmail(email)) {
            return done(null, false, { message: 'The email is not a valid email.' })
        }
        if (password.length < 6) {
            return done(null, false, { message: 'The password is not a valid password.' })
        }
        User.findOne({ email: email }).then(async user => {
            if (!user) {
                return done(null, false, { message: 'There is no user with That email' })
            }
            try {
                return (await bcrypt.compare(password, user.password)) ? done(null, user) : done(null, false, { message: 'The Password you have entered is inncorrect.' });
            } catch (e) {
                console.log(e)
                return done(null, false, { message: e })
            }
        })
    }

    await passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
    await passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(null, user, { message: err });
        });
    });
}

module.exports = initialize