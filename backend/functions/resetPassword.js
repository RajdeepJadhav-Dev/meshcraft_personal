const bcrypt = require('bcryptjs');
const UserSchema = require('../models/user');
const connectDB = require('../config/db');

exports.handler = async (event) => {
    await connectDB();
    try {
        const { userId, token, newPassword } = JSON.parse(event.body);

        if (!userId || !token || !newPassword) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "All fields are required" })
            };
        }

        const user = await UserSchema.findById(userId);

        if (!user) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: "User not found" })
            };
        }

        if (user.resetPasswordExpires < Date.now()) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Reset token has expired" })
            };
        }

        const validToken = await bcrypt.compare(token, user.resetPasswordToken);

        if (!validToken) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Invalid token" })
            };
        }

        const salt = await bcrypt.genSalt(5);
        const hashedNewPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedNewPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        
        await user.save();

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Password reset successfully" })
        };
    } catch (err) {
        console.error('Error during reset-password:', err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "An error occurred while resetting the password" })
        };
    }
};
