const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.put('/updateUsername', userController.updateUsername);
router.put('/updatePassword', userController.updatePassword);
router.put('/updateProfilePicture', upload.single('profilePicture'), userController.updateProfilePicture);

module.exports = router;