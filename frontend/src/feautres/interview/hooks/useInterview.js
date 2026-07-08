import {getAllinterviewReports,getInterviewReportById,generateInterviewReport} from "../services/interview.api"
import { useContext } from "react"
import { InterviewContext } from "../interview.context.jsx"
export const useInterview = ()=>{
 const context = useContext(InterviewContext)
 if(!context){
    throw new Error("useInterview must be within an interview provider")
 }

 const {loading,setloading,report,setreport,reports,setreports} = context
 
 const genearateReport = async({jobDescrption,selfDescription,resumeFile})=>{
    setloading(true)
    let response = null
    try{
       response = await generateInterviewReport({jobDescription:jobDescrption,selfDescription,resumeFile})
       setreport(response.interViewReport)
    }catch(e){
         console.log(e)
    }finally{
       setloading(false)
    }

    return response?.interViewReport

}

 const getReportById = async(interviewId)=>{
    setloading(true)
    let response = null
    try{
         const response = await getInterviewReportById(interviewId)
            setreport(response.interviewReport)
    }catch(e){
        console.log(e)
    }finally{
        setloading(false)
    }
    return response?.interviewReport

}
   const getAllReports = async()=>{
    setloading(true)
    let response = null
    try{
        response = await getAllinterviewReports()
        setreports(response.interviewReports)
    }
    catch(e){
        console.log(e)
    }
    finally{
        setloading(false)
    }
    return response?.interviewReports
}
 return { loading,report,reports,genearateReport,getReportById,getAllReports}
}