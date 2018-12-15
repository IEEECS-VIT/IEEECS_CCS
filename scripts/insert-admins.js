const Applicant = require("../models/applicant");
const mongoose = require("mongoose");
//setting Database
const csv = require("csvtojson");
const path = require("path");
const Promise = require("bluebird");
const nodemailer = require("nodemailer");
require("dotenv").config();

const saveAdmins = () => {
  return mongoose.connect(
    process.env.MONGO_URI,
    { useNewUrlParser: true },
    async () => {
      console.log("connection successfull");
      const csvFilePath = path.join(__dirname, "..", "data", "members.csv");
      const jsonArray = await csv().fromFile(csvFilePath);
      jsonArray.map(async member => {
        const admin = new Applicant(member);
        const password = Math.floor(1000000000 + Math.random() * 9000000000);
        admin.password = admin.generateHash(password);
        admin.role = "admin";
        const savedAdmin = await admin.save();
        console.log("Admin saved", savedAdmin);

        let transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_ID,
            pass: process.env.EMAIL_PASS
          }
        });

        let mailOptions = {
          to: member.email,
          from: process.env.EMAIL_ID,
          subject: "IEEECS CCS Portal Admin Credentials",
          text:
            "Register with your registration number at ccs.ieeecsvit.com, password is: " +
            password
        };

        try {
          let info = await transporter.sendMail(mailOptions);
          console.log("Message sent successfully, to user:", member.name);
          console.log(nodemailer.getTestMessageUrl(info));
          transporter.close();
        } catch (error) {
          console.log(error);
        } finally {
          return "done";
        }
      });
    }
  );
};

saveAdmins();
