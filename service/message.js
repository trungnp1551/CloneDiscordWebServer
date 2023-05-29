const mongoose = require('mongoose')

const Channel = require('../models/channel')
const Message = require('../models/message')

exports.addMessage = async (author, timestamp, content, isImage, channel_id) => {

    try {
        const newMessage = new Message({
            _id: new mongoose.Types.ObjectId(),
            author,
            timestamp,
            content,
            isImage
        })
        await newMessage.save()

        const channel = await Channel.findById(channel_id)
        await channel.messages.push(newMessage)
        await channel.save()
        
        return newMessage
    } catch (error) {
        console.log('err create message')
    }
}

