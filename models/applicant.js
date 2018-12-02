const mongoose = require("mongoose");

const applicantSchema = new mongoose.Schema({});

module.exports = mongoose.model("applicant", applicantSchema);
