const express = require('express');
const router = express.Router();
const multer = require('multer');
const threeController = require('../controllers/threeController');

// Multer setup: store file in memory as a Buffer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Routes
router.get('/test-upload-form', threeController.getTestUploadForm);
router.post('/', upload.single('modelFile'), threeController.uploadModel);
router.get('/', threeController.getAllModels);
router.get('/download/:id', threeController.downloadModel);
router.get('/view/:id', threeController.viewModel);
router.get('/viewer/:id', threeController.getModelViewer);

module.exports = router;