const mongoose = require('mongoose')

const imageSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    imageId: String,
    imageUrl: String,
}, {
    versionKey: false
})

module.exports = mongoose.model('Image', imageSchema)