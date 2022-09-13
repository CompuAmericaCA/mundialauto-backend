const mailer = require("nodemailer");
const config = {
    host: process.env.EMAIL_SMTP_HOST,
    port: process.env.EMAIL_SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
}

module.exports = {
    sendEmail: (sendObj) => {
        let transporter = mailer.createTransport(config);
        transporter.sendMail({
            from: '"SysAuto" <arysauto@compuamerica.com.ve>',
            to: sendObj.to,
            subject: sendObj.subject,
            html: sendObj.body
        });
    }  
}