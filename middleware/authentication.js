module.exports = {
  isLoggedIn: (req, res, next) => {
    if (req.isAuthenticated()) {
      console.log("yes, is authenticated.");
      return next();
    }
    res.redirect("/");
  },

  isUser: (req, res, next) => {
    if (req.user && req.user.role === "public") return next();
    let error = new Error();
    error.message = "You were supposed to restore the force not destroy it.";
    error.status = 403;
    next(error);
  },

  isAdmin: (req, res, next) => {
    if (req.user && req.user.role === "admin") return next();
    let error = new Error();
    error.message = "You shall not pass.";
    error.status = 403;
    next(error);
  }
};
