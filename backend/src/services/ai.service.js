const { GoogleGenAI } = require("@google/genai");
const z = require("zod");
const puppeteer = require("puppeteer");
const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})

const interviewReportschema = z.object({
    matchScore: z.number().min(0).max(100).describe("match score between the candidate and the job"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("technical question can be asked in the interview"),
        intention: z.string().describe("intetion of the interviewer behing asking this question"),
        answer: z.string().describe("How to answer this question , what points to cover,what approach to take etc.")
    })).describe("technical questions that can be asked in the interview"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("behavioral question can be asked in the interview"),
        intention: z.string().describe("intetion of the interviewer behing asking this question"),
        answer: z.string().describe("How to answer this question , what points to cover,what approach to take etc.")
    })).describe("behavioral questions that can be asked in the interview"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("skill that is missing"),
        severity: z.enum(["low", "medium", "high"]).describe("severity of the skill gap")
    })).describe("skill gaps that need to be addressed"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("day number of the preparation plan"),
        focus: z.string().describe("focus of the day"),
        tasks: z.array(z.string()).describe("tasks to be completed on this day")
    })).describe("preparation plan for the interview"),
    title: z.string().describe("title of the interview report")
   
})

async function generateInterviewReport({ resume, jobDescription, selfDescription }) {
     
    const prompt = `Generate an interview report for the candidate based on the following information:
         Resume: ${resume}
         Job Description: ${jobDescription}
         Self Description: ${selfDescription}`
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: interviewReportschema.toJSONSchema()
        }
    })

    return JSON.parse(response.text)
}

async function generatePdfOfHtml(htmlContent) {

    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.setContent(htmlContent,{waitUntil:"networkidle0"})

    const pdfBuffer = await page.pdf({format:"A4"})

    await browser.close()

    return pdfBuffer
}


async function generaetResumePdf({resume,selfDescription,jobDescription}){
    const resumePdfSchema = z.object({
        html:z.string().describe("html content of the resume which can be convereted to pdf using library like puppeter")
    })

    const prompt=`Genrate  resume  for a candidate with the following details:
    resume :${resume}
    selfdescription:${selfDescription}
    job description:${jobDescription}
    
    the response should be in JSON object with a single field "html"which contains HTMl content of the resume which can be convereted to pdf using library like pupeteer`

     const response = await ai.models.generateContent({
        model:"gemini-2.5-flash",
        contents:prompt,
        config:{
            responseMimeType:"application/json",
            responseSchema: resumePdfSchema.toJSONSchema()
        
        }
     })

     const jsonContent = JSON.parse (response.text)

     const pdfBuffer = await generatePdfOfHtml(jsonContent.html)

     return pdfBuffer
}

module.exports = {generateInterviewReport,generaetResumePdf};