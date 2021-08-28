const Tweet = require("../models/tweet");
const User = require("../models/user");


exports.getTweet = async (req, res) => {
    try {
        const tweet = await Tweet.findById(req.query.id)
            .populate({
                path: "user",
                select: "username",
            })
            .lean()
            .exec();

        if (!tweet) {
            return res.status(404).json({ success: false, message: "No tweet Found" });
        }

        tweet.isMine = req.user.id === tweet.user._id.toString();

        const likes = tweet.likes.map((like) => like.toString());
        tweet.isLiked = likes.includes(req.user.id);



        res.status(200).json({ success: true, data: tweet });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.addTweet = async (req, res) => {
    try {
        const { caption, files = [] } = req.body;

        const user = req.user.id;

        let tweet = await Tweet.create({ caption, files, user });

        await User.findByIdAndUpdate(req.user.id, {
            $push: { tweets: tweet._id },
            $inc: { tweetCount: 1 },
        });

        tweet = await tweet
            .populate({ path: "user", select: "username fullname" })


        res.status(200).json({ success: true, data: tweet });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.toggleLike = async (req, res) => {
    try {
        const tweet = await Tweet.findById(req.query.id);

       

        if (!tweet) {
            return res.status(404).json({ success: false, message: "No tweet Found" });
        }

        if (tweet.likes.includes(req.user.id)) {
            const index = tweet.likes.indexOf(req.user.id);
            tweet.likes.splice(index, 1);
            tweet.likesCount = tweet.likesCount - 1;
            await tweet.save();
        } else {
            tweet.likes.push(req.user.id);
            tweet.likesCount = tweet.likesCount + 1;
            await tweet.save();
        }

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const tweet = await Tweet.findById(req.query.id);

        if (!tweet) {
            return res.status(404).json({ success: false, message: "No post found" });
        }

        if (tweet.user.toString() !== req.user.id) {
            return res.status(401).json({ success: false, message: "You are not authorized to delete this post" });
        }

        await User.findByIdAndUpdate(req.user.id, {
            $pull: { tweets: req.query.id },
            $inc: { tweetCount: -1 },
        });

        await tweet.remove();

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
