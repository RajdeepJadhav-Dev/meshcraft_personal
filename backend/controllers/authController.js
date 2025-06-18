const bcrypt = require('bcrypt');
const crypto = require('crypto');
const UserSchema = require('../models/user');
const { sendEmail } = require('../utils/email');

exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new UserSchema({
            username,
            email,
            password: hashedPassword,
            profilePicture: "",
        });
        const user = await newUser.save();
        res.status(200).json(user);
    } catch (err) {
        if (err.code === 11000) {
            const field = Object.keys(err.keyValue)[0];
            return res.status(400).json({ error: `${field} already exists` });
        }
        console.error("Error during registration:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await UserSchema.findOne({ username });
        if (!user) {
            return res.status(400).json("User not found");
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json("Wrong password");
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await UserSchema.findOne({ email });
        if (!user) {
            return res.status(404).send('User not found');
        }
        const resetToken = crypto.randomBytes(20).toString('hex');
        const hash = await bcrypt.hash(resetToken, 10);
        user.resetPasswordToken = hash;
        user.resetPasswordExpires = Date.now() + 3600000;
        await user.save();
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        const resetUrl = `${frontendUrl}/reset-password/${user._id}/${resetToken}`;
        const htmlContent = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2 style="color: #333;">Password Reset Request</h2>
                <p>Hi ${user.username || 'User'},</p>
                <p>You requested to reset your password. Click the link below to reset it:</p>
                <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; margin: 10px 0; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">Reset Password</a>
                <p>If you did not request a password reset, please ignore this email.</p>
            </div>
        `;
        await sendEmail(user.email, 'Password Reset', htmlContent);
        res.send('Password reset email sent.');
    } catch (error) {
        console.error('Error during forgot-password:', error);
        res.status(500).send('An error occurred while processing your request.');
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { userId, token, newPassword } = req.body;
        if (!userId || !token || !newPassword) {
            return res.status(400).json({ error: "All fields are required" });
        }
        const user = await UserSchema.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        if (user.resetPasswordExpires < Date.now()) {
            return res.status(400).json({ error: "Reset token has expired" });
        }
        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword) {
            return res.status(400).json({ error: "New password cannot be the same as the old password" });
        }
        const validToken = await bcrypt.compare(token, user.resetPasswordToken);
        if (!validToken) {
            return res.status(400).json({ error: "Invalid token" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedNewPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        res.status(200).json({ message: "Password reset successfully" });
    } catch (err) {
        console.error('Error during reset-password:', err);
        res.status(500).json({ error: "An error occurred while resetting the password" });
    }
};