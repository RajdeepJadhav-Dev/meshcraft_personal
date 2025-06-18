const Asset = require('../models/Assets');
const connectDB = require('../config/db');

exports.handler = async (event, context) => {
    await connectDB();
    try {
        const assets = await Asset.find();
        return {
            statusCode: 200,
            body: JSON.stringify(assets),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Server error", error: error.message }),
        };
    }
};