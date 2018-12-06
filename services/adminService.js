const Q_Database = require("../models/question");
const A_Database = require("../models/applicant");

module.exports.updateStatus = async (userRegno, adminRegno, status) => {
  try {
    await A_Database.findOneAndUpdate(
      { regno: userRegno },
      { status: status, check: adminRegno }
    );
  } catch (error) {
    throw error;
  }
};
