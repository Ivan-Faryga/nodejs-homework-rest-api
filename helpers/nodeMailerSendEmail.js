const nodemailer = require("nodemailer");
require("dotenv").config();

const { META_PASSWORD } = process.env;

const nodemailerConfig = {
  host: "smtp.meta.ua",
  port: 465,
  secure: true,
  auth: {
    user: "ifaryga@meta.ua",
    pass: META_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(nodemailerConfig);

const email = {
  to: "vodeba2945@showbaz.com",
  from: "ifaryga@meta.ua",
  subject: "just some testing mess",
  html: "<p>Hello World ))</p>",
};

transporter
  .sendMail(email)
  .then(() => console.log("email sent successfully"))
  .catch((error) => console.log(error.message));
