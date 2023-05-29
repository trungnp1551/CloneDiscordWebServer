const express = require('express')
const router = express.Router()

const imageController = require('../controllers/image')
const upload = require('../middleware/upload');

router
    .route('/:imageId')
    .get(imageController.getUrl)

router
    .route('/upImage')
    .post(upload.single("image"), imageController.upImage)

module.exports = router