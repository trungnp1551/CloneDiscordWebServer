const imageService = require('../service/image');

exports.getUrl = async (req, res)=>{
    const id = req.params.imageId
    try {
        const imageUrl = await imageService.getUrl(id)
        if(imageUrl){
            return res.status(200).json({
                success: true,
                message: 'get image url by id',
                imageUrl
            })
        }
        return res.status(201).json({
            success: false,
            message: 'get image url by id',
        })
    } catch (error) {
        console.log('err get image url by id')
    }
}

exports.upImage = async (req,res) => {
    try {
        if(req.file == undefined){
            return res.status(201).json({
                success: false,
                message: "send image",
            })
        }
        const image = await imageService.upload(req.file.path)
        return res.status(200).json({
            success: true,
            message: "send image",
            image
        }) 
    } catch (error) {
        console.log('err get image url by id')
    }
    
}