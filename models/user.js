const mongoose = require('mongoose')    

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    emotion: {
        type: String,
        default: '...'
    },
    status: {
        type: String,
        enum:['Online','Idle','Do not Disturb','Invisible'],
        default:'Online'
    },
    avatar: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image',
    },
    channels:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Channel',
    }],
    guilds:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Guild',
    }],
    phoneNumber: String,
    id_fake: String,
    friendIds: [],
    pendingFriends: [],
    token: String,
    resetTokenExpires: Date,
}, {
    versionKey: false
})

module.exports = mongoose.model('User', userSchema)