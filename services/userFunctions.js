const Promise = require("bluebird");
const User = require("../models/applicant");
const userService = require("../services/userService");
require("dotenv").config();

/**
 * @function getUsers
 */
module.exports.getUsers = () => {
  return new Promise((resolve, reject) => {
    try {
      User.find({})
        .exec()
        .then(users => {
          return resolve(users);
        })
        .catch(err => reject(err));
    } catch (error) {
      return reject(error);
    }
  });
};

/**
 * @function addUser
 * @param {Object}
 */
module.exports.addUser = userDetails => {
  return new Promise((resolve, reject) => {
    try {
      User.findOne({
        $or: [{ regno: userDetails.regno }, { email: userDetails.email }]
      })
        .exec()
        .then(user => {
          console.log("query success");
          console.log(user);

          if (user) {
            message = "User already registered";
            return resolve(message);
          }
          message = userService.validate(userDetails);
          console.log(message);

          if (message !== "ok") return resolve(message);
          let newUser = new User(userDetails);
          if (userDetails.password === process.env.ADMIN_PASS) {
            newUser.role = "admin";
          }
          newUser.name = userDetails.name;
          newUser.email = userDetails.email;
          newUser.regno = userDetails.regno;
          newUser.phone = userDetails.phone;
          newUser.gender = userDetails.gender;
          newUser.password = newUser.generateHash(userDetails.password);
          console.log("password hashed");

          newUser.save().then(savedUser => resolve("ok"));
        })
        .catch(err => reject(err));
    } catch (error) {
      console.log(error);
      return reject(error);
    }
  });
};

/**
 * @function deleteUser
 * @param {Object}
 */
module.exports.deleteUser = id => {
  return new Promise((resolve, reject) => {
    try {
      User.findOne({
        _id: id
      })
        .exec()
        .then(user => {
          if (!user) {
            return reject(new Error("User doesn't exist"));
          }
          user
            .remove()
            .then(() => resolve())
            .catch(err => reject(err));
        })
        .catch(err => reject(err));
    } catch (error) {
      return reject(error);
    }
  });
};

/**
 * @function updateUser
 * @param {Object}
 */
module.exports.updateUser = userDetails => {
  return new Promise((resolve, reject) => {
    try {
      return User.findByIdAndUpdate(
        userDetails._id,
        { $set: userDetails },
        { new: true }
      )
        .exec()
        .then(user => {
          if (!user) {
            return reject(new Error("User not found"));
          }
          return resolve(user);
        })
        .catch(err => reject(err));
    } catch (error) {
      return reject(error);
    }
  });
};
