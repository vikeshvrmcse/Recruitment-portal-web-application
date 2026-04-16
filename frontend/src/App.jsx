import React from 'react'
import './App.css'
import Navbar from './components/layout/Navbar'
import { Outlet } from "react-router-dom";
import Footer from './components/layout/Footer';
import { TestContextProvider } from './context/TestContextProvider';
import { NotificationProvider } from './context/NotificationContextProvider';
import { UpdateRequisitionContextProvider } from './context/UpdateRequisitionContextProvider';
import { ToastContainer } from 'react-toastify';
import { EmployeeLoginContextProvider } from './context/EmployeeLoginContextProvider';
function App() {
  return (
    <div>
      <Navbar />
      <TestContextProvider>
        <NotificationProvider>
          <EmployeeLoginContextProvider>
          <UpdateRequisitionContextProvider>
             <ToastContainer />
            <Outlet />
          </UpdateRequisitionContextProvider>
          </EmployeeLoginContextProvider>
        </NotificationProvider>
      </TestContextProvider>
      <Footer />
    </div>

  )
}

export default App