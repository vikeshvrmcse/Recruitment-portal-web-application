import axios from "axios";

const API_BACKEND_URL = import.meta.env.VITE_DOTNET_BACKEND_URL;

export const fetchRequisitionsByEmpID = async (empID) => {
  try {
    const response = await axios.get(
      `${API_BACKEND_URL}/SubAdminAproval/GetByEmpID/${empID}`
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching requisitions:", error);
    return [];
  }
};