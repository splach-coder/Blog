const express = require('express');
const router = express.Router();
const libphonenumber = require('google-libphonenumber');

router.post('/phoneNumberFormat', async (req, res) => {
    try {
        // Listen for changes to the input field
        var inputValue = req.body.phoneNumber;

        inputValue = "+" + req.body.countryCode + inputValue;

        const util = libphonenumber.PhoneNumberUtil.getInstance();

        // Use the libphonenumber library to check if the entered value is a valid phone number for the selected country
        var phoneNumber = util.parse(inputValue, req.body.countryRegionCode);

        if (!util.isValidNumber(phoneNumber)) {
            // If the entered value is not a valid phone number, prevent the default behavior
            res.send("not valid");

        } else {
            const formattedNumber = util.format(phoneNumber, libphonenumber.PhoneNumberFormat.NATIONAL);

            res.send(formattedNumber);
        }

    } catch {
        res.status(500).send();
    }
})

module.exports = router;