const Q_Database = require("../models/question");

module.exports.setQuestions = async domain => {
  try {
    const questions = await Q_Database.find({ qDomain: domain }).lean();
    var j, x, i;
    for (i = questions.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = questions[i];
      questions[i] = questions[j];
      questions[j] = x;
    }
    return questions;
  } catch (error) {
    throw error;
  }
};
