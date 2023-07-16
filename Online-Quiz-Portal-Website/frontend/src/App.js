import logo from './logo.svg';
import './App.css';
import './stylesheets/alignments.css'
import './stylesheets/textelements.css'
import './stylesheets/theme.css'
import './stylesheets/custom-components.css'
import './stylesheets/form-elements.css'
import './stylesheets/layout.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/common/Login';
import RegisterPage from './pages/common/Register';
import HomePage from './pages/common/Home';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import ReportsPage from './pages/user/Reports';
import ProfilePage from './pages/user/Profile';
import ExamsPage from './pages/admin/Exams';
import AddEditExam from './pages/admin/Exams/AddEditExam';
import Loader from './components/Loader';
import { useSelector } from 'react-redux';
import WriteExam from './pages/user/WriteExam';
import AdminReportsPage from './pages/admin/Reports';

function App() {
  const {loading} = useSelector(state=>state.loaders)
  return (
    <>
      {loading&&<Loader/>}
      <Router>
      <Routes>
        <Route path="/login" element={<PublicRoute><LoginPage/></PublicRoute>}/>
        <Route path="/register" element={<PublicRoute><RegisterPage/></PublicRoute>}/>
        <Route path="/" element={<ProtectedRoute><HomePage/></ProtectedRoute>}/>
        <Route path="/admin/exams" element={<ProtectedRoute><ExamsPage/></ProtectedRoute>}/>
        <Route path="/admin/exams/add" element={<ProtectedRoute><AddEditExam/></ProtectedRoute>}/>
        <Route path="/admin/exams/edit/:id" element={<ProtectedRoute><AddEditExam/></ProtectedRoute>}/>
        <Route path="/user/reports" element={<ProtectedRoute><ReportsPage/></ProtectedRoute>}/>
        <Route path="/admin/reports" element={<ProtectedRoute><AdminReportsPage/></ProtectedRoute>}/>
        <Route path="/profile" element={<ProtectedRoute><ProfilePage/></ProtectedRoute>}/>
        <Route path="/user/write-exam/:id" element={<ProtectedRoute><WriteExam/></ProtectedRoute>}/>
      </Routes>
    </Router>
    </>
  );
}

export default App;
