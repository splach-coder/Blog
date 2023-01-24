const express = require('express');
const router = express.Router();
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
const allCountries = phoneUtil.getSupportedRegions().map(region => {
    return {
        code: phoneUtil.getCountryCodeForRegion(region),
        region: region
    }
});;

const {
    ensureAuthenticated,
    forwardAuthenticated
} = require('../config/auth');

allCountries.sort((a, b) => a.code - b.code);

//go to index page
router.get('/', forwardAuthenticated, (req, res) => {
    res.render('welcome');
})

//go to login page
router.get('/login', forwardAuthenticated, (req, res) => {
    res.render('login');
})

//go to login page
router.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.render('dashboard', {
        user: req.user
    });
})

//go to register page
router.get('/register', forwardAuthenticated, (req, res) => {
    res.render('register', {
        countries: allCountries
    });
})

module.exports = router;