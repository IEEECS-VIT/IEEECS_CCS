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
      questions = await Q_Database.find({ qDomain: newDomain }).lean();
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
    var endHour = data.endHour;
    var endMinute = data.endMinute;
    var startHour = data.startHour;
    var startMinute = data.startMinute;
    var len = data.domain;
    len = len.length;
    var actDuration = 20 * len;

    var duration =
      (endHour - (startHour + 1)) * 60 + (60 - startMinute + endMinute);
    actDuration = duration - actDuration;
    var status = "hold";
    if (actDuration > 10) {
      status = "invalid";
    }
    await A_Database.findByIdAndUpdate(id, { status: status });
  } catch (error) {
    throw error;
  }
};
