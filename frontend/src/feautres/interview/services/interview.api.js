import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  withCredentials: true,
  timeout: 180000,
})

export const generateInterviewReport = async ({ resumeFile, jobDescription, selfDescription }) => {
  const formData = new FormData()
  formData.append("jobDescription", jobDescription)
  formData.append("selfDescription", selfDescription)
  formData.append("resume", resumeFile)

  const response = await api.post("/api/interview/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })

  return response.data
}

export const generateResumePdf = async (interViewReportId) => {
  const response = await api.post(`/api/interview/resume/pdf/${interViewReportId}`, null, {
    responseType: "blob",
    timeout: 180000,
  })

  return response
}

export const getInterviewReportById = async (interviewId) => {
  const response = await api.get(`/api/interview/${interviewId}`)
  return response.data
}

export const getAllinterviewReports = async () => {
  const response = await api.get("/api/interview/")
  return response.data
}

