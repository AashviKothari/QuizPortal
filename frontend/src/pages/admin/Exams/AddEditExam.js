import React,{useState,useEffect} from 'react';
import PageTitle from '../../../components/PageTitle';
import { Form, Row, Col, message, Tabs, Table } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { addExam, deleteQuestionFromExam, editExam, getExamById } from '../../../apicalls/exams';
import { useDispatch } from 'react-redux';
import { HideLoading, ShowLoading } from '../../../redux/loaderSlice';
import AddEditQuestion from './AddEditQuestion';

function AddEditExam() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {id} = useParams()
  const [examData,setExamData] = useState();
  const [showAddEditQuestionModal, setShowAddEditQuestionModal] = useState(false)
  const [selectedQuestion, setSelectedQuestion] = useState()
  const onFinish = async(values) => {
     try{
       dispatch(ShowLoading())
       let response;
       if(id){
         response = await editExam(values,id)
       }
       else{
         response = await addExam(values)
       }
       dispatch(HideLoading())
       if(response.success){
        message.success(response.message)
        navigate("/admin/exams")
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
  const getExamDataById = async(id) => {
      try{
         dispatch(ShowLoading())
         const response = await getExamById(id)
         dispatch(HideLoading())
         if(response.success){
            message.success(response.message)
            setExamData(response.data)
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
    if(id){
      getExamDataById(id)
    }
  },[])
  const deleteQuestionById = async(questionId) =>{
    try{
      const reqPayload = {
         questionId: questionId
      }
      dispatch(ShowLoading())
      const response = await deleteQuestionFromExam(id,reqPayload)
      dispatch(HideLoading())
      if(response.success){
         message.success(response.message)
         getExamDataById(id)
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
  const questionColumns = [
   {
      title: "Question",
      dataIndex: "name"
   },
   {
      title: "Options",
      dataIndex: "options",
      render: (text,record) => {
         return Object.keys(record.options).map((key)=>{
            return <div>{key} : {record.options[key]}</div>
         })
      }
   },
   {
      title: "Correct Option",
      dataIndex: "correctOption",
      render: (text,record) => {
         return `${record.correctOption}. ${record.options[record.correctOption]}`;
      }
   },
   {
      title: "Action",
      dataIndex: "action",
      render: (text,record) => {
         return (
            <div className='flex gap-2'>
              <i className='ri-pencil-line cursor-pointer'
               onClick={()=>{
                  setSelectedQuestion(record)
                  setShowAddEditQuestionModal(true)
               }}></i>
              <i className='ri-delete-bin-line cursor-pointer' onClick={()=>{deleteQuestionById(record._id)}}></i>
            </div>
         )
      }
   }
]
  return (
    <div>
        <PageTitle title={id?'Edit Exam':'Add Exam'}/>
        <div className='divider'></div>
        {(examData || !id) && <Form layout="vertical" onFinish={onFinish} initialValues={examData} className="mt-2">
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="Exam Details" key="1">
          <Row gutter={[10,10]}>
                <Col span={8}>
                   <Form.Item label="Exam Name" name="name">
                    <input type="text"/>
                   </Form.Item>
                </Col>
                <Col span={8}>
                   <Form.Item label="Exam Duration" name="duration">
                    <input type="number" min={0}/>
                   </Form.Item>
                </Col>
                <Col span={8}>
                   <Form.Item label="Category" name="category">
                    <select>
                    <option value="JavaScript">JavaScript</option>
                    <option value="Nodejs">Nodejs</option>
                    <option value="React">React</option>
                    <option value="MongoDb">MongoDb</option>
                    </select>
                   </Form.Item>
                </Col>
                <Col span={8}>
                   <Form.Item label="Total Marks" name="totalMarks">
                    <input type="number" min={0}/>
                   </Form.Item>
                </Col>
                <Col span={8}>
                   <Form.Item label="Passing Marks" name="passingMarks">
                    <input type="number" min={0}/>
                   </Form.Item>
                </Col>
            </Row>
            <div className='flex justify-end gap-2'>
             <button className='primary-outlined-btn w-15 cursor-pointer' type="submit">
                Save
             </button>
             <button className='primary-contained-btn w-15 cursor-pointer'
             onClick={()=>navigate('/admin/exams')}
             >
                Cancel
             </button>
            </div>
          </Tabs.TabPane>
          {id && <Tabs.TabPane tab="Questions" key="2">
              <div className='flex justify-end'> 
              <button className="primary-outlined-btn cursor-pointer"
              type="button"
              onClick={()=>{
               setShowAddEditQuestionModal(true)
              }}>Add Question</button>
              </div>
              <Table columns={questionColumns} dataSource={examData?.questions} className="mt-1">

              </Table>
          </Tabs.TabPane>}
        </Tabs>
        </Form>}
        {showAddEditQuestionModal&&<AddEditQuestion   setShowAddEditQuestionModal={setShowAddEditQuestionModal}
         showAddEditQuestionModal={showAddEditQuestionModal}
         examId = {id}
         refreshData = {getExamDataById}
         selectedQuestion={selectedQuestion}
         setSelectedQuestion={setSelectedQuestion}
        />}
    </div>
  )
}

export default AddEditExam