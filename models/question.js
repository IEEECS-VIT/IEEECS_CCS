const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  QID: Number,
  question: String
});

module.exports = mongoose.model("question", questionSchema);
