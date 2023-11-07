import "dotenv/config"

import nodemailer from "nodemailer";

const {UKR_NET_PASSWORD, UKR_NET_EMAIL} = process.env

const nodemailerConfig = {
  host: "smtp.ukr.net",
  port: 465,
  secure: true,
  auth: {
    user: UKR_NET_EMAIL,
    pass: UKR_NET_PASSWORD,
  }
}

const transport = nodemailer.createTransport(nodemailerConfig);

// const email = {
//   from: UKR_NET_EMAIL,
//   to: "difona8099@newnime.com",
//   subject: "Test email",
//   html: "<p>Test email</p>"
// }

// transport.sendMail(email)
//   .then(() => console.log("Email send success"))
//   .catch(error => console.log(error.message))


const sendEmail = (data) => {
    const email = {...data, from: UKR_NET_EMAIL}
    return transport.sendMail(email)
}

export default sendEmail;