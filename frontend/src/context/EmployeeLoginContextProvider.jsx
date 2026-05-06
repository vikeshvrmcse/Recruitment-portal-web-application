import React, { useContext, useEffect, useState } from 'react'
import { EmployeeLoginContext, GetApprovalDataContext } from './TestContext'
import axios from 'axios'
import { useNotification } from './NotificationContextProvider';
import { reverseTransform } from '../utils/dataFormatter';
import { toast } from 'react-toastify';

const APP_BACKEND_URL = import.meta.env.VITE_DOTNET_BACKEND_URL;

function EmployeeLoginContextProvider({ children }) {
  const [loginInformation, setLoginInformation] = useState([])
  const [requisitionApproveStatus, setRequisitionApproveStatus] = useState([])
  const storedUser = localStorage.getItem("auth");
  const { addNotification } = useNotification();
  const { refetch, setRequisitionApprovalData } = useContext(GetApprovalDataContext)

  const user = localStorage.getItem("auth")
  const data = JSON.parse(user)

  useEffect(() => {

    const fetchData = async () => {
      const storedUser = localStorage.getItem("auth");

      if (!storedUser) {
        setLoginInformation([]);
        return;
      }

      const user = JSON.parse(storedUser);

      if (user?.level === "L1" && user.accessLevel === 1) {
        setLoginInformation([]);
        setRequisitionApprovalData([])
        setLoginInformation(user);
      }


      if (user?.level === "L1" && user.accessLevel === 2) {
        setLoginInformation([]);
        setRequisitionApprovalData([])
        setLoginInformation(user);
      }


      if (user?.level === "L1" && user.accessLevel === 3) {
        setLoginInformation([]);
        setRequisitionApprovalData([])
        setLoginInformation(user);
      }


      if (user?.level === "L1" && user.accessLevel === 4) {
        try {
          setLoginInformation([]);
          setRequisitionApprovalData([])
          setLoginInformation(user);
        } catch (error) {
          console.log(error.message);
          return
        }
      }



      if (user?.level === "L2" && user.accessLevel === 5) {
        setLoginInformation([]);
        setRequisitionApprovalData([])
        let res, requisitionTrackResponse;
        try {
          res = await axios.get(`${APP_BACKEND_URL}/Requisition/with-employee-by-id/${user?.empID}`);

        } catch (error) {
          console.log(error.message)
        }


        setRequisitionApproveStatus(res?.data);
        setLoginInformation(user);
      }

      if (user?.level === "L3" && user.accessLevel === 6) {
        setLoginInformation([]);
        setRequisitionApprovalData([])
        let res, requisitionTrackResponse;
        try {
          res = await axios.get(`${APP_BACKEND_URL}/Requisition/with-employee-by-id/${user?.empID}`);

        } catch (error) {
          console.log(error.message)
        }


        setRequisitionApproveStatus(res?.data);
        setLoginInformation(user);
      }
    }

    fetchData();

  }, [data?.empID]);



  return (
    <EmployeeLoginContext.Provider value={{
      loginInformation, setLoginInformation,
      requisitionApproveStatus, setRequisitionApproveStatus
    }}>
      {children}
    </EmployeeLoginContext.Provider>
  )
}




export { EmployeeLoginContextProvider }