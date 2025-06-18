const Asset = require('../models/Assets');
const connectDB = require('../config/db');

exports.handler = async (event, context) => {
    await connectDB();
    try {
        const {
            title,
            description,
            extendedDescription,
            poly,
            price,
            modelUrl,
            walkModelUrls,
            software,
            softwareLogo,
            scale,
            rotation,
            technical,
        } = JSON.parse(event.body);

        if (!title || !description || !technical) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Title, description, and technical details are required" }),
            };
        }

        const newAsset = new Asset({
            title,
            description,
            extendedDescription,
            poly,
            price,
            modelUrl,
            walkModelUrls,
            software,
            softwareLogo,
            scale,
            rotation,
            technical,
        });

        await newAsset.save();

        return {
            statusCode: 201,
            body: JSON.stringify({ message: "3D asset created successfully", asset: newAsset }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Server error", error: error.message }),
        };
    }
};