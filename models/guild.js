const mongoose = require('mongoose')    

const guildSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        require: true
    },
    avatar: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image'
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    members:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    channels:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Channel',
    }]
}, {
    versionKey: false
})

module.exports = mongoose.model('Guild', guildSchema)