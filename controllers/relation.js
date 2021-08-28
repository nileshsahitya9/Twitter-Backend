const User = require("../models/user");
const Relation = require("../models/relation");

exports.follow = async (req, res) => {
    try {
        const user = await User.findById(req.query.id);

        const relation = await Relation.findOne({ user: req.query.id });

        if (!user) {
            return res.status(404).json({ success: false, message: "Requested User not Found" });
        }


        if (req.query.id === req.user.id) {
            return res.status(400).json({ success: false, message: "This action is not allowed" });
        }

        if (relation.followers.includes(req.user.id)) {
            return res.status(400).json({ success: false, message: "User already Followed" });
        }

        await Relation.findOneAndUpdate({ user: req.query.id }, {
            $push: { followers: req.user.id },
            $inc: { followersCount: 1 },
        });
        await Relation.findOneAndUpdate({ user: req.user.id }, {
            $push: { following: req.query.id },
            $inc: { followingCount: 1 },
        });

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.unfollow = async (req, res) => {
    try {
        const user = await User.findById(req.query.id);

        if (!user) {
            return res.status(404).json({ success: false, message: "Requested User not Found" });
        }

        if (req.query.id === req.user.id) {
            return res.status(400).json({ success: false, message: "This action is not allowed" });
        }

        await Relation.findOneAndUpdate({ user: req.query.id }, {
            $pull: { followers: req.user.id },
            $inc: { followersCount: -1 },
        });
        await Relation.findOneAndUpdate({ user: req.user.id }, {
            $pull: { following: req.query.id },
            $inc: { followingCount: -1 },
        });

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

