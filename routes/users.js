var express = require("express");
var router = express.Router();
var Q_Database = require("../models/question");
var A_Database = require("../models/applicant");
var userService = require("../services/userService");
var userFunctions = require("../services/userFunctions");
var passport = require("passport");
const auth = require("../middleware/authentication");
const request = require("request-promise");
var date = new Date();

router.get("/", (req, res) => {
  res.render("index", { message: req.flash("message") || "" });
});

router.post(
  "/login",
  passport.authenticate("login", {
    successRedirect: "/user-role",
    failureRedirect: "/",
    failureFlash: true
  })
);

router.get("/register", (req, res) => {
  res.render("register", { message: "" });
});

router.post("/register", async (req, res, next) => {
  const options = {
    method: "POST",
    uri: "https://www.google.com/recaptcha/api/siteverify",
    formData: {
      secret: process.env.RECAPTCHA_SECRET,
      response: req.body["g-recaptcha-response"]
    }
  };
  request(options)
    .then(response => {
      let cResponse = JSON.parse(response);
      if (!cResponse.success) {
        throw "Error in captcha";
      }
      return userFunctions
        .addUser(req.body)
        .then(function(message) {
          if (message === "ok") return res.redirect("/");
          res.render("register", { message: message });
        })
        .catch(err => {
          console.log(err);
          next(err);
        });
    })
    .catch(err => {
      res.render("register", { message: err });
    });
});

router.get("/user-role", auth.isLoggedIn, (req, res, next) => {
  try {
    console.log("entered user-role");

    if (req.user.role === "admin") {
      return res.redirect("/admin");
    }
    res.redirect("/instructions");
  } catch (error) {
    next(error);
  }
});

// router.get("/data/:idd", async (req, res, next) => {
//   try {
//     var idd = req.path;
//     idd = idd.split("/");
//     idd = idd[2];
//     var data = await A_Database.find(
//       { regno: idd },
//       "regno response status overSmart"
//     ).populate("response.questionId", "question qDomain answer");
//     res.json(data);
//   } catch (error) {
//     next(error);
//   }
// });

router.get("/logout", auth.isUser, (req, res) => {
  req.logout();
  res.redirect("/");
});
router.get("/thanks", auth.isUser, (req, res, next) => {
  req.logout();
  res.render("thanks");
});

router.get(
  "/instructions",
  auth.isUser,
  auth.isAttempt,
  async (req, res, next) => {
    res.render("instructions", { user: req.user });
  }
);

router.post("/domain", auth.isUser, auth.isAttempt, async (req, res, next) => {
  try {
    var startTime = Date.now();
    var domain = req.body.domain;
    var maxTime = domain.length * 900;
    await A_Database.findByIdAndUpdate(req.user.id, {
      domain: domain,
      startTime: startTime,
      maxTime: maxTime
    });
    // res.redirect
    res.json({ success: true });
  } catch (error) {
    return next(error);
  }
});

router.get("/question", auth.isUser, auth.isAttempt, async (req, res, next) => {
  try {
    var stuff = await userService.setQuestions(req.user.id);

    let questions = stuff.map(question => {
      return {
        questionId: question._id,
        userSolution: ""
      };
    });
    await A_Database.findByIdAndUpdate(req.user.id, {
      response: questions,
      attempted: true
    });
    const data = await A_Database.find(
      { _id: req.user.id },
      "response domain maxTime"
    ).populate("response.questionId", "question qDomain");

    res.render("quiz", { data: data[0] });
  } catch (error) {
    return next(error);
  }
});

router.post("/question", auth.isUser, auth.isSubmit, async (req, res, next) => {
  try {
    const solutions = req.body.solutions;
    console.log(solutions);
    var endTime = Date.now();
    let user = await A_Database.findById(req.user.id);
    console.log(user);
    let responseToUpdate = user.response;
    responseToUpdate.forEach(question => {
      solutions.forEach(solution => {
        if (solution.questionId == question.questionId) {
          question.userSolution = solution.userSolution;
        }
      });
    });
    user.response = responseToUpdate;
    user.submitted = true;
    user.endTime = endTime;
    await user.save();

    await userService.timeStatus(req.user.id);
    res.json({ success: true });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
