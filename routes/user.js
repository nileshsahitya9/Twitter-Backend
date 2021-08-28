const express = require("express");
const router = express.Router();
const {
    getUser,
    feed,
    users
} = require("../controllers/user");

const checkAuth = require("../middlewares/auth");

router.route("/users").get(users);
router.use(checkAuth);
router.route("/feed").get(feed);
router.route("/username").get(getUser);


module.exports = router;