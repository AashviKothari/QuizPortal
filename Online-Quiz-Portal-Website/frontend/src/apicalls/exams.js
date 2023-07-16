import axiosInstance from ".";

export const addExam = async(payload) => {
    try{
       const response = await axiosInstance.post('/api/exams/addExam',payload)
       return response.data
    }
    catch(error){
        return error.response.data
    }
}

export const getAllExams = async() => {
    try{
       const response = await axiosInstance.get('/api/exams/getAllExams')
       return response.data
    }
    catch(error){
        return error.response.data
    }
}

export const getExamById = async(id) => {
    try{
       const response = await axiosInstance.get(`/api/exams/getExamById/${id}`)
       return response.data
    }
    catch(error){
        return error.response.data
    }
}

export const editExam = async(payload,id) => {
    try{
      const response = await axiosInstance.put(`/api/exams//editExam/${id}`,payload)
      return response.data
    }
    catch(error){
        return error.response.data
    }
}

export const deleteExam = async(id) => {
    try{
      const response = await axiosInstance.delete(`/api/exams/deleteExam/${id}`)
      return response.data
    }
    catch(error){
        return error.response.data
    }
}

export const addQuestionToExam = async(payload,id) => {
    try{
        const response = await axiosInstance.post(`/api/exams/addQuestionToExam/${id}`,payload)
        return response.data
    }
    catch(error){
        return error.response.data
    }
}

export const editQuestionInExam = async(payload,id) => {
    try{
        const response = await axiosInstance.put(`/api/exams/editQuestionInExam/${id}`,payload)
        return response.data
    }
    catch(error){
        return error.response.data
    }
}

export const deleteQuestionFromExam = async(id,payload) => {
    try{
        const response = await axiosInstance.delete(`/api/exams/deleteQuestionFromExam/${id}`,payload)
        return response.data
    }
    catch(error){
        return error.response.data
    }
}