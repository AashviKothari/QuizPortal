const Exam = require("../models/examModel")
const User = require("../models/userModel")
const Question = require('../models/questionModel')

const addExam = async(req,res) => {
   try{
      const user = await User.findOne({
        _id: req.body.userid
      })
      if(user.isAdmin){
        //check if exam name already exists
        const examExists = await Exam.findOne({name: req.body.name})
        if(examExists){
            res.send({
                message: "Exam already exists",
                success: false
            })
        }
        else{
            req.body.questions = []
            const newExam = new Exam(req.body)
            await newExam.save()
            res.send({
             message: "Exam added successfully",
              success: true
            })
        }
      }
   }
   catch(error){
      res.send({
        message: error.message,
        data: error,
        success: false
      })
   }
}

const getAllExams = async(req,res) => {
  try{
     const exam = await Exam.find()
     if(exam){
      res.send({
        message: "Exams list fetched successfully.",
        data: exam,
        success: true
      })
     }
     else{
      res.send({
        message: "No exams to display.",
        data: exam,
        success: false
      })
     }
  }
  catch(error){
    res.send({
      message: error.message,
      data: error,
      success: false
    })
  }
}

const getExamById = async(req,res) => {
  try{
     const exam = await Exam.findById(req.params.id).populate('questions');
     if(exam){
      res.send({
        message: "Exam data fetched successfully.",
        data: exam,
        success: true
      })
     }
     else{
      res.send({
        message: "Exam doesnot exists.",
        data: exam,
        success: false
      })
     }
  }
  catch(error){
    res.send({
      message: error.message,
      data: error,
      success: false
    })
  }
}

// edit exam by id
const editExam = async(req,res) => {
  try{
     const user = await User.findOne({_id: req.body.userid})
     if(user.isAdmin){
      const exam = await Exam.findOne({_id: req.params.id})
      if(exam){
        exam.name = req.body.name;
        exam.duration = req.body.duration;
        exam.category = req.body.category;
        exam.totalMarks = req.body.totalMarks;
        exam.passingMarks = req.body.passingMarks;
        exam.save()
        res.send({
          message: "Exam details edited successfully.",
          data: exam,
          success: true
        })
      }
      else{
        res.send({
          message: "Exam doesn't exists.",
          data: null,
          success: false
        })
      }
     }
     else{
      res.send({
        message: "Cannot Update Exam Details.",
        data: null,
        success: false
      })
     }
  }
  catch(error){
    res.send({
      message: error.message,
      data: error,
      success: false
    })
  }
}

const deleteExam = async(req,res) => {
  try{
     const user = await User.findOne({_id: req.body.userid})
     if(user.isAdmin){
      const exam = await Exam.findOne({_id: req.params.id})
      if(exam){
        exam.delete()
        res.send({
          message: "Selected exam deleted successfully.",
          data: null,
          success: true
        })
      }
      else{
        res.send({
          message: "Exam doesn't exists.",
          data: null,
          success: false
        })
      }
     }
     else{
      res.send({
        message: "Cannot Delete Exam.",
        data: null,
        success: false
      })
     }
  }
  catch(error){
    res.send({
      message: error.message,
      data: error,
      success: false
    })
  }
}

const addQuestionToExam = async(req,res) => {
   try{
     const user = await User.findById(req.body.userid)
     if(user.isAdmin){
        // add question to Questions Collection
        const newQuestion = new Question(req.body)
        const question = await newQuestion.save()
        // add question to exam
        const exam = await Exam.findOne({_id: req.params.id})
        exam.questions.push(question._id);
        await exam.save();
        res.send({
          message: "Question added successfully.",
          data: null,
          success: true
        })
      }
      else{
        res.send({
          message: "Question cannot be added.",
          data: null,
          success: false
        })
      }
   }
   catch(error){
       console.log(error.message)
       res.send({
        message: error.message,
        data: error,
        success: false
       })
   }
}

const editQuestionInExam = async(req,res) => {
  try{ 
    const user = await User.findById(req.body.userid)
    if(user.isAdmin){
       await Question.findByIdAndUpdate(req.body.questionId, req.body);
       res.send({
        message: "Question edited successfully",
        success: true
       })
    }
    else{
      res.send({
        message: "Question cannot be edited.",
        success: false
      })
    }
  }
  catch(error){
    res.send({
      message: error.message,
      data: error,
      success: false
    })
  }
}

const deleteQuestionFromExam = async(req,res) => {
  try{ 
    const user = await User.findById(req.body.userid)
    if(user.isAdmin){
      // delete question from the questions collection 
      const question = await Question.findOne({ _id: req.body.questionId});
      await question.delete()
      // delete question in exam
      const exam = await Exam.findOne({_id: req.params.id})
      const questions = exam.questions
      exam.questions = questions.filter((question)=>{
        if(question._id!=req.body.questionId){
          return question._id!=req.body.questionId
        }
      })
      await exam.save()
       res.send({
        message: "Selected question deleted successfully",
        success: true
       })
    }
    else{
      res.send({
        message: "Question cannot be deleted.",
        success: false
      })
    }
  }
  catch(error){
    res.send({
      message: error.message,
      data: error,
      success: false
    })
  }
}

module.exports = {addExam, getAllExams, getExamById, editExam, deleteExam, addQuestionToExam, editQuestionInExam, deleteQuestionFromExam}
