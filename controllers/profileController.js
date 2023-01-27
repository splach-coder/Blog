const Friendship = require('../models/friendShip');
const User = require('../models/Users');


const Friends = async (req, res, next) => {
    Friendship.find({
        $or: [{
            user: req.params.userId
        }, {
            friend: req.params.userId
        }]
    }).populate("friend").exec((err, friends) => {
        if (err) {
            // handle the error
        }

        // friends will contain the array of friendship records where the user is listed as a friend
        let friendsData = []
        friends.forEach((friendship) => {
            User.findById(friendship.friend, (err, friend) => {
                if (err) {
                    console.log(err);
                }
                friendsData.push(friend);
            });
        });

        req.friendsData = friendsData;
        next();
    });

}

const Users = async (req, res, next) => {

    const acceptedFriendIds = await Friendship.find({
        $or: [{
                userId: req.user.id
            },
            {
                friendId: req.user.id
            }
        ]
    }).select('user friend');

    //console.log(acceptedFriendIds);


    const friendsIds = acceptedFriendIds.map(friendship => {
        if (friendship.user.toString() === req.user.id) {
            return friendship.friend;
        } else {
            return friendship.user;
        }
    });

  //  console.log(friendsIds);

    User.find({
        _id: {
            $ne: req.user.id,
            $nin: friendsIds
        }
    }, (err, users) => {
        if (err) {
            console.log(err);
        }

        req.users = users;
        next();
    })
}


module.exports = {
    Friends,
    Users
}