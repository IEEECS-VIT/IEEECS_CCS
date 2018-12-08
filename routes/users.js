var express = require("express");
var router = express.Router();
var Q_Database = require("../models/question");
var A_Database = require("../models/applicant");
var userService = require("../services/userService");
var userFunctions = require("../services/userFunctions");
var passport = require("passport");
const auth = require("../middleware/authentication");
var date = new Date();

router.get("/", (req, res) => {
  res.render("index");
});

router.post(
  "/login",
  passport.authenticate("login", {
    successRedirect: "/user-role",
    failureRedirect: "/fail",
    failureFlash: true
  })
);

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", async (req, res, next) => {
  return userFunctions
    .addUser(req.body)
    .then(function() {
      res.redirect("/");
    })
    .catch(next);
});

router.get("/user-role", (req, res, next) => {
  try {
    if (req.user.role === "admin") {
      return res.redirect("/admin");
    }
    res.redirect("/instructions");
  } catch (error) {
    next(error);
  }
});

// router.get("/", (req, res, next) => {
//   try {
//     if (req.user.role === "admin") {
//       res.redirect("/admin");
//     }
//     res.send("User router");
//   } catch (error) {
//     next();
//   }
// });

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get("/fail", (req, res, next) => {
  res.send("Failed");
});

router.get("/instructions", auth.isUser, (req, res, next) => {
  res.render("instructions");
});

// router.get("/loggedout", (req, res, next) => {
//   res.send("Logged logout");
// });

router.post("/domain", auth.isUser, async (req, res, next) => {
  try {
    var startHour = date.getHours();
    var startMinute = date.getMinutes();
    console.log(req.user.id);
    console.log(req.body);
    await A_Database.findByIdAndUpdate(req.user.id, {
      domain: req.body.domain,
      startHour: startHour,
      startMinute: startMinute
    });
    // res.redirect
    res.redirect("/question");
  } catch (error) {
    return next(error);
  }
});

router.get("/question", auth.isUser, async (req, res, next) => {
  try {
    var stuff = await userService.setQuestions(req.user.id);
    console.log(stuff);

    let questions = stuff.map(question => {
      return {
        questionId: question._id,
        userSolution: ""
      };
    });
    await A_Database.findByIdAndUpdate(req.user.id, {
      response: questions
    });
    console.log(req.user.id);
    const data = await A_Database.find(
      { _id: req.user.id },
      "response domain"
    ).populate("response.questionId", "question qDomain");
    res.json(data);
  } catch (error) {
    return next(error);
  }
});

router.post("/question", auth.isUser, async (req, res, next) => {
  try {
    const solutions = req.body.solutions;
    console.log(solutions);
    var endHour = date.getHours();
    var endMinute = date.getDate();
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
    user.endHour = endHour;
    user.endMinute = endMinute;
    await user.save();

    await userService.timeStatus(req.user.id);
    res.send("done!");
  } catch (error) {
    return next(error);
  }
});

// router.get("/getdata", async (req, res, next) => {
//   const q = await A_Database.find({}).populate(
//     "response.questionId",
//     "question qDomain userSolution"
//   );
//   res.json(q);
// });

module.exports = router;
