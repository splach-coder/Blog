const express = require('express');
const router = express.Router();
const controller = require('../controllers/usersRelationController');
const {
    ensureAuthenticated,
    forwardAuthenticated
} = require('../config/auth');


router.post('/friends/request', ensureAuthenticated, controller.sendFriendRequest, (req, res) => {
    res.send(req.request);
});

router.post('/friends/acceptRequest', ensureAuthenticated, controller.accepteFriendRequest, (req, res) => {
    res.send(req.request);
});

module.exports = router;