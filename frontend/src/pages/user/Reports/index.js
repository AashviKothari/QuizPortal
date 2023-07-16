import React,{useState,useEffect} from 'react'
import PageTitle from '../../../components/PageTitle'
import {Table, message} from 'antd'
import { HideLoading, ShowLoading } from '../../../redux/loaderSlice'
import { useDispatch } from 'react-redux'
import { getAllAttemptsByUser } from '../../../apicalls/reports'

function ReportsPage() {
  const [reportsData, setReportsData] = useState([])
  const dispatch = useDispatch()
  const columns = [
    {
       title: "Exam Name",
       dataIndex: "examName",
       render: (text,record) => 
        <>{record.exam.name}</>
    },
    {
       title: "Date",
       dataIndex: "date",
       render: (text,record) => 
        <>{record.createdAt}</>
       
    },
    {
      title: "Total Marks",
      dataIndex: "totalMarks",
      render: (text,record) => 
        <>{record.exam.totalMarks}</>
       
    },
    {
      title: "Passing Marks",
      dataIndex: "passingMarks",
      render: (text,record) => 
        <>{record.exam.passingMarks}</>
       
    },
    {
      title: "Obtained Marks",
      dataIndex: "obtainedMarks",
      render: (text,record) => 
        <>{record.result.correctAnswers.length}</>
       
    },
    {
      title: "Verdict",
      dataIndex: "verdict",
      render: (text,record) => 
        <>{record.result.verdict}</>
    }
  ]
  const getData = async() => {
     try{
       dispatch(ShowLoading())
       const response = await getAllAttemptsByUser()
       dispatch(HideLoading())
       if(response.success){
        setReportsData(response.data)
        message.success(response.message)
        console.log(reportsData)
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
   getData()
  },[])
  return (
    <div>
      <PageTitle title="Reports"/>
      <div className='divider'></div>
      <Table columns={columns} className="mt-2" dataSource={reportsData}/>
    </div>
  )
}

export default ReportsPage