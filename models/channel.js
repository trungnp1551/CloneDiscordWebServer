const mongoose = require('mongoose')    
const message = require('./message')

const channelSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        require: true
    },
    type: {
        type: String,
        enum:['DM','GUILD_VOICE','GUILD_DM'],
    },  
    members:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    messages:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
    }]
}, {
    versionKey: false
})

module.exports = mongoose.model('Channel', channelSchema)