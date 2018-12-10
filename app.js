const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const passport = require("passport");
const bodyParser = require("body-parser");
const localstrategy = require("passport-local");
const mongoose = require("mongoose");
const session = require("cookie-session");
const flash = require("connect-flash");
require("dotenv").config();

//setting Database
mongoose.connect(
  process.env.MONGO_URI,
  { useNewUrlParser: true, useFindAndModify: false },
  err => {
    if (!err) console.log("Connection successful");
  }
);

const usersRouter = require("./routes/users");
const adminRouter = require("./routes/admin");

const Q_Database = require("./models/question");

const auth = require("./middleware/authentication");
const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const keys = ["Ron", "Swanson"];
const expiryDate = new Date(5 * Date.now() + 60 * 60 * 1000); // 5 hours
// console.log(expiryDate);
app.use(
  session({
    secret: "mustache",
    resave: true,
    saveUninitialized: true,
    cookie: {
      secure: true,
      expires: expiryDate
    },
    keys: keys
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use("/", usersRouter);
app.all("/admin*", auth.isAdmin);
app.use("/admin", adminRouter);
require("./config/passport")(passport);

// Demo data

// const stuff = new Q_Database({
//   qid: 1007,
//   question: "name your favourite software",
//   answer: "This is the answer",
//   qDomain: "technical"
// });
// stuff.save(function(err, Q_Database) {
//   if (err) {
//     console.log("error");
//   } else {
//     console.log("We just saved something");
//     console.log(Q_Database);
//   }
// });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  console.log(err);

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.json({ success: false, msg: err });
});

module.exports = app;
