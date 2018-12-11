var express = require("express");
var router = express.Router();
const auth = require("../middleware/authentication");
var adminService = require("../services/adminService");
var A_Database = require("../models/applicant");
/* GET home page. */

router.get("/", async (req, res, next) => {
  try {
    var data = await A_Database.find(
      { role: "public" },
      "regno status domain phone startTime endTime"
    );
    res.render("userList", { data: data });
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
      "regno response status overSmart"
    ).populate("response.questionId", "question qDomain answer");
    // console.log(data);
    // res.json(data);
    res.render("userAns", { data: data });
    // res.json(data);
  } catch (error) {
    return next(error);
  }
});

router.post("/userdata/:idd", async (req, res, next) => {
  try {
    var idd = req.path;
    idd = idd.split("/");
    idd = idd[2];
    await adminService.updateStatus(idd, req.user.regno, req.body.status);
    res.send("Admin test complete");
  } catch (error) {
    return next(error);
  }
});
module.exports = router;
