const bcrypt = require('bcrypt');
const User = require('../models/admin');
const jwt = require('jsonwebtoken');
const connectDB = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'meshcraft123#';

exports.handler = async (event, context) => {
    await connectDB();
    try {
        const { email, password } = JSON.parse(event.body);

        if (!email || !password) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Email and password are required" }),
            };
        }

        const user = await User.findOne({ email });
        if (!user) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Invalid credentials" }),
            };
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Invalid credentials" }),
            };
        }

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Login successful", token }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Server error", error: error.message }),
        };
    }
};