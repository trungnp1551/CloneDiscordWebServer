const Channel = require('../models/channel')

const imageService = require('../service/image')
const userService = require('../service/user')

exports.getOneById = async (req, res) => {
    const id = req.params.channelId
    try {
        const channel = await Channel.findById(id)
            .populate('messages')
            .populate('members', ['username', 'emotion', 'status', 'avatar', 'id_fake'])
        if (channel) {
            return res.status(200).json({
                success: true,
                message: 'get one channel by id',
                channel
            })
        }
        return res.status(201).json({
            success: false,
            message: 'get one channel by id',
        })
    } catch (error) {
        console.log("err get one channel by id")
    }
}
exports.getMembers = async (req, res) => {
    const id = req.params.channelId
    try {
        const channel = await Channel.findById(id).populate('members', ['username', 'emotion', 'status', 'avatar', 'id_fake'])
        if (channel) {
            var listMember = []
            
            for (let index = 0; index < channel.members.length; index++) {
                const element = channel.members[index]
                const avtUrl = await imageService.getUrl(element.avatar)
                listMember.push({
                    _id: element._id,
                    username: element.username,
                    emotion: element.emotion,
                    status: element.status,
                    avatarUrl: avtUrl,
                    id_fake: element.id_fake
                })
            }
            return res.status(200).json({
                success: true,
                message: 'get list member',
                listMember
            })
        }
        return res.status(201).json({
            success: false,
            message: 'get list member',
        })
    } catch (error) {
        console.log("err get list member")
    }
}

exports.getMessages = async (req, res) => {
    const id = req.params.channelId
    try {
        const channel = await Channel.findById(id).populate('messages')
        if (channel) {
            const listMessage = []

            for (let index = 0; index < channel.messages.length; index++) {
                const element = channel.messages[index]
                const avtAuthor = await userService.getAvatar(element.author)
                const author = await userService.getOne(element.author)
                listMessage.push({
                    _id: element._id,
                    authorId: author._id,
                    authorName: author.username,
                    authorFakeId: author.id_fake,
                    avatarUrlAuthor: avtAuthor.imageUrl,
                    timestamp: element.timestamp,
                    content: element.content,
                    isImage: element.isImage
                })
            }
            return res.status(200).json({
                success: true,
                message: 'get list message',
                listMessage
            })
        }
        return res.status(201).json({
            success: false,
            message: 'get list message',
        })
    } catch (error) {
        console.log("err get list message")
    }
}