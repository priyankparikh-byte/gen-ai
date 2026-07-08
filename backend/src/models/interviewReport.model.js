const mongoose = require("mongoose");


//job desc storing resume text and self description

// tehcinla que behvioral que and skill gpas and preparation plans

const technicalQuestionSchema = new mongoose.Schema({
    question:{
        type:String,
        required:[true,"techincal que required"]
    },
    intention:{
        type:String,
        required:[true,"intetion required"]
    },
    answer:{
        type:String,
        required:[true,"answer is required"]
    },
},{
    _id:false
})

const behaviroalSchema = new mongoose.Schema({
    question:{
        type:String,
        required:[true,"techincal que required"]
    },
    intention:{
        type:String,
        required:[true,"intetion required"]
    },
    answer:{
        type:String,
        required:[true,"answer is required"]
    },
},{
    _id:false
})

const skillGapSchema = new mongoose.Schema({
    skill:{
        type:String,
        required:[true,"skill is required"]
    },
    severity:{
        type:String,
        enum:["low","medium","high"],
        required:[true,"severity is required"]
    }
},{
    _id:false
})

 const preprationPlanschema = new mongoose.Schema({
    day:{
        type:Number,
        required:[true,"day is required"]
    },
    focus:{
      type:String,
      required:[true,"focus is required"]  
    },
    tasks:[{
      type :String,
      required:[true,"task is required"]
    }]
 })

const interviewReportSchema = new  mongoose.Schema({
    jobDescription:{
        type:String,
        required:[true,"job description required"]
    },
    resume:{
        type:String
    },
    selfDescription:{
        type:String
    },
    matchScore:{
        type:Number,
        min:0,
        max:100
    },
    technicalQuestions:[technicalQuestionSchema],
    behvairolQuestions:[behaviroalSchema],
    skillGaps:[skillGapSchema],
    preprationPlan:[preprationPlanschema],
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    title:{
        type:String,
        required:[true,"title is required"]
    }



},{
    timestamps:true
})


const interviewReportModel = new mongoose.model("interviewReport",interviewReportSchema);

module.exports=interviewReportModel;