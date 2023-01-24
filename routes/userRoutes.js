const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const {
    check
} = require('express-validator');

const {
    forwardAuthenticated
} = require('../config/auth');



router.post('/register', [
    check('firstname').notEmpty().withMessage('First Name is required').trim().escape(),
    check('lastname').notEmpty().withMessage('Last Name is required').trim().escape(),
    check('email').notEmpty().withMessage('Email is required').isEmail().normalizeEmail(),
    check('phone').notEmpty().withMessage('Phone is required').trim().escape(),
    check('jobtitle').notEmpty().withMessage('Job Title is required').trim().escape(),
    check('password').notEmpty().withMessage('Password is required'),
    check('password').isLength({
        min: 6
    }).withMessage('Password should be at least 6 characters'),
    check('passwordConfirmation').notEmpty().withMessage('Confirm Password is required'),
    check('passwordConfirmation').custom((value, {
        req
    }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords do not match');
        }
        return true;
    })

], userController.Register);


router.post('/login', [
    check('email').notEmpty().withMessage('Email is required').isEmail().normalizeEmail(),
    check('password').notEmpty().withMessage('Password is required')
], userController.Login);


router.get('/confirm/:token/:id', forwardAuthenticated, userController.confirm);


// Logout
router.get('/logout', userController.Logout);


module.exports = router;