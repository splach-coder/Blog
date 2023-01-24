const express = require('express');
const router = express.Router();
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
const allCountries = phoneUtil.getSupportedRegions().map(region => {
    return {
        code: phoneUtil.getCountryCodeForRegion(region),
        region: region
    }
});;

allCountries.sort((a, b) => a.code - b.code);

//go to index page
router.get('/', (req, res) => {
    res.render('welcome');
})

//go to login page
router.get('/login', (req, res) => {
    res.render('login');
})

//go to login page
router.get('/dashboard', (req, res) => {
    res.send('welcome to dashboard');
})

//go to register page
router.get('/register', (req, res) => {
    res.render('register', {
        countries: allCountries
    });
})

module.exports = router;