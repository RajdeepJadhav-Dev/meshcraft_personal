const axios = require('axios');
const UserSchema = require('../models/user');

exports.discordAuth = (req, res) => {
    const userId = req.query.userId;
    const discordAuthURL = `https://discord.com/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(
        process.env.DISCORD_REDIRECT_URI
    )}&response_type=code&scope=identify&state=${userId}`;
    res.redirect(discordAuthURL);
};

exports.discordCallback = async (req, res) => {
    const { code, state } = req.query;
    if (!code) {
        return res.status(400).send("No code provided");
    }
    try {
        const tokenResponse = await axios.post(
            "https://discord.com/api/oauth2/token",
            new URLSearchParams({
                client_id: process.env.DISCORD_CLIENT_ID,
                client_secret: process.env.DISCORD_CLIENT_SECRET,
                grant_type: "authorization_code",
                code,
                redirect_uri: process.env.DISCORD_REDIRECT_URI,
            }),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );
        const { access_token } = tokenResponse.data;
        const userResponse = await axios.get("https://discord.com/api/users/@me", {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
        const discordUser = userResponse.data;
        const avatarUrl = `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`;
        const userId = state;
        const user = await UserSchema.findByIdAndUpdate(
            userId,
            {
                discordId: discordUser.id,
                discordUsername: `${discordUser.username}`,
                discordAvatar: avatarUrl,
            },
            { new: true }
        );
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.redirect(
            `${process.env.FRONTEND_URL || 'http://localhost:3000'}/profile?userId=${userId}&discordId=${discordUser.id}&discordUsername=${encodeURIComponent(discordUser.username)}&discordAvatar=${encodeURIComponent(avatarUrl)}&discordConnected=true`
        );
    } catch (error) {
        console.error("Error connecting Discord:", error);
        res.status(500).send("Failed to connect Discord");
    }
};