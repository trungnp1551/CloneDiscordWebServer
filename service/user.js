const mongoose = require('mongoose')

const User = require('../models/user')

exports.getOne = async (id) =>{
    try {
        const user = await User.findById(id)
        if(user){
            return user
        }
    } catch (error) {
        console.log('err get one user')
    }
}

exports.getAvatar = async (id) => {
    try {
        const user = await User.findById(id).populate('avatar')
        if(user){
            const avt = user.avatar
            return avt
        }
        return null
    } catch (error) {
        console.log('err get avatar')
    }
}

exports.setStatus = async (id, status) => {
    try {
        const user = await User.findById(id)
        if(user){
            user.status = status
            await user.save()
        }
    } catch (error) {
        console.log('err set status')
    }
}