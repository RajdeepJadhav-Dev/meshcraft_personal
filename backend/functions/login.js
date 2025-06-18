const connectDB = require('../config/db');
const UserSchema = require('../models/user');
const bcrypt = require('bcrypt');

exports.handler = async (event) => {
    await connectDB();

    try {
        const { username, password } = JSON.parse(event.body);
        const user = await UserSchema.findOne({ username });

        if (!user) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'User not found' }),
            };
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Wrong password' }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify(user),
        };
    } catch (err) {
        console.error('Login error:', err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal server error' }),
        };
    }
};
