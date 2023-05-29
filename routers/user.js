const express = require('express')
const router = express.Router()

const userController = require('../controllers/user')
const auth = require('../middleware/auth')
const upload = require('../middleware/upload');

router
    .route('/getAll')
    .get(userController.getAll)

router
    .route('/:id/getGuilds')
    .get(userController.getGuilds)

router
    .route('/:id/getChannelsDM')
    .get(userController.getChannelsDM)

router
    .route('/:id/getOneById')
    .get(userController.getOneById)

router
    .route('/')
    .get(auth, userController.getOnebyToken)
    .post(userController.register)
    .delete(userController.deleteAll)
    
router
    .route('/upAvatar')
    .post(auth, upload.single("avatar"), userController.upAvatar)

router
    .route('/login')
    .post(userController.logIn)

router
    .route('/friend')
    .get(auth, userController.getAllFriend)
    .post(auth, userController.addFriend)

router
    .route('/friend/getOnlFriend')
    .get(auth, userController.getOnlFriend)

router
    .route('/friend/getPendingFriend')
    .get(auth, userController.getPendingFriend)
 

module.exports = router