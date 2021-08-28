const User = require("../models/user");
const Tweet = require("../models/tweet");
const Relation = require("../models/relation");

exports.getUser = async (req, res) => {
    try {
        let user = await User.findOne({ username: req.query.username })
            .select("-password")
            .populate({ path: "tweets", select: "files likesCount" })
            .lean()
            .exec();

        const relation = await Relation.findOne({ user: user._id })
            .populate({ path: "followers", select: "username fullname" })
            .populate({ path: "following", select: "username fullname" })
            .lean().exec();

        user.followers = relation.followers;
        user.followersCount = relation.followersCount;
        user.followingCount = relation.followingCount;
        user.following = relation.following;

        if (!user) {
            return res.status(404).json({ success: false, message: "Requested User not Found" });
        }
        user.isMe = req.user.id === user._id.toString();

        res.status(200).json({ success: true, data: user });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.feed = async (req, res) => {
    try {
        const { following } = (await Relation.find({ user: req.user.id }, { following: 1, _id: 0 }))[0];
        const users = await User.find()
            .where("_id")
            .in(following.concat([req.user.id]))
            .exec();

        const tweetIds = users.map((user) => user.tweets).flat();

        const tweets = await Tweet.find()
            .populate({ path: "user", select: "fullname username" })
            .sort("-createdAt")
            .where("_id")
            .in(tweetIds)
            .lean()
            .exec();

        tweets.forEach((tweet) => {
            tweet.isLiked = false;
            const likes = tweet.likes.map((like) => like.toString());
            if (likes.includes(req.user.id)) {
                tweet.isLiked = true;
            }
        });

        res.status(200).json({ success: true, data: tweets });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.users = async (req, res) => {
    try {
        const usr = await User.find();

        res.status(200).json({ success: true, usr });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}