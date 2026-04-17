import React, { useEffect, useState } from 'react'
import { EmployeeLoginContext } from './TestContext'
import axios from 'axios'
import { useNotification } from './NotificationContextProvider';
import { reverseTransform } from '../utils/dataFormatter';

const APP_BACKEND_URL = import.meta.env.VITE_DOTNET_BACKEND_URL;

function EmployeeLoginContextProvider({ children }) {
  const [loginInformation, setLoginInformation] = useState([])
  const [requisitionInformation, setRequisitionInformation] = useState([])
  const storedUser = localStorage.getItem("auth");
   const { addNotification } = useNotification();
  useEffect(() => {
    const fetchData = async () => {

      if (!storedUser) return;
      const user = JSON.parse(storedUser); //FIX
      setLoginInformation(user)

      try {
        if(user.level==="L1"){
        const requisitionResponse = await axios.get(
          `${APP_BACKEND_URL}/Requisition/with-employee-by-irb/${user.empID}`
        );
        setRequisitionInformation(requisitionResponse.data);
        addNotification(reverseTransform(requisitionResponse.data));
      }
      } catch (error) {
        console.error("API Error:", error);
      }
    };
    fetchData();
  }, [storedUser]);

  

  return (
    <EmployeeLoginContext.Provider value={{
      loginInformation, setLoginInformation,
      requisitionInformation, setRequisitionInformation
    }}>
      {children}
    </EmployeeLoginContext.Provider>
  )
}

export { EmployeeLoginContextProvider }