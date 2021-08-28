const User = require("../models/user");
const Relation = require("../models/relation");

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Provide Email and Password' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ success: false, message: 'User Not Found' });
        }

        const match = await user.checkPassword(password);

        if (!match) {
            return res.status(400).json({ success: false, message: "The password does not match" });
        }
        const token = user.getJwtToken();

        res.status(200).json({ success: true, token });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.signup = async (req, res) => {
    try {
        const { fullname, username, email, password } = req.body;

        const user = await User.create({ fullname, username, email, password });
        try {
            await Relation.create({ user: user._id });
        } catch (err) {
            await User.remove({ email: req.body.email.trim() });
            throw (err.message);
        }
        const token = user.getJwtToken();
        res.status(200).json({ success: true, token });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.profile = async (req, res) => {
    try {
        const { username, fullname, email, _id } = req.user;

        res
            .status(200)
            .json({
                success: true,
                data: { username, fullname, email, _id },
            });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}