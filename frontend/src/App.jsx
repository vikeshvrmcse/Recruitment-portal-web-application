import React from 'react'
import './App.css'
import Navbar from './components/layout/Navbar'
import { Outlet } from "react-router-dom";
import Footer from './components/layout/Footer';
import { TestContextProvider } from './context/TestContextProvider';
import { NotificationProvider } from './context/NotificationContextProvider';
import { UpdateRequisitionContextProvider } from './context/UpdateRequisitionContextProvider';
import { ToastContainer } from 'react-toastify';
import { EmployeeLoginContextProvider } from './context/EmployeeLoginContextProvider';
import GetAllEmployeeContextProvider from './context/GetAllEmployeeContextProvider';
import GetAllRequisitionContextProvider from './context/GetAllRequisitionContextProvider';
function App() {
  return (
    <div>
      <Navbar />
      <TestContextProvider>
        <NotificationProvider>
          <EmployeeLoginContextProvider>
          <UpdateRequisitionContextProvider>
            <GetAllEmployeeContextProvider>
              <GetAllRequisitionContextProvider>
                <ToastContainer />
                <Outlet />
              </GetAllRequisitionContextProvider>
            </GetAllEmployeeContextProvider>
          </UpdateRequisitionContextProvider>
          </EmployeeLoginContextProvider>
        </NotificationProvider>
      </TestContextProvider>
      <Footer />
    </div>

  )
}

export default App


// useEffect(() => {
//     const fetchData = async () => {
//       const storedUser = localStorage.getItem("auth");

//       if (!storedUser) {
//         setLoginInformation([]);
//         setRequisitionInformation([]);
//         setRequisitionApproveStatus([]);
//         return;
//       }

//       const user = JSON.parse(storedUser);

//       //MPORTANT: RESET OLD DATA FIRST
//       setRequisitionInformation([]);
//       setRequisitionApproveStatus([]);


//       try {
//         if (user?.level === "L1" && user.accessLevel === 2) {

//           setLoginInformation([]);
//           const res = await axios.get(
//             `${APP_BACKEND_URL}/Requisition/with-employee-by-irb/${user.empID}`
//           );

          

//           setRequisitionInformation(res.data);
//           addNotification(reverseTransform(res.data));
//           setLoginInformation(user);
//         }

//         if (user?.level === "L2" && user.accessLevel === 3) {
//           setLoginInformation([]);
//           const res = await axios.get(
//             `${APP_BACKEND_URL}/Requisition/with-employee-by-id/${user.empID}`
//           );
//           setRequisitionApproveStatus(res.data);
//           setLoginInformation(user);
//         }
//         if (user?.level === "L3" && user.accessLevel === 4) {
//           setLoginInformation([]);
//           const res = await axios.get(
//             `${APP_BACKEND_URL}/Requisition/with-employee-by-id/${user.empID}`
//           );
//           setLoginInformation(user);
//           setRequisitionApproveStatus(res.data);
//         }
//         if (user?.level === "L4" && user.accessLevel === 5) {
//           setLoginInformation([]);
//           const res = await axios.get(
//             `${APP_BACKEND_URL}/Requisition/with-employee-by-id/${user.empID}`
//           );
//           setRequisitionApproveStatus(res.data);
//           setLoginInformation(user);
//         }


//       } catch (error) {
//         if (error.response && error.response.status === 404) {
//           toast.error("No user data found");
//         } else {
//           // Real error (server down, network issue, etc.)
//           // console.error("API Error:", error);
//           toast.error("Something went wrong");
//         }
//         // console.error("API Error:", error);
//       }
//     };

//     fetchData();
//   }, [localStorage.getItem("auth")]);



















// try {
//   if (user?.level === "L1" && user.accessLevel === 2) {

//     setLoginInformation([]);

//     const res = await axios.get(
//       `${APP_BACKEND_URL}/Requisition/with-employee-by-irb/${user.empID}`
//     );

//     console.log("API RESPONSE:", res.data);

//     if (res.data?.success) {
//       setRequisitionInformation(res.data.data || res.data);
//       addNotification(reverseTransform(res.data.data || res.data));
//       setLoginInformation(user);
//     } else {
//       toast.error(res.data?.message || "No data found");
//     }
//   }

//   if (user?.level === "L2" && user.accessLevel === 3) {
//     setLoginInformation([]);

//     const res = await axios.get(
//       `${APP_BACKEND_URL}/Requisition/with-employee-by-id/${user.empID}`
//     );

//     console.log("L2 RESPONSE:", res.data);

//     setRequisitionApproveStatus(res.data);
//     setLoginInformation(user);
//   }

//   if (user?.level === "L3" && user.accessLevel === 4) {
//     setLoginInformation([]);

//     const res = await axios.get(
//       `${APP_BACKEND_URL}/Requisition/with-employee-by-id/${user.empID}`
//     );

//     console.log("L3 RESPONSE:", res.data);

//     setRequisitionApproveStatus(res.data);
//     setLoginInformation(user);
//   }

//   if (user?.level === "L4" && user.accessLevel === 5) {
//     setLoginInformation([]);

//     const res = await axios.get(
//       `${APP_BACKEND_URL}/Requisition/with-employee-by-id/${user.empID}`
//     );

//     console.log("L4 RESPONSE:", res.data);

//     setRequisitionApproveStatus(res.data);
//     setLoginInformation(user);
//   }

// } catch (error) {
//   console.error("API ERROR:", error);

//   if (error.response?.status === 404) {
//     toast.error("No data found");
//   } else {
//     toast.error(error.response?.data?.message || "Something went wrong");
//   }
// }