const express = require("express");
const router = express.Router();
const {
    follow,
    unfollow
} = require("../controllers/relation");

const checkAuth = require("../middlewares/auth");

router.use(checkAuth);
router.route("/follow").get(follow);
router.route("/unfollow").get(unfollow);


module.exports = router;