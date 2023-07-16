import React, {useState, useEffect} from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { getExamById } from '../../../apicalls/exams'
import { HideLoading, ShowLoading } from '../../../redux/loaderSlice'
import { message } from 'antd'
import Instructions from './Instructions'
import { addReport } from '../../../apicalls/reports'
import { useSelector } from 'react-redux'

function WriteExam() {
  const [examData, setExamData] = useState()
  const [questions, setQuestions] = useState([])
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0)
  const [selectedOptions, setSelectedOptions] = useState({})
  const [result, setResult] = useState()
  const {id} = useParams()
  const dispatch = useDispatch()
  const [view, setView] = useState("instructions")
  const [secondsLeft,setSecondsLeft] = useState(0)
  const [timeUp, setTimeUp] = useState(false)
  const [intervalId, setIntervalId] = useState(null);
  const {user} = useSelector(state=>state.users)
  const navigate = useNavigate();
  const getExamDataById = async(id) => {
    try{
       dispatch(ShowLoading())
       const response = await getExamById(id)
       dispatch(HideLoading())
       if(response.success){
          message.success(response.message)
          setExamData(response.data)
          setQuestions(response.data.questions)
          setSecondsLeft(response.data.duration)
       }
       else{
          message.error(response.message)
       }
    }
    catch(error){
       dispatch(HideLoading())
       message.error(error.message)
    }
}
const calculateResult = async() => {
    try{
    let correctAnswers = [];
    let wrongAnswers = [];

    questions.forEach((question,index)=>{
      if(question.correctOption===selectedOptions[index]){
        correctAnswers.push(question);
      }
      else{
        wrongAnswers.push(question);
      }
    })
    let verdict = "Pass";
    if(correctAnswers.length<examData.passingMarks){
      verdict = "Fail";
    }
    const tempResult = {
      correctAnswers,
      wrongAnswers,
      verdict,
    }
    setResult(tempResult)
    dispatch(ShowLoading())
    const response = await addReport({
      exam: id,
      result: tempResult,
      user: user._id 
    })
    dispatch(HideLoading())
    if(response.success){
      setView("result"); 
    }
    else{
      message.error(response.message)
    }
  }
  catch(error){
    dispatch(HideLoading())
    message.error(error.message)
  }
}
const startTimer = () => {
   let totalSeconds = examData.duration;
   const intervalId = setInterval(()=>{
      if(totalSeconds>0){
        totalSeconds=totalSeconds-1;
        setSecondsLeft(totalSeconds)
      }
      else{
        setTimeUp(true);
      }
   }, 1000);
   setIntervalId(intervalId)
}
useEffect(()=>{
  if(timeUp&&view==="questions"){
    clearInterval(intervalId)
    calculateResult(); 
  }
},[timeUp])
useEffect(()=>{
  if(id){
    getExamDataById(id)
  }
},[])
  return (
   examData && (
    <div className='mt-2'>
    <div className='divider'></div>
    <h1 className='text-center'>{examData.name}</h1>
    <div className='divider'></div>
    {view==="instructions"&&<Instructions examData={examData} setExamData={setExamData}
    view={view}
    setView={setView}
    startTimer={startTimer}
    />}
    {(view==="questions"&&questions!==[])&&<div className='flex flex-col gap-2 mt-2'>
     <div className='flex justify-between'>
     <h1 className='text-2xl'>
       {selectedQuestionIndex+1} : {questions[selectedQuestionIndex].name}
     </h1>
     <div className='timer'>
      <span className='text-2xl'>{secondsLeft}</span>
     </div>
     </div>
     <div className='flex flex-col gap-2'>
      {Object.keys(questions[selectedQuestionIndex].options).map((option, index)=>{
        return <div className={`flex gap-2 items-center ${selectedOptions[selectedQuestionIndex] === option ? "selected-option" : "option" }`}
        key={index}
        onClick={()=>{
          setSelectedOptions({...selectedOptions,[selectedQuestionIndex]: option})
          console.log(selectedOptions)
        }}
        >
            <h1 className='text-xl'>
              {option} : {questions[selectedQuestionIndex].options[option]}
            </h1>
        </div>
      })}
     </div>
     <div className='flex justify-between'>
     {selectedQuestionIndex>0&&<button className='primary-outlined-btn'
      onClick={()=>{
          setSelectedQuestionIndex(selectedQuestionIndex-1)
      }}
      >
       Previous
      </button>}
      {selectedQuestionIndex<questions.length-1&&<button className='primary-contained-btn'
      onClick={()=>{
          setSelectedQuestionIndex(selectedQuestionIndex+1)
      }}
      >
       Next
      </button>}
      {selectedQuestionIndex===questions.length-1&&<button className='primary-contained-btn'
      onClick={()=>{
        clearInterval(intervalId)
          setTimeUp(true)
      }}
      >
       Submit
      </button>}
     </div>
    </div>}
    {view==="result"&&<div className='flex justify-center mt-2 gap-2'>
      <div className='flex flex-col gap-2 result'>
      <h1 className='text-2xl'>
        Result
      </h1>
      <div className='marks'>
        <h1 className='text-md'>
           Total Marks : {examData.totalMarks}
        </h1>
        <h1 className='text-md'>
           Passing Marks : {examData.passingMarks}
        </h1>
        <h1 className='text-md'>
            Obtained Marks : {result.correctAnswers.length}
        </h1>
        <h1 className='text-md'>
            Wrong Answers : {result.wrongAnswers.length}
        </h1>
        <h1 className='text-md'>
            Verdict : {result.verdict}
        </h1>
        <div className='flex gap-2 mt-2'>
          <button className='primary-outlined-btn'
          onClick={()=>{
            setView("instructions")
            setSelectedQuestionIndex(0);
            setSelectedOptions({});
            setTimeUp(false);
            setSecondsLeft(examData.duration)
          }}
          >
          Retake Exam
          </button>
          <button className='primary-contained-btn' onClick={()=>{
            setView("review");
          }}>
            Review Answers
          </button>
        </div>
      </div>
      </div>
      <div className="lottie-animation">
      {result.verdict==="Pass" && <lottie-player src="https://assets5.lottiefiles.com/packages/lf20_uu0x8lqv.json"  background="transparent"  speed="1" loop autoplay></lottie-player>}
      {result.verdict==="Fail"&&<lottie-player src="https://assets4.lottiefiles.com/packages/lf20_qp1spzqv.json"  background="transparent" speed="1" loop autoplay></lottie-player>}
      </div>
    </div>}
    {view==="review"&&<div className='flex flex-col gap-2'> 
       {questions.map((question,index)=>{
          const isCorrect = question.correctOption === selectedOptions[index]
          return <div className={`flex flex-col gap-1 p-2 card ${isCorrect? "bg-success" : "bg-warning"}`}>
            <h1 className='text-xl'>{index+1} : {question.name}</h1>
            <h1 className='text-md'>Submitted Answer : {selectedOptions[index]} : {question.options[selectedOptions[index]]}</h1>
            <h1 className='text-md'>Correct Answer : {question.correctOption} : {question.options[question.correctOption]}</h1>
          </div>
       })}
       <div className='flex justify-center gap-2'>
       <button className='primary-outlined-btn'
          onClick={()=>{
            setView("instructions")
            setSelectedQuestionIndex(0);
            setSelectedOptions({});
            setTimeUp(false);
            setSecondsLeft(examData.duration);
          }}
          >
          Retake Exam
          </button>
          <button className='primary-contained-btn' onClick={()=>{
            navigate("/")
          }}>
            Close
          </button>
       </div>
    </div>}
    </div>
   )
  )
}

export default WriteExam