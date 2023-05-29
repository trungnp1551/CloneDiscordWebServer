const mongoose = require('mongoose')    

const messageSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    timestamp: Date,
    content: {
        type: String,
    },
    isImage: {
        type: Boolean,
        default: false
    }
}, {
    versionKey: false
})

module.exports = mongoose.model('Message', messageSchema)