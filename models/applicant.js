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
  regno: {
    type: String,
    unique: true
  },
  phone: Number,
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    default: "other"
  },
  domain: [String],
  response: [
    {
      questionId: {
        type: mongoose.Schema.ObjectId,
        ref: "question"
      },
      userSolution: String
    }
  ],
  // answer: [Object],
  role: {
    type: String,
    enum: ["admin", "public"],
    default: "public"
  },
  status: {
    type: String,
    enum: ["approved", "reject", "hold", "invalid"],
    default: "hold"
  },
  overSmart: {
    type: String,
    enum: ["yes", "no"],
    default: "no"
  },
  check: String,
  startTime: Number,
  endTime: Number,
  maxTime: Number,
  submitted: {
    type: Boolean,
    enum: [true, false],
    default: false
  },
  attempted: {
    type: Boolean,
    enum: [true, false],
    default: false
  }
});

applicantSchema.methods.generateHash = password => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(salt_factor), null);
};
module.exports = mongoose.model("applicant", applicantSchema);
