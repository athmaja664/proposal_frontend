import './App.css'
import { Routes, Route } from "react-router-dom";
import { useState,useEffect } from 'react';
import Preloader from './components/Preloader';
import Dashboard from './pages/admin/Dashboard';
import Login from './pages/admin/Login';
import Proposals from './pages/admin/Proposals';
import CreateProposal from './pages/admin/CreateProposal';
import PasswordGate from './pages/client/PasswordGate';
import ProposalSuccess from './pages/client/ProposalSuccess';
import ProposalViewer from './pages/client/ProposalViewer';
import ProtectedRoute from './components/ProtectedRoute';
import PageNotFound from './pages/PageNotFound'
import AuditLogs from './pages/admin/AuditLogs';
import { Toaster } from 'react-hot-toast'
import ForgotPassword from './pages/admin/ForgotPassword';
import ResetPassword from './pages/admin/ResetPassword';
import AddClient from './pages/admin/AddClient';
import ViewProposalModal from './pages/admin/ViewProposalModal';

function App() {
 const [isLoading,setIsLoading]=useState(false)

  useEffect(()=>{
 setTimeout(()=>{
      setIsLoading(true)
 },3000)
  },[])

  return (
    <>
      <Toaster position="top-center" />
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path='proposals' element={<ProtectedRoute><Proposals /></ProtectedRoute>} />
        <Route path='viewproposals' element={<ProtectedRoute><ViewProposalModal /></ProtectedRoute>} />
         <Route path='clients' element={<ProtectedRoute><AddClient /></ProtectedRoute>} />
        <Route path='createproposal' element={<ProtectedRoute><CreateProposal /></ProtectedRoute>} />
        <Route path="/auditlogs" element={<ProtectedRoute><AuditLogs/></ProtectedRoute>}/>
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path='*' element={<PageNotFound/>}/>
         <Route path='/view/:token' element={isLoading?<PasswordGate />:<Preloader/>} />
        <Route path='success' element={<ProposalSuccess />} />
        <Route path='proposalview' element={<ProposalViewer />} />
      
      </Routes>
       
    </>
  )
}

export default App
