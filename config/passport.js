const passportStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt-nodejs");
const User = require("../models/applicant");

// /**
//  * @function passport
//  * returns promisified done status for login/register
//  */
module.exports = passport => {
  passport.serializeUser((user, done) => done(null, user.id));

  passport.deserializeUser((id, done) => {
    User.findById(id)
      .exec()
      .then(user => done(null, user))
      .catch(err => done(err));
  });

  passport.use(
    "login",
    new passportStrategy(
      {
        usernameField: "regno",
        passwordField: "password",
        passReqToCallback: true
      },
      (req, regno, password, done) => {
        process.nextTick(() => {
          User.findOne({
            regno: regno
          })
            .exec()
            .then(user => {
              console.log("hhelloee");
              if (!user) {
                console.log("wrong id");
                return done(null, false, {
                  message: "User not found."
                });
              }
              if (!bcrypt.compareSync(password, user.password)) {
                console.log("wrong pass");
                return done(null, false, {
                  message: "Wrong password."
                });
              }
              return done(null, user);
            })
            .catch(err => done(err));
        });
      }
    )
  );
};
