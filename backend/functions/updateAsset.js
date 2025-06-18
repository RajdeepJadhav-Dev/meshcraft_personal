const Asset = require('../models/Assets');
const connectDB = require('../config/db');

exports.handler = async (event, context) => {
    await connectDB();
    try {
        const id = event.path.split("/").pop();
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

        const asset = await Asset.findByIdAndUpdate(
            id,
            {
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
            },
            { new: true, runValidators: true }
        );

        if (!asset) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: "Asset not found" }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Asset updated successfully", asset }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Server error", error: error.message }),
        };
    }
};