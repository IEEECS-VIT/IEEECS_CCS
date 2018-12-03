var express = require("express");
var router = express.Router();
const auth = require("../middleware/authentication");
/* GET home page. */
router.use("/");

router.get("/", function(req, res, next) {
  res.send("Here in admin portal");
});

router.get("/question", (req, res, next) => {
  res.send("In questions page");
});

module.exports = router;
