const bcrypt = require('bcrypt');
const UserSchema = require('../models/user');

exports.updateUsername = async (req, res) => {
    try {
        const { username, userId } = req.body;
        if (!username || !userId) {
            return res.status(400).json("Username and User ID are required");
        }
        const updatedUser = await UserSchema.findByIdAndUpdate(
            userId,
            { username },
            { new: true }
        );
        if (!updatedUser) {
            return res.status(404).json("User not found");
        }
        res.status(200).json({
            message: "Username updated successfully",
            user: updatedUser,
        });
    } catch (err) {
        res.status(500).json("Error updating username");
    }
};

exports.updatePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword, userId } = req.body;
        if (!oldPassword || !newPassword || !userId) {
            return res.status(400).json("All fields are required");
        }
        const user = await UserSchema.findById(userId);
        if (!user) {
            return res.status(404).json("User not found");
        }
        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedNewPassword;
        await user.save();
        res.status(200).json("Password updated successfully");
    } catch (err) {
        res.status(500).json("Error updating password");
    }
};

exports.updateProfilePicture = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json("User ID is required");
        }
        if (!req.file) {
            return res.status(400).json("Image file is required");
        }
        const base64Image = req.file.buffer.toString('base64');
        const updatedUser = await UserSchema.findByIdAndUpdate(
            userId,
            { profilePicture: `data:${req.file.mimetype};base64,${base64Image}` },
            { new: true }
        );
        if (!updatedUser) {
            return res.status(404).json("User not found");
        }
        res.status(200).json({
            message: "Profile picture updated successfully",
            user: updatedUser,
        });
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json("Error updating profile picture");
    }
};