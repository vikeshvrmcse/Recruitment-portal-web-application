import React, { useEffect, useState } from 'react'
import { EmployeeLoginContext } from './TestContext'
import axios from 'axios'
import { useNotification } from './NotificationContextProvider';
import { reverseTransform } from '../utils/dataFormatter';
import { toast } from 'react-toastify';

const APP_BACKEND_URL = import.meta.env.VITE_DOTNET_BACKEND_URL;

function EmployeeLoginContextProvider({ children }) {
  const [loginInformation, setLoginInformation] = useState([])
  const [requisitionInformation, setRequisitionInformation] = useState([])
  const [requisitionStatusUpdateInformation, setRequisitionStatusUpdateInformation] = useState([])
  const [requisitionApproveStatus, setRequisitionApproveStatus] = useState([])
  const [storeRequistionTrack, setStoreRequisitionTrack] = useState([])
  const storedUser = localStorage.getItem("auth");
  const { addNotification } = useNotification();


  useEffect(() => {


    const mergeApprovedData = (approvalData, approvedStatusData) => {
      const merged = [...approvalData, ...approvedStatusData];
      const grouped = merged.reduce((acc, item) => {
        if (!acc[item.requisitionID]) {
          acc[item.requisitionID] = [];
        }
        acc[item.requisitionID].push(item);
        return acc;
      }, {});

      const result = Object.values(grouped).flatMap(group => {
        const approvedItem = group.find(
          item => item.currentStatus?.toLowerCase() === "approved" || item.currentStatus?.toLowerCase() === "rejected"
        );

        if (approvedItem) {
          return [approvedItem];
        }
        return group;
      });

      return result;
    };



    const fetchData = async () => {
      const storedUser = localStorage.getItem("auth");

      if (!storedUser) {
        setLoginInformation([]);
        setRequisitionInformation([]);
        setRequisitionApproveStatus([]);
        return;
      }

      const user = JSON.parse(storedUser);
      setRequisitionInformation([]);
      setRequisitionApproveStatus([]);




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
        // debugger
        let approvalResponse, approvalResponseForNextEmployeeStatus;

        try {
          approvalResponse = await axios.get(`${APP_BACKEND_URL}/SubAdminAproval/ForNextEmployee/?empId=${user.empID}`)
        } catch (error) {
          console.log(error.message)
        }


        try {
          approvalResponseForNextEmployeeStatus = await axios.get(`${APP_BACKEND_URL}/SubAdminAproval/ForNextEmployeeApprovedStatus?empId=${user.empID}`)
        } catch (error) {
          console.log(error.message)
        }


        try {
          const requisitionResponse = await axios.get(`${APP_BACKEND_URL}/Requisition/with-employee-by-irb/${user.empID}`)
          setRequisitionInformation(requisitionResponse?.data || []);
        } catch (error) {
          if (error.response.status === 404) {
            console.log(error.response.status)
          }
        }

        const approvalData = approvalResponse?.data || [];
        const approvedStatusData = approvalResponseForNextEmployeeStatus?.data || [];
        const mergedData = mergeApprovedData(approvalData, approvedStatusData);
        setRequisitionStatusUpdateInformation(mergedData);
        
        setLoginInformation(user);
      }


      if (user?.level === "L1" && user.accessLevel === 4) {
        try {
          setLoginInformation([]);
          const res = await axios.get(
            `${APP_BACKEND_URL}/Requisition/with-employee-by-irb/${user?.empID}`
          );
          setRequisitionInformation(res?.data);
          addNotification(reverseTransform(res?.data));
          setLoginInformation(user);
          
        } catch (error) {
          console.log(error.message);
          return
        }
      }



      if (user?.level === "L2" && user.accessLevel === 5) {
        setLoginInformation([]);
        let res, requisitionTrackResponse;
        try {
          res = await axios.get(`${APP_BACKEND_URL}/Requisition/with-employee-by-id/${user?.empID}`);
        } catch (error) {
          console.log(error.message)
        }

        try {
          requisitionTrackResponse = await axios.get(`${APP_BACKEND_URL}/Requisition/RequisitionTracker?empID=${user.empID}`);
        } catch (error) {
          console.log(error.message)
        }
        setStoreRequisitionTrack(requisitionTrackResponse?.data)
        setRequisitionApproveStatus(res?.data);
        setLoginInformation(user);
      }

      if (user?.level === "L3" && user.accessLevel === 6) {
        setLoginInformation([]);
        const res = await axios.get(
          `${APP_BACKEND_URL}/Requisition/with-employee-by-id/${user?.empID}`
        );
        setLoginInformation(user);
        setRequisitionApproveStatus(res?.data);
      }
    }

    fetchData();
  }, [localStorage.getItem("auth")]);



  return (
    <EmployeeLoginContext.Provider value={{
      loginInformation, setLoginInformation,
      requisitionInformation, setRequisitionInformation,
      requisitionApproveStatus,
      setRequisitionStatusUpdateInformation,
      storeRequistionTrack,
      requisitionStatusUpdateInformation
    }}>
      {children}
    </EmployeeLoginContext.Provider>
  )
}


const refreshRequisitionData = async () => {
  const storedUser = localStorage.getItem("auth");
  const user = JSON.parse(storedUser);
  let approvalResponse, approvalResponseForNextEmployeeStatus, requisitionResponse;

  try {
    approvalResponse = await axios.get(`${APP_BACKEND_URL}/SubAdminAproval/ForNextEmployee/?empId=${user.empID}`)
  } catch (error) {
    console.log(error.message)
  }


  try {
    approvalResponseForNextEmployeeStatus = await axios.get(`${APP_BACKEND_URL}/SubAdminAproval/ForNextEmployeeApprovedStatus?empId=${user.empID}`)
  } catch (error) {
    console.log(error.message)
  }


  try {
    requisitionResponse = await axios.get(`${APP_BACKEND_URL}/Requisition/with-employee-by-irb/${user.empID}`)
  } catch (error) {
    console.log(error.message)
  }


  // const [
  // ] = await Promise.all([
  //   axios.get(`${APP_BACKEND_URL}/SubAdminAproval/ForNextEmployee/?empId=${loginInformation?.empID}`),
  //   axios.get(`${APP_BACKEND_URL}/SubAdminAproval/ForNextEmployeeApprovedStatus?empId=${loginInformation?.empID}`),
  //   axios.get(`${APP_BACKEND_URL}/Requisition/with-employee-by-irb/${loginInformation?.empID}`)
  // ]);

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