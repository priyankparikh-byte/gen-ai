const express = require("express")
const authMiddleware = require("../middleware/auth.middleware.js")
const interviewController = require("../controllers/interview.controller.js")
const upload = require("../middleware/file.middleware.js")
const interviewRouter = express.Router()

interviewRouter.post("/",authMiddleware.authUser,upload.single("resume"),interviewController.generateInterViewController)


interviewRouter.get("/:interviewId",authMiddleware.authUser,interviewController.getInterviewByIdController)

interviewRouter.get("/",authMiddleware.authUser,interviewController.getAllInterviewsController)

interviewRouter.post("/resume/pdf/:interViewReportId",authMiddleware.authUser,interviewController.generateResumePdfController)

module.exports = interviewRouter