const User = require('../models/Users');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const passport = require('passport');
const nodemailer = require('nodemailer');
const {
    validationResult
} = require('express-validator');
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
const allCountries = phoneUtil.getSupportedRegions().map(region => {
    return {
        code: phoneUtil.getCountryCodeForRegion(region),
        region: region
    }
});


const Register = async (req, res) => {

    const {
        firstname,
        lastname,
        email,
        countryCode,
        phone,
        jobtitle,
        password,
        passwordConfirmation
    } = req.body;

    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.render('register', {
            errors,
            firstname,
            lastname,
            email,
            phone,
            jobtitle,
            password,
            passwordConfirmation,
            countries: allCountries
        });
    } else {
        User.findOne({
                email: email
            })
            .then(async user => {
                if (user) {
                    errors.errors.push({
                        msg: "Email already registerd"
                    });

                    res.render('register', {
                        errors,
                        firstname,
                        lastname,
                        email,
                        phone,
                        jobtitle,
                        password,
                        passwordConfirmation,
                        countries: allCountries
                    });
                } else {
                    let newUser = new User({
                        firstname,
                        lastname,
                        email,
                        phone: `+(${countryCode}) ${phone}`,
                        jobtitle,
                        password,
                        confirmationToken: ''
                    });

                    // generate cryptographically secure token
                    const generateToken = () => {
                        return crypto.randomBytes(48).toString('hex');
                    };

                    // generate token
                    const token = generateToken();

                    // hash the token
                    const hash = await bcrypt.hash(token, 10);

                    // store the token in the user object
                    newUser.confirmationToken = hash;

                    // hash the password
                    await bcrypt.genSalt(10, async (err, salt) =>
                        await bcrypt.hash(newUser.password, salt, async (err, hash) => {
                            if (err) throw err;

                            //set password to hashed
                            newUser.password = hash;

                            await newUser.save()
                                .then(user => {
                                    const transporter = nodemailer.createTransport({
                                        service: 'gmail',
                                        auth: {
                                            user: 'anasbenbow123@gmail.com',
                                            pass: 'bdegordmtszeosjb'
                                        }
                                    });

                                    const mailOptions = {
                                        from: 'anasbenbow123@gmail.com',
                                        to: email,
                                        subject: 'Email Confirmation',
                                        html: `<p>Dear <b>${user.lastname}</b>,</p>
                                        <p>We are glad to have you on board! To complete the registration process, we kindly request that you confirm your email address by clicking on the link below:</p>
                                        <p><a href="http://localhost:${process.env.PORT}/users/confirm/${encodeURIComponent(token)}/${encodeURIComponent(user.id)}" target="_blank">Confirm</a></p>
                                        <p>By confirming your email, you will be able to fully access all the features of our service and be the first to know about our updates and offers.</p>
                                        <p>We appreciate your prompt attention to this matter, and look forward to providing you with the best experience possible.</p>
                                        <p>Best regards,<br>
                                        <b>New Horizons</b></p>
                                        `
                                    };

                                    transporter.sendMail(mailOptions, function (error, info) {
                                        if (error) {
                                            console.log(error);
                                        } else {
                                            console.log('Email sent: ' + info.response);
                                        }
                                    });

                                    req.flash('success_msg', 'You have successfully registered. Please confirm your email before logging in.')
                                    res.redirect('/login');

                                }).catch(err => {
                                    console.log(err);
                                    res.redirect('/register');
                                })
                        }))
                }
            })
    }
}

const Login = (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
}

const confirm = async (req, res) => {
    try {

        const tokenFromUrl = decodeURIComponent(req.params.token);

        // look up the user using the token
        const user = await User.findOne({
            _id: decodeURIComponent(req.params.id)
        });

        if (!user) {
            return res.status(404).send({
                msg: 'user not found'
            });
        }

        // compare the token from the URL with the hashed token in the database
        const match = await bcrypt.compare(tokenFromUrl, user.confirmationToken);

        if (!match) {
            return res.status(401).send({
                msg: 'Invalid token'
            });
        }

        // update the emailVerified field to true
        user.emailConfirmed = true;
        await user.save();

        // send a success message to the client
        res.status(200).send(
            'Email confirmed successfully Close that page and logged in.'
        );

    } catch (err) {
        res.status(500).send({
            msg: 'Error confirming email'
        });
    }
}

module.exports = {
    Register,
    Login,
    confirm
};