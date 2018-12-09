const Q_Database = require("../models/question");
const A_Database = require("../models/applicant");
module.exports.setQuestions = async id => {
  try {
    var domain = await A_Database.findById(id, "domain");
    domain = domain.domain;
    var fArray = [];
    for (var ii = 0; ii < domain.length; ii++) {
      var newDomain = domain[ii];
      var questions = [];
      questions = await Q_Database.find({ qDomain: newDomain }, "_id").lean();
      var j, x, i;
      for (i = questions.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = questions[i];
        questions[i] = questions[j];
        questions[j] = x;
      }
      fArray.push.apply(fArray, questions);
    }
    return fArray;
  } catch (error) {
    throw error;
  }
};

module.exports.timeStatus = async id => {
  try {
    const data = await A_Database.findById(id, {});
    var startTime = data.startTime;
    var endTime = data.endTime;
    var maxTime = data.maxTime;

    var duration = endTime - startTime;
    var actDuration = duration - maxTime;
    actDuration = actDuration / 60;
    var overSmart = "no";
    if (actDuration > 5) {
      overSmart = "yes";
    }
    await A_Database.findByIdAndUpdate(id, { overSmart: overSmart });
  } catch (error) {
    throw error;
  }
};
