const express = require('express');
const router = express.Router();
const discordController = require('../controllers/discordController');

router.get("/auth-discord", discordController.discordAuth);
router.get("/auth-discord/callback", discordController.discordCallback);

module.exports = router;