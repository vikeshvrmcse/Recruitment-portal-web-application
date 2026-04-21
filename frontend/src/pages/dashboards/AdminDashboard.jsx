import React from 'react'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../features/auth/authSlice'
import { useDispatch } from 'react-redux'

function AdminDashboard() {
  const navigate=useNavigate()
  const dispatch=useDispatch()
  
  return (
    <button onClick={()=>{dispatch(logout()); navigate("/")}}>Level 3 Dashboard</button>
  )
}

export default AdminDashboard