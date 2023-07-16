import React from 'react'
import { useNavigate } from 'react-router-dom';

function Instructions(props) {
  const {examData,setExamData, view, setView, startTimer} = props
  const navigate = useNavigate();
  return (
    <div className='flex flex-col items-center mt-2 gap-5'>
        <h1 className='text-2xl underline text-center'>
            Instructions
        </h1>
        <ul className='flex flex-col gap-1'>
          <li>
            Exam must be completed in {examData.duration} minutes.
          </li>
          <li>
            Exam will be submitted automatically after {examData.duration} minutes.
          </li>
          <li>
            Once submitted, you cannot change your answer.
          </li>
          <li>
            Do not refresh the page and do not navigate to other pages like Home, Profile. If did so, you've to restart your exam.
          </li>
          <li>
            You can use the <span className='font-bold'>Previous</span> and <span className='font-bold'>
            Next
            </span> buttons to navigate between questions.
          </li>
          <li>
            Total marks of the exam is <span className='font-bold'>
                {examData.totalMarks}
            </span>
          </li>
          <li>
            Passing marks of the exam is <span className='font-bold'>
                {examData.passingMarks}
            </span>
          </li>
          
        </ul>
        <div className='flex gap-2'>
        <button className='primary-outlined-btn'
        onClick={()=>navigate(-1)}
        >
         Close
        </button>
        <button className='primary-contained-btn'
        onClick={()=>{
          startTimer();
          setView("questions")}}
        >Start Exam</button>
        </div>
    </div>
  )
}

export default Instructions