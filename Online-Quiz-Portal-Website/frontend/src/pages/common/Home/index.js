import { message, Row, Col } from 'antd'
import React,{useState,useEffect} from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getAllExams } from '../../../apicalls/exams'
import PageTitle from '../../../components/PageTitle'
import { HideLoading, ShowLoading } from '../../../redux/loaderSlice'

function HomePage() {
  const [exams, setExams] = useState([])
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(state=>state.users.user)
  const getExams = async() => {
    try{
       dispatch(ShowLoading())
       const response = await getAllExams()
       dispatch(HideLoading())
       if(response.success){
        message.success(response.message)
        setExams(response.data)
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
  useEffect(()=>{
    getExams()
  },[])
  return (
    user && <div>
      <PageTitle title={`Hi ${user.name}, Welcome to Quiz Portal`}/>
      <div className='divider'></div>
      <Row gutter={[16,16]} className="mt-2">
        {exams&&exams.map((exam,index)=>{
           return (
            <Col span={6} key={index}>
              <div className='card-lg flex flex-col gap-1 p-2'>
                <h1 className='text-2xl'>
                  {exam.name}
                </h1>
                <div className='divider'>
                </div>
                <h1 className='text-md'>
                  Category: {exam.category}
                </h1>
                <h1 className='text-md'>
                  Total Questions: {exam.questions.length}
                </h1>
                <h1 className='text-md'>
                  Total Marks: {exam.totalMarks}
                </h1>
                <h1 className='text-md'>
                  Passing Marks: {exam.passingMarks}
                </h1>
                <h1 className='text-md'>
                  Duration: {exam.duration}
                </h1>
                <button className='primary-outlined-btn cursor-pointer'
                onClick={()=>navigate(`/user/write-exam/${exam._id}`)}>
                  Start Exam
                </button>
              </div>
            </Col>
           )
        })}
      </Row>
    </div>
  )
}

export default HomePage