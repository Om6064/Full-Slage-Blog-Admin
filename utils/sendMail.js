const nodemailer = require("nodemailer");
const sendMail = async (otp, subject, to) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.USER_EMAIL,
            pass: process.env.USER_PASS,
        },
    });

    const htmlTemplate = `
        <h2>Password Reset Request</h2>
        <p>Your OTP is:</p>
        <h1 style="letter-spacing:5px;">${otp}</h1>
        <p>This OTP is valid for 10 minutes.</p>
    `;

    (async () => {
        const info = await transporter.sendMail({
            from: process.env.USER_EMAIL,
            to,
            subject,
            html: htmlTemplate,
        });
    })();
}

module.exports = sendMail