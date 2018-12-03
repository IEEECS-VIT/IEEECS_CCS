var express = require("express");
var router = express.Router();
const auth = require("../middleware/authentication");
/* GET home page. */

router.get("/", (req, res, next) => {
  res.send("Here in admin portal");
});

router.get("/correction", (req, res, next) => {
  res.send("In corrections page");
});

module.exports = router;
