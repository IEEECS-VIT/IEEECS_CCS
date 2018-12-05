var express = require("express");
var router = express.Router();
var Q_Database = require("../models/question");
var A_Database = require("../models/applicant");
var userService = require("../services/userService");
var userFunctions = require("../services/userFunctions");
var passport = require("passport");
var adminRouter = require("../routes/admin");
const auth = require("../middleware/authentication");
var date = new Date();

router.post(
  "/login",
  passport.authenticate("login", {
    successRedirect: "/",
    failureRedirect: "/fail",
    failureFlash: true
  })
);

router.post("/register", async (req, res, next) => {
  return userFunctions
    .addUser(req.body)
    .then(function() {
      res.redirect("/loggedin");
    })
    .catch(next);
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/loggedout");
});

router.get("/fail", (req, res, next) => {
  res.send("Failed");
});

router.get("/loggedin", (req, res, next) => {
  res.send("Logged in");
});

router.get("/loggedout", (req, res, next) => {
  res.send("Logged logout");
});

router.get("/", (req, res, next) => {
  res.send("User router");
});

// router.use("/", auth.isAdmin, adminRouter);

router.post("/domain", auth.isUser, async (req, res, next) => {
  try {
    var startHour = date.getHours();
    var startMinute = date.getMinutes();
    await A_Database.findByIdAndUpdate(req.user.id, {
      domain: req.body.domain,
      startHour: startHour,
      startMinute: startMinute
    });
    res.redirect("/question");
  } catch (error) {
    return next(error);
  }
});

router.get("/question", auth.isUser, async (req, res, next) => {
  try {
    var stuff = await userService.setQuestions(req.user.id);
    console.log(stuff);
    await A_Database.findByIdAndUpdate(req.user.id, { question: stuff });
    res.json(stuff);
  } catch (error) {
    return next(error);
  }
});

router.post("/question", auth.isUser, async (req, res, next) => {
  try {
    var endHour = date.getHours();
    var endMinute = date.getDate();
    await A_Database.findByIdAndUpdate(req.user.id, {
      answer: req.body.answer,
      endHour: endHour,
      endMinute: endMinute
    });
    await userService.timeStatus(req.user.id);
    res.redirect("/");
  } catch (error) {
    return next(error);
  }
});
module.exports = router;
