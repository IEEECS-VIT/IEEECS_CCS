const Q_Database = require("../models/question");

module.exports.setQuestions = async () => {
  try {
    const questions = await Q_Database.find({}).lean();
    var element;
    var alloted_Q = [];
    var i = 0;
    while (i < 5) {
      element = questions[Math.floor(Math.random() * questions.length)];
      if (alloted_Q.includes(element)) {
        continue;
      } else {
        alloted_Q.push(element);
        i++;
      }
    }
    return alloted_Q;
  } catch (error) {
    throw error;
  }
};
