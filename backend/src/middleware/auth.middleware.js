const jwt = require("jsonwebtoken")
const tokenBlackListModel = require("../models/blacklist.model.js")



 async function authUser(req,res,next){
    const token = req.cookies.token

    if(!token){
        return res.status(401).json({messgae:"token not provided"})

    }
    
    const istokenBlacklisted = await tokenBlackListModel.findOne({token})

    if(istokenBlacklisted){
        return res.status(401).json({
            message:"toekn is balcklisted please login again"
        })
    }

    try {
     const decoded = jwt.verify(token,process.env.JWT_SECRET)
     req.user = decoded
      next()

    }catch(e){
        return res.status(401).json({message:"invalid token"})
    }
}

module.exports = {authUser}