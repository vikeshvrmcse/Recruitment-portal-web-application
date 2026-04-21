import React, { useEffect, useState } from 'react'
import { EmployeeLoginContext } from './TestContext'
import axios from 'axios'
import { useNotification } from './NotificationContextProvider';
import { reverseTransform } from '../utils/dataFormatter';
import { toast } from 'react-toastify';
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
        if (user?.level === "L1" && user.accessLevel === 2) {

          setLoginInformation([]);
          const res = await axios.get(
            `${APP_BACKEND_URL}/Requisition/with-employee-by-irb/${user.empID}`
          );

          

          setRequisitionInformation(res.data);
          addNotification(reverseTransform(res.data));
          setLoginInformation(user);
        }

        if (user?.level === "L2" && user.accessLevel === 3) {
          setLoginInformation([]);
          const res = await axios.get(
            `${APP_BACKEND_URL}/Requisition/with-employee-by-id/${user.empID}`
          );
          setRequisitionApproveStatus(res.data);
          setLoginInformation(user);
        }
        if (user?.level === "L3" && user.accessLevel === 4) {
          setLoginInformation([]);
          const res = await axios.get(
            `${APP_BACKEND_URL}/Requisition/with-employee-by-id/${user.empID}`
          );
          setLoginInformation(user);
          setRequisitionApproveStatus(res.data);
        }
        if (user?.level === "L4" && user.accessLevel === 5) {
          setLoginInformation([]);
          const res = await axios.get(
            `${APP_BACKEND_URL}/Requisition/with-employee-by-id/${user.empID}`
          );
          setRequisitionApproveStatus(res.data);
          setLoginInformation(user);
        }


      } catch (error) {
        if (error.response && error.response.status === 404) {
          toast.error("No user data found");
        } else {
          // Real error (server down, network issue, etc.)
          // console.error("API Error:", error);
          toast.error("Something went wrong");
        }
        // console.error("API Error:", error);
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