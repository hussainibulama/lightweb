var express = require("express");
var router = express.Router();
const path = require("path");
const app = express();
var nodemailer = require("nodemailer");
var cors = require("cors");
const creds = require("./config");

app.use(express.static(path.join(__dirname, "build")));
app.use(express.json());

var transport = {
  host: "smtp.gmail.com", // Don’t forget to replace with the SMTP host of your provider
  port: 587,
  secure: false,
  auth: {
    user: creds.USER,
    pass: creds.PASS,
  },
};

var transporter = nodemailer.createTransport(transport);

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take messages");
  }
});

app.post("/submit", (req, res, next) => {
  var name = req.body.name;
  var email = req.body.email;
  var number = req.body.number;
  var project_details = req.body.project_details;
  var other = req.body.other;
  var reason = req.body.reason;
  var how = req.body.how;
  var content = `name: ${name} \n email: ${email} \n message: ${project_details}  \n other: ${other} \n reason: ${reason} \n how: ${how}`;

  var mail = {
    from: email,
    to: "lightwebltd@gmail.com", // Change to email address that you want to receive messages on
    subject: number,
    text: content,
  };

  transporter.sendMail(mail, (err, data) => {
    if (err) {
      res.json({
        status: "fail",
      });
    } else {
      res.json({
        status: "success",
        success: "success",
      });
    }
  });
});

app.use(cors());
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});
app.listen(3002);
