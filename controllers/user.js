const mongoose = require('mongoose')
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')

const User = require('../models/user')

const userService = require('../service/user')
const imageService = require('../service/image');
const channelService = require('../service/channel')

exports.getAll = async (req, res) => {
    const data = await User.find().populate('avatar').populate('guilds');

    res.status(200).json({
        message: 'get all',
        data
    })
}

exports.getGuilds = async (req, res) => {
    const id = req.params.id
    try {
        const user = await User.findById(id).populate('guilds')

        if (user) {
            var listGuild = []

            for (let index = 0; index < user.guilds.length; index++) {
                const element = user.guilds[index]
                const avtUrl = await imageService.getUrl(element.avatar)
                listGuild.push({
                    _id: element._id,
                    name: element.name,
                    author: element.author,
                    members: element.members,
                    channels: element.channels,
                    avatarUrl: avtUrl,
                })
            }
            return res.status(200).json({
                success: true,
                message: 'get list guild',
                listGuild
            })
        }
        return res.status(201).json({
            success: false,
            message: 'get list guild',
        })


    } catch (error) {
        console.log(error)
    }
}

exports.getChannelsDM = async (req,res) => {
    const id = req.params.id
    try {
        const user = await User.findById(id).populate('channels')
        if (user) {
            var listChannel = []

            for (let index = 0; index < user.channels.length; index++) {
                const element = user.channels[index]
                var avt
                if(element.members[0].toString() == id){
                    avt = await userService.getAvatar(element.members[1].toString())
                }else{
                    avt = await userService.getAvatar(element.members[0].toString())
                }

                listChannel.push({
                    _id: element._id,
                    name: element.name,
                    members: element.members,
                    messages: element.messages,
                    avatarUrl: avt.imageUrl,
                })
            }
            return res.status(200).json({
                success: true,
                message: 'get list channels DM',
                listChannel
            })
        }
        return res.status(201).json({
            success: false,
            message: 'get list channels DM',
        })
    } catch (error) {
        console.log(error)
    }
}

exports.deleteAll = async () => {
    try {
        await User.find().remove()
        console.log('delete user')
    } catch (error) {
        console.log('err')
    }
}

exports.register = async (req, res) => {
    const { email, password, username } = req.body

    const user = await User.findOne({ email: email })

    if (!email || !password)
        return res.status(201).json({
            success: false,
            message: 'Missing email and/or password'
        })

    if (user)
        return res.status(201).json({
            success: false,
            message: 'register fail, user exists'
        })

    const hashedPassword = await argon2.hash(password)

    const avtDefault = await imageService.getAvtUserDefault()

    ///fake id
    const fake_id = Math.floor(Math.random() * (9999 - 1000)) + 1000;

    const newUser = new User({
        _id: new mongoose.Types.ObjectId(),
        email: email,
        username: username,
        password: hashedPassword,
        id_fake: fake_id,
        role: 'user',
        avatar: avtDefault._id
    })
    await newUser.save()
    return res.status(200).json({
        success: true,
        message: 'register',
        newUser
    })
}

exports.logIn = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password)
        return res.status(201).json({
            success: false,
            message: 'Missing email and/or password'
        })

    const user = await User.findOne({ email: email }).populate('avatar').populate('guilds').populate('channels')

    if (!user) {
        console.log('type: Not exists user')
        return res.status(201).json({
            success: false,
            message: 'Not exists user'
        })
    }

    const passwordValid = await argon2.verify(user.password, password)

    if (!passwordValid)
        return res.status(201).json({
            success: false,
            message: 'Incorrect phoneNumber or password'
        })

    const token = jwt.sign({ userId: user._id }, process.env.JWT_KEY, { expiresIn: '30d' })

    user.token = token
    await user.save()

    return res.status(200).json({
        success: true,
        message: 'Login',
        user
    })
}

exports.getOnebyToken = async (req, res) => {
    const id = req.userId;
    try {
        const user = await User.findById(id).populate('avatar').populate('guilds').populate('channels')
        if (user) {
            return res.status(200).json({
                success: true,
                message: 'get user by token',
                user
            })
        }
        return res.status(201).json({
            success: false,
            message: 'get user by token',
            user
        })
    } catch (error) {
        console.log('err get user')
    }
}

exports.getOneById = async (req, res) => {
    const id = req.params.id
    try {
        const user = await User.findById(id).populate('avatar').populate('guilds').populate('channels')
        if (user) {
            return res.status(200).json({
                success: true,
                message: 'Get one by id',
                user
            })
        }
        return res.status(201).json({
            success: false,
            message: 'Get one by id',
        })

    } catch (error) {
        console.log('err get one by id')
    }
}

exports.getAllFriend = async (req, res) => {
    const id = req.userId
    try {
        const user = await User.findById(id)
        let listFriendData = [];
        for (var index = 0; index < user.friendIds.length; index++) {
            const friend = await User.findById(user.friendIds[index]).populate('avatar')
            if (friend) {
                listFriendData.push({
                    _id: friend._id.toString(),
                    username: friend.username,
                    id_fake: friend.id_fake,
                    avatarUrl: friend.avatar.imageUrl,
                    emotion: friend.emotion,
                    status: friend.status
                })
            }
        }
        return res.status(200).json({
            success: true,
            message: 'Get list friend',
            listFriendData
        })
    } catch (error) {
        console.log('get list friend ' + error)
        return res.status(201).json({
            success: false,
            message: 'Get list friend'
        })
    }
}

exports.getOnlFriend = async (req, res) => {
    const id = req.userId
    try {
        const user = await User.findById(id)
        let listFriendData = [];

        for (var index = 0; index < user.friendIds.length; index++) {
            const friend = await User.findById(user.friendIds[index]).populate('avatar')
            if (friend && friend.status == "Online") {
                listFriendData.push({
                    _id: friend._id.toString(),
                    username: friend.username,
                    id_fake: friend.id_fake,
                    avatarUrl: friend.avatar.imageUrl,
                    emotion: friend.emotion,
                    status: friend.status
                })
            }
        }
        return res.status(200).json({
            success: true,
            message: 'Get list online friend',
            listFriendData
        })

    } catch (error) {
        console.log('get list online friend ' + error)
        return res.status(201).json({
            success: false,
            message: 'Get list online friend'
        })
    }
}

exports.getPendingFriend = async (req, res) => {
    const id = req.userId
    try {
        const user = await User.findById(id)
        let listPendingFriendData = [];
        for (var index = 0; index < user.pendingFriends.length; index++) {
            const friend = await User.findById(user.pendingFriends[index]).populate('avatar')
            if (friend) {
                listPendingFriendData.push({
                    _id: friend._id.toString(),
                    username: friend.username,
                    id_fake: friend.id_fake,
                    avatarUrl: friend.avatar.imageUrl,
                    emotion: friend.emotion,
                    status: friend.status
                })
            }
        }
        return res.status(200).json({
            success: true,
            message: 'Get list pending friend',
            listPendingFriendData
        })

    } catch (error) {
        console.log('get list online friend ' + error)
        return res.status(201).json({
            success: false,
            message: 'Get list online friend'
        })
    }
}


exports.addFriend = async (req, res) => {
    const userId = req.userId
    const { id_fake } = req.body

    try {
        const user = await User.findById(userId)
        const friend = await User.findOne({id_fake: id_fake})
        const friendId = friend._id.toString()

        if (user.friendIds.includes(friendId)) {
            return res.status(201).json({
                success: false,
                message: 'Add friend'
            });
        }

        if (user.pendingFriends.includes(friendId)) {  //check friendId is in user' listPendingFriend
            //addfriend
            user.pendingFriends.remove(friendId)
            user.friendIds.push(friendId)
            friend.friendIds.push(userId)

            const newChannel = await channelService.createChannel('Username', [user, friend], 'DM')
            user.channels.push(newChannel)
            friend.channels.push(newChannel)

            await user.save()
            await friend.save()
            return res.status(200).json({
                success: true,
                message: 'Add friend'
            });
        } else {
            console.log('send a friend request')
            //send a friend request
            if (!friend.pendingFriends.includes(userId)) {
                friend.pendingFriends.push(userId)
                await friend.save()
                return res.status(200).json({
                    success: true,
                    message: 'Send a friend request'
                });
            } else {
                return res.status(201).json({
                    success: false,
                    message: 'Send a friend request'
                });
            }

        }
    } catch (error) {
        console.log(error)
        return res.status(201).json({
            success: false,
            message: 'add friend err'
        });
    }
}


exports.changePassword = async (req, res) => {
    const id = req.userId
    const { password, newPassword } = req.body

    const user = await User.findById(id)

    const passwordValid = await argon2.verify(user.password, password)

    if (!passwordValid)
        return res.status(201).json({
            success: false,
            message: 'Incorrect old password'
        })

    const hashedNewPassword = await argon2.hash(newPassword)
    user.password = hashedNewPassword
    await user.save()

    return res.status(200).json({
        success: true,
        message: 'Change password'
    })
}

exports.upAvatar = async (req, res) => {
    const id = req.userId;
    try {
        const user = await User.findById(id).populate('avatar')
        if (req.file == undefined) {
            return res.status(201).json({
                success: false,
                message: "Up avatar default",
                avatar: user.avatar
            })
        }
        if (user.avatar != undefined && user.avatar.imageId != '001') {
            await imageService.destroyImage(user.avatar)
        }
        const image = await imageService.upload(req.file.path)
        user.avatar = image
        await user.save()
        res.status(200).json({
            success: true,
            message: "Up avatar successful",
            avatar: user.avatar
        })
    } catch (error) {
        console.log(error)
    }
}