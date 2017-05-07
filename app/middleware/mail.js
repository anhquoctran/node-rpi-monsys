var nodemailer = require("nodemailer")

function Mail() {
    this.smtpTransport = function() {

        }
        /*nodemailer.createTransport("SMTP", {
            service: "Gmail",
            auth: {
                user: "rpimonsys.noreply@gmail.com",
                pass: "@Hueic2016"
            }
        })*/
}

module.exports = new Mail();