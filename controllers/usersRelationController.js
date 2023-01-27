const User = require('../models/Users');
const friendShip = require('../models/friendShip');


const sendFriendRequest = async (req, res, next) => {
    const user1Id = req.body.from;
    const user2Id = req.body.to;

    console.log(req.body)

    const friendship = new friendShip({
        user: user1Id,
        friend: user2Id
    });

    await friendship.save();

    req.request = 'sended @#$';
    next();
}


const accepteFriendRequest = async (req, res, next) => {
    const user1Id = req.body.from;
    const user2Id = req.body.to;

    console.log(req.body);

    friendShip.updateOne({
        user: user1Id,
        friend: user2Id
    }, {
        $set: {
            status: 'accepted'
        }
    }, (err, doc) => {
        if (err) return handleError(err);
        console.log(doc);
        if (doc.modifiedCount === 1)
            req.request = 'accepted @#$';
        else
            req.request = 'error @#$';
    });


    next();
}


const friendRequests = async (req, res, next) => {
    const id = req.user.id;

    friendShip.find({
        $and: [{
                friend: id
            },
            {
                status: 'pending'
            }
        ]
    }).populate("user").exec((err, friends) => {
        if (err) {
            console.log(err)
        }
        console.log(friends)
        // friends will contain the array of friendship records where the user is listed as a friend
        let friendsData = [];
        friends.forEach(function (f) {
            friendsData.push(f.user);
        })
        req.friendsData = friendsData;
        next();
    });
}



module.exports = {
    sendFriendRequest,
    friendRequests,
    accepteFriendRequest
};