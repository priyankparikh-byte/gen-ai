const userModel = require("../models/user.model.js")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
const tokenBlackListModel = require("../models/blacklist.model.js");


async function registerUserControler(req,res) {
    const {username ,email, password} = req.body;

    if(!username||!email||!password){
        return res.status(400).json({message:"pls provide details"}) 
    }

    const isUSerExists = await userModel.findOne({
        $or:[{username},{email}]
    })

    if(isUSerExists){
        return res.status(400).json({
            message:"Account already exist with this email or username"
        })
    }

    const hash = await bcrypt.hash(password,10)

    const newUser = await userModel.create({
        username,
        email,
        password:hash
    })

    const token = jwt.sign(
        {id : newUser._id, username:newUser.username},
        process.env.JWT_SECRET,
        {expiresIn:"1d"}
    )

    res.cookie("token", token, {
        httpOnly: false,
        sameSite: "lax",
        path: "/",
        maxAge: 24 * 60 * 60 * 1000
    })

    res.status(201).json({message:"user registered succesfully",
        user:{
            id:newUser._id,
            username:newUser.username,
            email:newUser.email
        }
    })
}

async function loginUserController(req,res) {
    const { email,password} = req.body

    if(!email || !password){
        return res.status(400).json({message:"pls provide email and password"})
    }

    const user = await userModel.findOne({email})

    if(!user){
        return res.status(401).json({
            message:"invalid email or password"
        })
    }
    
    const isPasswordValid = await bcrypt.compare(password,user.password)
    
    if(!isPasswordValid){
        return res.status(401).json({message:"invalid email or password"})
    }
    

    const token = jwt.sign(
        {id : user._id,username:user.username},
        process.env.JWT_SECRET,
        {expiresIn:"1d"}
    )

    res.cookie("token", token, {
        httpOnly: false,
        sameSite: "lax",
        path: "/",
        maxAge: 24 * 60 * 60 * 1000
    })

    res.status(200).json({
        message:"user logged in succesfully",
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })
}

async function logoutUSerController(req,res) {
    const token = req.cookies.token

    if(token){
        await tokenBlackListModel.create({token})


    }

    res.clearCookie("token", {
        httpOnly: false,
        sameSite: "lax",
        path: "/"
    })

    res.status(200).json({
        message:"user logged out succesfully"
    })
}

async function getMeController(req,res) {
    const user = await userModel.findById(req.user.id)

    res.status(200).json({
        message:"user details fetched succesfully",
         user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })
    
}

module.exports={registerUserControler,loginUserController,logoutUSerController,getMeController}