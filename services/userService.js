const Q_Database = require("../models/question");
const A_Database = require("../models/applicant");
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

module.exports.timeStatus = async id => {
  try {
    const data = await A.Database.findById(req.user.id, {});
    var endHour = data.endHour;
    var endMinute = data.endMinute;
    var startHour = data.startHour;
    var startMinute = data.startMinute;
    var len = data.domain;
    len = len.length;
    var actDuration = 20 * len;
    // (endHour - startHour) * 60 + (endMinute - (startMinute - 60));

    var duration =
      (endHour - (startHour + 1)) * 60 + (60 - startMinute + endMinute);
    actDuration = duration - actDuration;
    var status = "hold";
    if (actDuration > 10) {
      status = "invalid";
    }
    await A_Database.findByIdAndUpdate(req.user.id, { status: status });
  } catch (error) {
    throw error;
  }
};
