const express = require('express');
const router = express.Router();
const assetController = require('../controllers/assetController');

router.get('/getAssets', assetController.getAssets);
router.put('/updateAsset/:id', assetController.updateAsset);
router.delete('/deleteAsset/:id', assetController.deleteAsset);
router.post('/createAsset', assetController.createAsset);

module.exports = router;