const mongoose = require("mongoose");

const bcrypt = require("bcrypt-nodejs");
salt_factor = 8;

mongoose.set("useCreateIndex", true);

const applicantSchema = new mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String,
    unique: true
  },
  password: String,
  REG: String,
  Questions: [String],
  Answers: [String],
  role: {
    type: String,
    enum: ["admin", "public"],
    default: "public"
  }
});

applicantSchema.methods.generateHash = password => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(salt_factor), null);
};
module.exports = mongoose.model("applicant", applicantSchema);
