const connectDB = require('../config/db');
const UserSchema = require('../models/user');
const bcrypt = require('bcrypt');

exports.handler = async (event) => {
    await connectDB();

    try {
        const { username, email, password } = JSON.parse(event.body);
        const salt = await bcrypt.genSalt(5);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new UserSchema({
            username,
            email,
            password: hashedPassword,
            profilePicture: "",
        });

        const user = await newUser.save();
        return {
            statusCode: 200,
            body: JSON.stringify(user),
        };
    } catch (err) {
        if (err.code === 11000) {
            const field = Object.keys(err.keyValue)[0];
            return {
                statusCode: 400,
                body: JSON.stringify({ error: `${field} already exists` }),
            };
        }
        console.error('Error during registration:', err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal server error' }),
        };
    }
};
