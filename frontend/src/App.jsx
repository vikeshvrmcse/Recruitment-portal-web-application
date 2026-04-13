import React from 'react'
import './App.css'
import Navbar from './components/layout/Navbar'
import { Outlet } from "react-router-dom";
import Footer from './components/layout/Footer';
import { TestContextProvider } from './context/TestContextProvider';
import { NotificationProvider } from './context/NotificationContextProvider';
function App() {
  return (
    <div>
      <Navbar />
      <TestContextProvider>
        <NotificationProvider>
          <Outlet />
        </NotificationProvider>
      </TestContextProvider>
      <Footer />
    </div>

  )
}

export default App