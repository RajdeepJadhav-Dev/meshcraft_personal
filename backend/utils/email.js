const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
    },
});

const sendEmail = async (to, subject, htmlContent) => {
    const mailOptions = {
        from: `"Meshcraft" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html: htmlContent,
    };
    await transporter.sendMail(mailOptions);
};

module.exports = { sendEmail };