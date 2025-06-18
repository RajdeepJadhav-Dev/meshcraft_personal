const bcrypt = require('bcrypt');
const User = require('../models/admin');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'meshcraft123#';
const connectDB = require('../config/db');

exports.handler = async (event, context) => {
    await connectDB();
    try {
        const { name, email, password } = JSON.parse(event.body);

        if (!name || !email || !password) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "All fields are required" }),
            };
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "User already exists" }),
            };
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: "1h" });

        return {
            statusCode: 201,
            body: JSON.stringify({ message: "User registered successfully", token }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Server error", error: error.message }),
        };
    }
};