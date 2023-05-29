const mongoose = require('mongoose')

const Guild = require('../models/guild')
const User = require('../models/user')
const imageService = require('../service/image');
const channelService = require('../service/channel')

exports.getOneById = async (req, res) => {
    const id = req.params.guildId
    try {
        const guild = await Guild.findById(id)
            .populate('avatar','imageUrl')
            .populate('members',['username','emotion','status','avatar','id_fake'])
            .populate('channels',['name','type'])
        if (guild) {
            return res.status(200).json({
                success: true,
                message: 'get one guild by id',
                guild
            })
        }
        return res.status(201).json({
            success: false,
            message: 'get one guild by id',
        })
    } catch (error) {
        console.log("err get one guild by id")
    }
}

exports.getChannels = async (req,res)=>{
    const id = req.params.guildId
    try {
        const guild = await Guild.findById(id).populate('channels',['name','type'])
        const listChannel = guild.channels
        if (guild) {
            return res.status(200).json({
                success: true,
                message: 'get list channel',
                listChannel
            })
        }
        return res.status(201).json({
            success: false,
            message: 'get list channel',
        })
    } catch (error) {
        console.log("err get list channel")
    }
}

exports.getMembers = async (req,res) => {
    const id = req.params.guildId
    try {
        const guild = await Guild.findById(id).populate('members',['username','emotion','status','avatar','id_fake'])
        if (guild) {
            var listMember = []
            
            for (let index = 0; index < guild.members.length; index++) {
                const element = guild.members[index]
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


exports.createGuild = async (req, res) => {
    const id = req.userId
    const { serverName } = req.body
    //create 2 channel default 'GUILD_VOICE' and 'GROUP_DM' push to 'channels'
    try {
        const user = await User.findById(id)
        const nGuild = new Guild({
            _id: new mongoose.Types.ObjectId(),
            name: serverName,
            author: user._id,
        })
        await nGuild.channels.push(await channelService.createChannelDefault(user._id, 'GUILD_DM'))
        await nGuild.channels.push(await channelService.createChannelDefault(user._id, 'GUILD_VOICE'))
        if (req.file != undefined) {
            const image = await imageService.upload(req.file.path)
            nGuild.avatar = image
        } else {
            nGuild.avatar = await imageService.getAvtGuildDefault()
        }
        await nGuild.members.push(user._id)
        await nGuild.save()
        await user.guilds.push(nGuild._id)
        await user.save()
        const avtUrl = await imageService.getUrl(nGuild.avatar)
        const newGuild = {
            _id: nGuild._id,
            name: nGuild.name,
            author: nGuild.author,
            members: nGuild.members,
            channels: nGuild.channels,
            avatarUrl: avtUrl,
        }
        return res.status(200).json({
            success: true,
            message: 'create guild',
            newGuild
        })

    } catch (error) {
        return res.status(201).json({
            success: false,
            message: 'create guild err',
        })
    }
}

exports.renameGuild = async (req, res) => {
    const { newServerName } = req.body
    const idGuild = req.params.guildId
    try {
        const guild = await Guild.findById(idGuild)
        guild.name = newServerName
        guild.save()
        res.status(200).json({
            success: true,
            message: 'rename guild',
            guild
        })
    } catch (error) {
        console.log('err rename guild')
    }
}
exports.createChannel = async (req, res) => {
    const { nameChannel, type } = req.body
    const idGuild = req.params.guildId
    try {
        const guild = await Guild.findById(idGuild)
        const channel = await channelService.createChannel(nameChannel, guild.members, type)
        guild.channels.push(channel._id)
        guild.save()
        const newChannel = {
            _id: channel._id,
            name: channel.name,
            type: channel.type
        }
        return res.status(200).json({
            success: true,
            message: 'Create channel',
            newChannel
        })
    } catch (error) {
        console.log('err create channel')
    }
}

exports.deleteGuild = async (req, res) =>{
    const id = req.userId
    const idGuild = req.params.guildId
    try {
        const guild = await Guild.findById(idGuild)


        res.status(200).json({
            success: true,
            message: 'Delete guild',
            guild
        })

    } catch (error) {
        console.log('err delete guild')
    }
}

exports.addMember = async (req, res) => {
    const idGuild = req.params.guildId
    const {id_fake} = req.body
    try {
        const guild = await Guild.findById(idGuild)
        const member = await User.findOne({id_fake:id_fake})
        if (guild.members.includes(member._id)) {
            return res.status(201).json({
                success: false,
                message: 'member already exists',
            })
        }
        await member.guilds.push(guild._id)
        await guild.members.push(member._id)

        guild.channels.forEach(async channel => {
            await channelService.addMember(member._id, channel._id)
        });

        member.save()
        guild.save()
        return res.status(200).json({
            success: true,
            message: 'add member',
            member,
            guild
        })
    } catch (error) {
        console.log('err add member')
    }
}
