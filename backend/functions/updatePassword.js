const bcrypt = require('bcryptjs');
const UserSchema = require('../models/user'); 
const connectDB = require('../config/db');


exports.handler = async (event) => {
    await connectDB();
    try {
        const { oldPassword, newPassword, userId } = JSON.parse(event.body);

        if (!oldPassword || !newPassword || !userId) {
            return {
                statusCode: 400,
                body: JSON.stringify("All fields are required")
            };
        }

        if(oldPassword === newPassword) {
            return {
                statusCode: 400,
                body: JSON.stringify("New password must be different from old password")
            };
        }

        const salt = await bcrypt.genSalt(5);
        const hashedNewPassword = await bcrypt.hash(newPassword, salt);
        const updatedUser= await UserSchema.findByIdAndUpdate(
            userId,
            { password: hashedNewPassword },
            { new: true }
        );
        if(!updatedUser) {
            return {
                statusCode: 404,
                body: JSON.stringify("User not found")

            };
        }


        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Password updated successfully",
                user: updatedUser
            }
            )


        };
    } catch (err) {
        console.error(err);
        return {
            statusCode: 500,
            body: JSON.stringify("Error updating password")
        };
    }
};
