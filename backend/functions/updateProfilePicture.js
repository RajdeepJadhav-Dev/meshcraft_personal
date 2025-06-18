const UserSchema = require("../models/user");
const connectDB = require("../config/db");

exports.handler = async (event) => {
    await connectDB();

    if (event.httpMethod !== "PUT") {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: "Method Not Allowed" }),
        };
    }

    try {
        const { userId, imageBase64, mimeType } = JSON.parse(event.body);

        if (!userId || !imageBase64 || !mimeType) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "User ID, image, and MIME type are required" }),
            };
        }

        const allowedMimeTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/gif"];
        if (!allowedMimeTypes.includes(mimeType)) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Unsupported image format" }),
            };
        }

        const base64Image = `data:${mimeType};base64,${imageBase64}`;

        const updatedUser = await UserSchema.findByIdAndUpdate(
            userId,
            { profilePicture: base64Image },
            { new: true }
        );

        if (!updatedUser) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: "User not found" }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Profile picture updated successfully",
                user: updatedUser,
            }),
        };
    } catch (err) {
        console.error("Error:", err);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Error updating profile picture" }),
        };
    }
};
