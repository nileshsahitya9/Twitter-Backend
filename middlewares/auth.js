const jwt = require("jsonwebtoken");
const User = require("./../models/user");

module.exports = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return res.status(403).json({ success: false, message: 'Authentication Failed' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(403).json({ success: false, message: 'User Not Found' });
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(500).json({ success: false, message: err });
    }
};