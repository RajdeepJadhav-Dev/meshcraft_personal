const Asset = require('../models/Assets');
const connectDB = require('../config/db');


exports.handler = async (event, context) => {
    await connectDB();
    try {

        const id = event.path.split("/").pop();

        const asset = await Asset.findByIdAndDelete(id);

        if (!asset) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: "Asset not found" }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Asset deleted successfully" }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Server error", error: error.message }),
        };
    }
};