var express = require("express");
var router = express.Router();
const auth = require("../middleware/authentication");
var adminService = require("../services/adminService");
var A_Database = require("../models/applicant");
/* GET home page. */

router.get("/", (req, res, next) => {
  res.send("Here in admin portal");
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/loggedout");
});

router.get("/user", async (req, res, next) => {
  try {
    var data = await A_Database.find({ role: "public" }, "regno name status");
    res.json(data);
  } catch (error) {
    return next(error);
  }
});

router.get("/userdata/:idd", async (req, res, next) => {
  try {
    var idd = req.path;
    idd = idd.split("/");
    idd = idd[2];
    console.log(idd);
    var data = await A_Database.find(
      { regno: idd },
      "regno response status"
    ).populate("response.questionId", "question qDomain answer");
    res.json(data);
  } catch (error) {
    return next(error);
  }
});

router.post("/userdata/:idd", async (req, res, next) => {
  try {
    var idd = req.path;
    idd = idd.split("/");
    idd = idd[2];
    await adminService.updateStatus(idd, req.user.id, req.body.status);
    res.send("Admin test complete");
  } catch (error) {
    return next(error);
  }
});
module.exports = router;
