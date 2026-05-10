import React, { useContext, useEffect, useState } from "react";
import axios from "axios";

import {
  EmployeeLoginContext,
  GetApprovalDataContext,
} from "./TestContext";

import { useNotification } from "./NotificationContextProvider";

const APP_BACKEND_URL =
  import.meta.env.VITE_DOTNET_BACKEND_URL;

function EmployeeLoginContextProvider({ children }) {

  const [loginInformation, setLoginInformation] = useState([]);
  const [requisitionApproveStatus, setRequisitionApproveStatus] =
    useState([]);

  const { addNotification } = useNotification();

  const {
    setRequisitionApprovalData,
  } = useContext(GetApprovalDataContext);

  // SAFE localStorage parse
  const storedUser = localStorage.getItem("auth");

  const data = storedUser
    ? JSON.parse(storedUser)
    : null;

  // ================= FETCH DATA =================
  const fetchData = async () => {

    const storedUser = localStorage.getItem("auth");

    // No user
    if (!storedUser) {
      setLoginInformation([]);
      setRequisitionApprovalData([]);
      return;
    }

    const user = JSON.parse(storedUser);

    try {

      // RESET STATES
      setLoginInformation([]);
      setRequisitionApprovalData([]);

      // ================= L1 =================
      if (
        user?.level === "L1" &&
        [1, 2, 3, 4].includes(user?.accessLevel)
      ) {

        setLoginInformation(user);
        return;
      }

      // ================= L2 / L3 =================
      if (
        (user?.level === "L2" &&
          user?.accessLevel === 5) ||

        (user?.level === "L3" &&
          user?.accessLevel === 6)
      ) {

        const res = await axios.get(
          // `${APP_BACKEND_URL}/Requisition/with-employee-by-id/${user?.empID}`
          `${APP_BACKEND_URL}/requisition/with-employee-by-id/${user?.empID}`
        );

        console.log(res.data)
        setRequisitionApproveStatus(res?.data);
        setLoginInformation(user);

        return;
      }

      // ================= L3 HR / L4 =================
      if (
        (user?.level === "L3" &&
          user?.accessLevel === 6 && user?.dept==="HR") ||

        (user?.level === "L4" &&
          user?.accessLevel === 7)
      ) {

        
        setLoginInformation(user);

        return;
      }

    } catch (error) {

      console.log(error?.message);

    }
  };

  // ================= AUTO LOAD =================
  useEffect(() => {
    fetchData();
  }, [data?.empID]);

  return (
    <EmployeeLoginContext.Provider
      value={{
        loginInformation,
        setLoginInformation,

        requisitionApproveStatus,
        setRequisitionApproveStatus,

        reloadPage: fetchData,
      }}
    >
      {children}
    </EmployeeLoginContext.Provider>
  );
}

export { EmployeeLoginContextProvider };