const {Router} = require("express");
const authController = require("../controllers/auth.controller.js")
const authMiddleware = require("../middleware/auth.middleware.js")
const authRouter = Router()

/**
 * @route post /api/register
 * @description regiter a new user
 * @acess public
 */

authRouter.post("/register",authController.registerUserControler)

// post /api/auth/login login user with email and passsword

authRouter.post("/login",authController.loginUserController)

// get/api/auth/logout
authRouter.get("/logout",authController.logoutUSerController)

//api for /api/auth/get-me get the current logged in user detail

authRouter.get("/get-me",authMiddleware.authUser,authController.getMeController)
module.exports=authRouter
