import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../features/auth/authSlice'
import { useDispatch } from 'react-redux'
import { EmployeeLoginContext } from '../../context/TestContext'

function AdminDashboard() {
  const { loginInformation } = useContext(EmployeeLoginContext)
  const dispatch = useDispatch()

  return (
    <div>
      <h3 className='mx-auto w-48'>{loginInformation?.empName}</h3>
      <button className="w-48 mx-auto bg-slate-800 text-white py-2 my-6 rounded-lg hover:shadow-md hover:shadow-slate-800 hover:bg-white transition-all duration-300 text-2xl font-light hover:text-slate-800 flex items-center justify-center" onClick={() => { dispatch(logout()); }}>Logout</button>
    </div>
  )
}

export default AdminDashboard