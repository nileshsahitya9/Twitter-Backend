const express = require("express");
const router = express.Router();
const { login, signup, profile } = require("../controllers/auth");
const checkAuth = require("../middlewares/auth");

router.route("/signup").post(signup);
router.route("/login").post(login);
router.use(checkAuth);
router.route("/profile").get(profile);

module.exports = router;