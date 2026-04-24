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
  const [requisitionStatusUpdateInformation, setRequisitionStatusUpdateInformation] = useState([])
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

        if (user?.level === "L1" && user.accessLevel === 1) {

          setLoginInformation([]);
          // const res = await axios.get(
          //   `${APP_BACKEND_URL}/Requisition/with-employee-by-irb/${user.empID}`
          // );

          // setRequisitionInformation(res.data);
          // addNotification(reverseTransform(res.data));
          setLoginInformation(user);
        }
        if (user?.level === "L1" && user.accessLevel === 2) {

          setLoginInformation([]);
          const res = await axios.get(
            `${APP_BACKEND_URL}/Requisition/with-employee-by-irb/${user.empID}`
          );

          setRequisitionInformation(res.data);
          addNotification(reverseTransform(res.data));
          setLoginInformation(user);
        }


        if (user?.level === "L1" && user.accessLevel === 3) {

          setLoginInformation([]);

          const [
            approvalResponse,
            approvalResponseForNextEmployeeStatus,
            requisitionResponse
          ] = await Promise.all([
            axios.get(`${APP_BACKEND_URL}/SubAdminAproval/ForNextEmployee/?empId=${user.empID}`),
            axios.get(`${APP_BACKEND_URL}/SubAdminAproval/ForNextEmployeeApprovedStatus?empId=${user.empID}`),
            axios.get(`${APP_BACKEND_URL}/Requisition/with-employee-by-irb/${user.empID}`)
          ]);

          const approvalData = approvalResponse.data || [];
          const approvedStatusData = approvalResponseForNextEmployeeStatus.data || [];

          
          const mergedData = [...approvalData, ...approvedStatusData];

          console.log(mergedData)
          setRequisitionStatusUpdateInformation(mergedData);
          setRequisitionInformation(requisitionResponse.data || []);
          setLoginInformation(user);
        }


        if (user?.level === "L1" && user.accessLevel === 4) {

          setLoginInformation([]);
          const res = await axios.get(
            `${APP_BACKEND_URL}/Requisition/with-employee-by-irb/${user.empID}`
          );

          setRequisitionInformation(res.data);
          addNotification(reverseTransform(res.data));
          setLoginInformation(user);
        }

        if (user?.level === "L2" && user.accessLevel === 5) {
          setLoginInformation([]);
          const res = await axios.get(
            `${APP_BACKEND_URL}/Requisition/with-employee-by-id/${user.empID}`
          );
          setRequisitionApproveStatus(res.data);
          setLoginInformation(user);
        }
        if (user?.level === "L3" && user.accessLevel === 6) {
          setLoginInformation([]);
          const res = await axios.get(
            `${APP_BACKEND_URL}/Requisition/with-employee-by-id/${user.empID}`
          );
          setLoginInformation(user);
          setRequisitionApproveStatus(res.data);
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
      requisitionInformation, setRequisitionInformation,
      requisitionApproveStatus,
      setRequisitionStatusUpdateInformation,
      requisitionStatusUpdateInformation
    }}>
      {children}
    </EmployeeLoginContext.Provider>
  )
}


const refreshRequisitionData = async () => {
  const [
    approvalResponse,
    approvalResponseForNextEmployeeStatus,
    requisitionResponse
  ] = await Promise.all([
    axios.get(`${APP_BACKEND_URL}/SubAdminAproval/ForNextEmployee/?empId=${loginInformation?.empID}`),
    axios.get(`${APP_BACKEND_URL}/SubAdminAproval/ForNextEmployeeApprovedStatus?empId=${loginInformation?.empID}`),
    axios.get(`${APP_BACKEND_URL}/Requisition/with-employee-by-irb/${loginInformation?.empID}`)
  ]);

  const mergedData = [
    ...(approvalResponse.data || []),
    ...(approvalResponseForNextEmployeeStatus.data || [])
  ];

  const normalizedData = mergedData.map(item => ({
    ...item,
    requisitionID: item.requisitionID || item.RequisitionID
  }));

  const uniqueLatestData = Object.values(
    normalizedData.reduce((acc, item) => {

      const key = item.requisitionID;
      const existing = acc[key];

      const itemTime = new Date(item.createdAt || 0).getTime();
      const existingTime = new Date(existing?.createdAt || 0).getTime();

      if (!existing || itemTime > existingTime) {
        acc[key] = item;
      }

      return acc;
    }, {})
  );

  setRequisitionStatusUpdateInformation(uniqueLatestData);
  setRequisitionInformation(requisitionResponse.data || []);
};

export { EmployeeLoginContextProvider }