const Users = require('../models/user');
const connectDB = require('../config/db');


exports.handler = async (event, context) => {
    await connectDB();
    try {
        const users = await Users.find({});
        return {
            statusCode: 200,
            body: JSON.stringify(users),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Server error", error: error.message }),
        };
    }
}
