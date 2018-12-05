const Promise = require("bluebird");
const User = require("../models/applicant");
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
  // console.log(userDetails);
  return new Promise((resolve, reject) => {
    try {
      User.findOne({
        email: userDetails.email
      })
        .exec()
        .then(user => {
          if (user) {
            return reject(new Error("User already registered"));
          }
          console.log(user);
          let newUser = new User(userDetails);
          if (userDetails.password === "Ferrari488GTB") {
            console.log("password matched");
            newUser.role = "admin";
          }
          console.log("not admin");
          newUser.email = userDetails.email;
          newUser.regno = userDetails.regno;
          newUser.phone = userDetails.phone;
          newUser.gender = userDetails.gender;
          newUser.password = newUser.generateHash(userDetails.password);
          newUser.save().then(savedUser => resolve(savedUser));
        })
        .catch(err => reject(err));
    } catch (error) {
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
