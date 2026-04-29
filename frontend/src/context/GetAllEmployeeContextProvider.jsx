import React, { useEffect, useState } from "react";
import { GetAllEmployeeContext } from "./TestContext";
import axios from "axios";

const APP_BACKEND_URL = import.meta.env.VITE_DOTNET_BACKEND_URL;

function GetAllEmployeeContextProvider({ children }) {
  const [allEmployeesData, setAllEmployeesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllEmployeesData = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get(
        `${APP_BACKEND_URL}/EmployeeDetails`
      );

      setAllEmployeesData(res.data);
    } catch (err) {
      console.error(err.message);
      setError("Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllEmployeesData();
  }, []);

  return (
    <GetAllEmployeeContext.Provider
      value={{
        allEmployeesData,
        setAllEmployeesData,
        loading,
        error,
        refetch: fetchAllEmployeesData,
      }}
    >
      {children}
    </GetAllEmployeeContext.Provider>
  );
}

export default GetAllEmployeeContextProvider;