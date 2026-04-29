import React, { useEffect, useState } from "react";
import { GetAllRequisitionContext } from "./TestContext";
import axios from "axios";

const APP_BACKEND_URL = import.meta.env.VITE_DOTNET_BACKEND_URL;

function GetAllRequisitionContextProvider({ children }) {
  const [allRequisitionsData, setAllRequisitionsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllRequisitionsData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${APP_BACKEND_URL}/Requisition`
      );

      setAllRequisitionsData(res.data);
      setError(null);
    } catch (err) {
      console.error(err.message);
      setError("Failed to fetch requisitions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllRequisitionsData();
  }, []);

  return (
    <GetAllRequisitionContext.Provider
      value={{
        allRequisitionsData,
        setAllRequisitionsData,
        loading,
        error,
        refetch: fetchAllRequisitionsData,
      }}
    >
      {children}
    </GetAllRequisitionContext.Provider>
  );
}

export default GetAllRequisitionContextProvider;