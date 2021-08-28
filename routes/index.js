const router = require("express").Router();
const AuthRouter = require('./auth');
const TweetRouter = require('./tweet');
const UserRouter = require('./user');
const RelationRouter = require('./relation');


router.use("/auth", AuthRouter);
router.use("/tweet", TweetRouter);
router.use("/user", UserRouter);
router.use("/relation", RelationRouter);


module.exports = router;