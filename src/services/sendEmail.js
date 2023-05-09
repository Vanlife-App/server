const nodemailer = require('nodemailer')

async function sendEmail(email, resetLink, callback) {
    try {
        const mail = nodemailer.createTransport({
            host: 'smtp-relay.sendinblue.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        })

        const info = await mail.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: "Password Reset Request",
            text: `Click the following link to reset your password: ${resetLink}`
        })

        callback({ success: true, message: "Email sent successfully" })
    } catch (err) {
        callback({ success: false, message: err.message })
    }
}

module.exports = sendEmail