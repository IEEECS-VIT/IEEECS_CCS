var express = require("express");
var router = express.Router();
var Q_Database = require("../models/question");
var A_Database = require("../models/applicant");
var userService = require("../services/userService");
var userFunctions = require("../services/userFunctions");
var passport = require("passport");
var adminRouter = require("../routes/admin");
const auth = require("../middleware/authentication");
/* GET users listing. */

// router.get("/", function(req, res, next) {
//   res.send("Home Page");
// });
router.get("/fail", (req, res, next) => {
  res.send("Failed");
});

router.get("/loggedin", (req, res, next) => {
  res.send("Logged in");
});

router.post(
  "/login",
  passport.authenticate("login", {
    successRedirect: "/",
    failureRedirect: "/fail",
    failureFlash: true
  })
);

router.post("/register", async (req, res, next) => {
  // console.log("Yay here");
  return userFunctions
    .addUser(req.query)
    .then(function() {
      passport.authenticate("login", {
        successRedirect: "/loggedin",
        failureRedirect: "/fail",
        failureFlash: true
      })(req, res, function() {
        res.redirect("/home");
      });
    })
    .catch(next);
});

router.use("/", auth.isLoggedIn, adminRouter);

// router.get("/logout", (req, res) => {
//   req.logout();
//   res.redirect("/");
// });

// router.get("/question", async (req, res, next) => {
//   try {
//     const stuff = await userService.setQuestions();
//     res.json(stuff);
//   } catch (error) {
//     return next(error);
//   }
// });

module.exports = router;
