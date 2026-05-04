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
import GetAllEmployeeContextProvider from './context/GetAllEmployeeContextProvider';
import GetAllRequisitionContextProvider from './context/GetAllRequisitionContextProvider';
import GetApprovalDataContextProvider from './context/GetApprovalDataContextProvider';
function App() {
  return (
    <div>
      <Navbar />
      <TestContextProvider>
        <NotificationProvider>
          <EmployeeLoginContextProvider>
          <UpdateRequisitionContextProvider>
            <GetAllEmployeeContextProvider>
              <GetAllRequisitionContextProvider>
                <GetApprovalDataContextProvider>

                <ToastContainer />
                <Outlet />
                </GetApprovalDataContextProvider>
              </GetAllRequisitionContextProvider>
            </GetAllEmployeeContextProvider>
          </UpdateRequisitionContextProvider>
          </EmployeeLoginContextProvider>
        </NotificationProvider>
      </TestContextProvider>
      <Footer />
    </div>

  )
}

export default App


// --select rvm.RequisitionID, em.EmpName as CreatorName, es.EmpName as ApprovedBy, er.EmpName as ApprovedBy, ed.EmpName from EmployeeDetails AS ed join RequisitionVerifierModels as rvm on ed.EmpID=rvm.EmpID join Requisitions as r on r.Id=rvm.RequisitionID join EmployeeDetails as em on em.EmpID=r.EmpID join EmployeeDetails as e on e.EmpID=r.EmpID join EmployeeDetails as es on es.EmpID=e.IRB join EmployeeDetails as er on er.EmpID=es.IRB where ed.EmpID='PMA0002';

// --main admin approval
// --select * from EmployeeDetails AS ed join RequisitionVerifierModels as rvm on ed.EmpID=rvm.EmpID join Requisitions as r on r.Id=rvm.RequisitionID join EmployeeDetails as em on em.EmpID=r.EmpID join EmployeeDetails as e on e.EmpID=r.EmpID join EmployeeDetails as es on es.EmpID=e.IRB join EmployeeDetails as er on er.EmpID=es.IRB where ed.EmpID='PMA0002'  ;


// --upper admin approval
// --select * from EmployeeDetails AS ed join RequisitionVerifierModels as rvm on ed.EmpID=rvm.EmpID join Requisitions as r on r.Id=rvm.RequisitionID join EmployeeDetails as em on em.EmpID=r.EmpID join EmployeeDetails as e on e.EmpID=r.EmpID join EmployeeDetails as es on es.EmpID=e.IRB  where ed.EmpID='PMA0643'  ;

// --personal assitant and upper admin
// --select * from EmployeeDetails AS ed join RequisitionVerifierModels as rvm on ed.EmpID=rvm.EmpID join Requisitions as r on r.Id=rvm.RequisitionID join EmployeeDetails as em on em.EmpID=r.EmpID join EmployeeDetails as e on e.EmpID=r.EmpID join EmployeeDetails as es on es.EmpID=e.IRB  where ed.EmpID='PMA0643'  ;


// -- RIGHT QUERY FOR UPPER ADMIN
// --select * from RequisitionVerifierModels as rvm join Requisitions as r on rvm.RequisitionID=r.Id join EmployeeDetails as ed on ed.EmpID=r.EmpID where rvm.EmpID='PMA0643';


// --select rvm.EmpID, ed.EmpName, ed.IRB  from RequisitionVerifierModels as rvm join Requisitions as r on rvm.RequisitionID=r.Id join EmployeeDetails as ed on ed.EmpID=r.EmpID  where rvm.EmpID='PMA0643';

// --For Munjal and Arpana, And Harish Sir
// --select ed.EmpName, ef.EmpName, en.EmpName from RequisitionVerifierModels as rv join Requisitions as r on r.Id=rv.RequisitionID join EmployeeDetails as ed on ed.EmpID=r.EmpID join EmployeeDetails as ef on ed.IRB=ef.EmpID join EmployeeDetails as en on en.EmpID=rv.EmpID where rv.EmpID='PMA0643';