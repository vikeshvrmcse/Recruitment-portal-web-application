import React, { useEffect, useState } from "react";
import { GetAllEmployeeContext, GetApprovalDataContext } from "./TestContext";
import axios from "axios";

const APP_BACKEND_URL = import.meta.env.VITE_DOTNET_BACKEND_URL;

function GetApprovalDataContextProvider({ children }) {
  const [requisitionApprovalData, setRequisitionApprovalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const storedUser = localStorage.getItem("auth");
  const user = JSON.parse(storedUser);

  const fetchAllRequisitionApprovalData = async () => {

    const user = JSON.parse(storedUser);
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get(
        `${APP_BACKEND_URL}/SubAdminAproval/GetRequisitionByIRBFromImprove/${user?.empID}`
      );

      setRequisitionApprovalData(res.data);
    } catch (err) {
      console.error(err.message);
      setError("Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchAllRequisitionApprovalData();
  }, [user?.empID, requisitionApprovalData.length]);

  return (
    <GetApprovalDataContext.Provider
      value={{
        requisitionApprovalData,
        setRequisitionApprovalData,
        loading,
        error,
        refetch: fetchAllRequisitionApprovalData,
      }}
    >
      {children}
    </GetApprovalDataContext.Provider>
  );
}

export default GetApprovalDataContextProvider;