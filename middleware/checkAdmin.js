const Guild = require('../models/guild')

module.exports = async (req, res, next) => {
    const id = req.userId
    const idGuild = req.params.guildId
    try {
        const guild = await Guild.findById(idGuild)
        if (guild.author == id) {
            console.log("check admin")
            next()
        } else {
            console.log("check admin123")
            return res.status(201).json({
                success: false,
                message: "You are not the server owner"
            })
        }
    }
    catch (error) {
        console.log(error)
        return res.status(401).json({
            success: false,
            message: "Check admin error"
        })
    }
}