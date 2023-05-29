const express = require('express')
const router = express.Router()

const channelController = require('../controllers/channel')

router
    .route('/:channelId')
    .get(channelController.getOneById)

router
    .route('/:channelId/getMembers')
    .get(channelController.getMembers)

router
    .route('/:channelId/getMessages')
    .get(channelController.getMessages)

module.exports = router
