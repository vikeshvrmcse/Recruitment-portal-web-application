import React, { useEffect, useState } from 'react'
import { EmployeeLoginContext } from './TestContext'
import axios from 'axios'
import { useNotification } from './NotificationContextProvider';
import { reverseTransform } from '../utils/dataFormatter';
// import { fetchRequisitionsByEmpID } from '../utils/fetchApprovedData';

const APP_BACKEND_URL = import.meta.env.VITE_DOTNET_BACKEND_URL;

function EmployeeLoginContextProvider({ children }) {
  const [loginInformation, setLoginInformation] = useState([])
  const [requisitionInformation, setRequisitionInformation] = useState([])
  const [requisitionApproveStatus, setRequisitionApproveStatus] = useState([])
  const storedUser = localStorage.getItem("auth");
  const { addNotification } = useNotification();
  useEffect(() => {
    const fetchData = async () => {
      const storedUser = localStorage.getItem("auth");

      if (!storedUser) {
        setLoginInformation([]);
        setRequisitionInformation([]);
        setRequisitionApproveStatus([]);
        return;
      }

      const user = JSON.parse(storedUser);

      //MPORTANT: RESET OLD DATA FIRST
      setRequisitionInformation([]);
      setRequisitionApproveStatus([]);
      

      try {
        if (user?.level === "L1") {
          setLoginInformation([]);
          const res = await axios.get(
            `${APP_BACKEND_URL}/Requisition/with-employee-by-irb/${user.empID}`
          );

          setRequisitionInformation(res.data);
          addNotification(reverseTransform(res.data));
          setLoginInformation(user);
        }

        if (user?.level === "L2") {
          setLoginInformation([]);
          const res = await axios.get(
            `${APP_BACKEND_URL}/Requisition/with-employee-by-id/${user.empID}`
          );

          setRequisitionApproveStatus(res.data);
          setLoginInformation(user);
        }

      } catch (error) {
        console.error("API Error:", error);
      }
    };

    fetchData();
  }, [localStorage.getItem("auth")]);



  return (
    <EmployeeLoginContext.Provider value={{
      loginInformation, setLoginInformation,
      requisitionInformation, setRequisitionInformation, requisitionApproveStatus
    }}>
      {children}
    </EmployeeLoginContext.Provider>
  )
}

export { EmployeeLoginContextProvider }