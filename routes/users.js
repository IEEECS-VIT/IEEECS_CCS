var express = require("express");
var router = express.Router();
var Q_Database = require("../models/question");
var userService = require("../services/userService");
/* GET users listing. */

router.get("/", function(req, res, next) {
  res.send("respond with a resource");
});

router.get("/question", async (req, res, next) => {
  try {
    const stuff = await userService.setQuestions();
    res.json(stuff);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
