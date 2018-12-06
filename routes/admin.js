var express = require("express");
var router = express.Router();
const auth = require("../middleware/authentication");
var adminService = require("../services/adminService");
var A_Database = require("../models/applicant");
/* GET home page. */

router.get("/", auth.isAdmin, (req, res, next) => {
  res.send("Here in admin portal");
});

router.get("/logout", auth.isAdmin, (req, res) => {
  req.logout();
  res.redirect("/loggedout");
});

router.get("/user", auth.isAdmin, async (req, res, next) => {
  try {
    var data = await A_Database.find({ role: "public" }, "regno name status");
    res.json(data);
  } catch (error) {
    return next(error);
  }
});

router.get("/:idd", auth.isAdmin, async (req, res, next) => {
  try {
    var idd = req.path;
    idd = idd.substr(1);
    var data = await A_Database.find(
      { regno: idd },
      "regno question answer status"
    );
    res.json(data);
  } catch (error) {
    return next(error);
  }
});

router.post("/:idd", auth.isAdmin, async (req, res, next) => {
  try {
    var idd = req.path;
    idd = idd.substr(1);
    await adminService.updateStatus(idd, req.user.id, req.body.status);
    res.send("Admin test complete");
  } catch (error) {
    return next(error);
  }
});
module.exports = router;
