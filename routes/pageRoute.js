const express = require("express");
const pageController = require("../controllers/pageController.js");
const router = express.Router();

router.route("/").get(pageController.welcome);

module.exports = router;
