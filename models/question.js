const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  qid: Number,
  question: String,
  answer: String,
  qDomain: {
    type: String,
    enum: ["technical", "design", "management"],
    default: "management"
  }
});

module.exports = mongoose.model("question", questionSchema);
