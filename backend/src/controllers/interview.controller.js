const pdfParse = require("pdf-parse")
const {generateInterviewReport,generaetResumePdf} = require("../services/ai.service.js")
const interviewReportModel = require("../models/interviewReport.model.js")
const { GenerateContentResponseUsageMetadata } = require("@google/genai")
async function generateInterViewController(req,res) {
    const resumeFile = req.file

    const resumeContent =  await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
    const { jobDescription, selfDescription} = req.body

    const interViewReportByAi = await generateInterviewReport({
        resume:resumeContent.text,
        selfDescription,
        jobDescription

    })

    const interViewReport = await interviewReportModel.create({
        user : req.user.id,
        resume : resumeContent.text,
        selfDescription,
        jobDescription,
        ...interViewReportByAi
    })

    res.status(201).json({
        message:"Interview report generated succesfully",
        interViewReport
    })
}

async function getInterviewByIdController(req,res) {

    const {interviewId} = req.params

    const interviewReport = await interviewReportModel.findOne({_id:interviewId, user:req.user.id})

    if(!interviewReport) {
        return res.status(404).json({
            message:"Interview report not found"
        })
    }

    res.status(200).json({
        message:"Interview report fetched succesfully",
        interviewReport
    })
    
}

async function getAllInterviewsController(req,res){
  const interviewReports = await interviewReportModel.find({user:req.user.id}).sort({createdAt:-1}).select("-resume -selfDescription -jobDescription -__v -techincalQuestions -behvairolQuestions -skillGaps -preprationPlan")
  res.status(200).json({
    message:"Interview reports fetched succesfully",
    interviewReports
  })
}

async function generateResumePdfController(req,res) {
    const {interViewReportId} = req.params

    const interViewReport = await interviewReportModel.findById(interViewReportId)

    if(!interViewReport){
        return res.status(404).json({
            message:"Interview report not found"
        })
    }

    const {resume,jobDescription,selfDescription} = interViewReport
  
    const pdfBuffer = await generaetResumePdf({resume ,jobDescription,selfDescription})

    res.set({
        "Content-Type":"application/pdf",
        "Content-Disposition":`attachment; filename=resume.pdf`,
        "Content-Length":pdfBuffer.length
    })

    res.send(pdfBuffer)

}



module.exports={generateInterViewController,getInterviewByIdController,getAllInterviewsController, generateResumePdfController}