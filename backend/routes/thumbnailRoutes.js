const express = require('express');
const router = express.Router();
const thumbnailController = require('../controllers/thumbnailController');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });


router.get('/', thumbnailController.getAllThumbnails);

router.get('/:id', thumbnailController.getThumbnailById);

router.get('/view/:id', thumbnailController.viewThumbnail);

router.post('/', upload.single('imageFile'), thumbnailController.createThumbnail);

router.put('/:id', upload.single('imageFile'), thumbnailController.updateThumbnail);

router.delete('/:id', thumbnailController.deleteThumbnail);


module.exports = router;