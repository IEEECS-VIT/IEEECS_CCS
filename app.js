var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const passport = require("passport");
const localstrategy = require("passport-local");
var mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
var adminRouter = require("./routes/admin");
var usersRouter = require("./routes/users");
var Q_Database = require("./models/question");

const auth = require("./middleware/authentication");
var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "Ferrari 488GTB",
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
require("./config/passport")(passport);

app.use("/admin", adminRouter);
app.use("/", usersRouter);

//setting Database
mongoose.connect(
  "mongodb://localhost/CCS",
  { useNewUrlParser: "true" }
);

// Demo data

// var stuff = new Q_Database({
//   QID: 1007,
//   question: "What is your favourite R6 operator"
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
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
