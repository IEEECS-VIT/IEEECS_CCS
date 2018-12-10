module.exports = {
  isLoggedIn: (req, res, next) => {
    console.log("tryna auth");
    console.log(req.user);

    if (req.isAuthenticated()) {
      console.log("yes, is authenticated.");
      return next();
    }
    console.log("auth failed");

    res.redirect("/");
  },

  isUser: (req, res, next) => {
    if (req.user && req.user.role === "public") return next();
    let error = new Error();
    error.message = "You were supposed to restore the force not destroy it.";
    error.status = 403;
    next(error);
  },

  isAttempt: (req, res, next) => {
    if (!req.user.attempted) return next();
    // let error = new Error();
    message = "You have already Attampted the quiz.";
    // error.status = 403;
    res.render("thanks", { message });
  },
  isSubmit: (req, res, next) => {
    if (!req.user.submitted) return next();
    message = "You have already submitted the page.";
    res.render("thanks", { message });
  },

  isAdmin: (req, res, next) => {
    if (req.user && req.user.role === "admin") return next();
    let error = new Error();
    error.message = "You shall not pass.";
    error.status = 403;
    next(error);
  }
};
