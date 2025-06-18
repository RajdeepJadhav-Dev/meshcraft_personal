const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const UserSchema = require('../models/user');
const connectDB = require('../config/db');

exports.handler = async (event) => {
    await connectDB();
    try {
        const { email } = JSON.parse(event.body);

        const user = await UserSchema.findOne({ email });
        if (!user) {
            return {
                statusCode: 404,
                body: JSON.stringify('User not found')
            };
        }

        const resetToken = crypto.randomBytes(20).toString('hex');
        const hash = await bcrypt.hash(resetToken, 10);

        user.resetPasswordToken = hash;
        user.resetPasswordExpires = Date.now() + 3600000;
        await user.save();

        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${user._id}/${resetToken}`;

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_APP_PASSWORD,
            },
        });

        const mailOptions = {
            from: `"Meshcraft" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: 'Password Reset',
            html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2 style="color: #333;">Password Reset Request</h2>
                <p>Hi ${user.username || 'User'},</p>
                <p>You requested to reset your password. Click the link below to reset it:</p>
                <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; margin: 10px 0; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">Reset Password</a>
                <p>If you did not request a password reset, please ignore this email.</p>
            </div>
        `,
        };

        await transporter.sendMail(mailOptions);

        return {
            statusCode: 200,
            body: JSON.stringify('Password reset email sent.')
        };
    } catch (error) {
        console.error('Error during forgot-password:', error);
        return {
            statusCode: 500,
            body: JSON.stringify('An error occurred while processing your request.')
        };
    }
};
