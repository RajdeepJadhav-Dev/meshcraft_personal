const connectDB = require('../config/db');
const UserSchema = require('../models/user');

exports.handler = async (event) => {
    await connectDB();

    try {
        const { username, userId } = JSON.parse(event.body);

        if (!username || !userId) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Username and User ID are required' }),
            };
        }

        const updatedUser = await UserSchema.findByIdAndUpdate(
            userId,
            { username },
            { new: true }
        );

        if (!updatedUser) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: 'User not found' }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Username updated successfully',
                user: updatedUser,
            }),
        };
    } catch (err) {
        console.error('Error updating username:', err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal server error' }),
        };
    }
};
