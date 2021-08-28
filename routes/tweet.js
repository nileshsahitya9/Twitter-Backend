const express = require("express");
const router = express.Router();
const {
    getTweet,
    addTweet,
    toggleLike,
    deletePost
} = require("../controllers/tweet");
const checkAuth = require("../middlewares/auth");

router.use(checkAuth)
router.route("/").post(addTweet).get(getTweet).delete(deletePost);
router.route("/togglelike").get(toggleLike);

module.exports = router;