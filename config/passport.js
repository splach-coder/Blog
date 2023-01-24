const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const User = require('../models/Users');

module.exports = function (passport) {
    passport.use(
        new LocalStrategy({
            usernameField: 'email'
        }, (email, password, done) => {
            //match user
            User.findOne({
                email
            }).then(user => {
                if (!user)
                    return done(null, false, {
                        message: "That email is not registered"
                    });


                if (!user.emailConfirmed) {
                    return done(null, false, {
                        message: 'Please confirm your email before logging in'
                    });
                }

                //match the password
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) throw err;

                    if (isMatch)
                        return done(null, user);
                    else
                        return done(null, false, {
                            message: "email or password is incorrect"
                        });
                })
            })
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    })
}