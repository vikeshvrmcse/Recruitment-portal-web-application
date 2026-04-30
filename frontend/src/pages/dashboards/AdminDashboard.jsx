import React, { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import { EmployeeLoginContext, GetAllEmployeeContext, GetAllRequisitionContext, UpdateRequisitionContext } from "../../context/TestContext";
import { CgMenuGridR, CgProfile } from "react-icons/cg";
import { RiCloseCircleFill } from "react-icons/ri";
import axios from "axios";
import { reverseTransform } from "../../utils/dataFormatter";
import { fetchRequisitionsApprovalsByEmpID } from "../../utils/fetchApprovedData";
import EmployeeModal from "../../modals/EmployeeModal";
import ProfileModal from "../../modals/ProfileModal";
import NotificationBell from "../../utils/NotificationBell";
import NotificationModal from "../../modals/NotificationModel";
import JobModel from "../../modals/JobModal";
import { FidgetSpinner } from "react-loader-spinner";
import Stepper from "../../utils/Stepper";
import { motion } from 'framer-motion'
const APP_BACKEND_URL = import.meta.env.VITE_DOTNET_BACKEND_URL;
function AdminDashboard() {
  const { loginInformation } = useContext(EmployeeLoginContext);
  const dispatch = useDispatch();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("dashboard");

  const approvedMenuItems = [
    { key: "arpanaApproved", label: "Approved By Arpana" },
    { key: "munjalApproved", label: "Approved By Munjal" },
    { key: "harishApproved", label: "Approved By Harish" },
  ];
  const rejectedMenuItems = [
    { key: "arpanaRejection", label: "Rejected By Arpana" },
    { key: "munjalRejection", label: "Rejected By Munjal" },
    { key: "harishRejection", label: "Rejected By Harish" },
  ];

  const approverMap = {
    arpanaApproved: "PMA0159",
    munjalApproved: "PMA0643",
    harishApproved: "PMA0171",
    arpanaRejection: "PMA0159",
    munjalRejection: "PMA0643",
    harishRejection: "PMA0171",
  };


  const styles = {
    approved: {
      header: "bg-green-200",
      card: "bg-green-100",
      title: "Approved By",
    },
    rejected: {
      header: "bg-red-200",
      card: "bg-red-100",
      title: "Rejected By",
    },
  };

  return (
    <div className="h-screen flex bg-gray-100 overflow-hidden">

      {/* OVERLAY (mobile only) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed md:static z-5 top-0 left-0 h-full w-64 bg-rose-950 text-white transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* HEADER */}
        <div className="p-5 text-xl font-semibold border-b border-rose-700 flex justify-between items-center">
          Admin Panel

          {/* Close button (mobile only) */}
          <button
            className="md:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <RiCloseCircleFill />
          </button>
        </div>

        {/* USER INFO */}
        <div className="p-4 border-b border-slate-700">
          <p className="text-sm text-gray-300">Welcome</p>
          <p className="font-medium">{loginInformation?.empName}</p>
        </div>

        {/* MENU */}
        <nav className="flex-1 p-3 space-y-2">
          <button
            onClick={() => {
              setActiveMenu("Required Your Approvals");
              setSidebarOpen(false); // auto close on mobile
            }}
            className={`w-full text-left px-4 py-2 rounded-lg transition ${activeMenu === "Required Your Approvals"
              ? "bg-white text-slate-900"
              : "hover:bg-slate-700"
              }`}
          >
            {"Required Your Approvals"}
          </button>
          <button
            onClick={() => {
              setActiveMenu("All Employees");
              setSidebarOpen(false); // auto close on mobile
            }}
            className={`w-full text-left px-4 py-2 rounded-lg transition ${activeMenu === "All Employees"
              ? "bg-white text-slate-900"
              : "hover:bg-slate-700"
              }`}
          >
            {"Required Your Approvals"}
          </button>
          <button
            onClick={() => {
              setActiveMenu("All Requisition");
              setSidebarOpen(false); // auto close on mobile
            }}
            className={`w-full text-left px-4 py-2 rounded-lg transition ${activeMenu === "All Requisition"
              ? "bg-white text-slate-900"
              : "hover:bg-slate-700"
              }`}
          >
            {"All Requisition"}
          </button>
          <div className="p-2">
            <p className="text-xl text-red-200 font-light">Approved Menus</p>
          </div>
          {approvedMenuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => {
                setActiveMenu(item.key);
                setSidebarOpen(false); // auto close on mobile
              }}
              className={`w-full text-left px-4 py-2 rounded-lg transition ${activeMenu === item.key
                ? "bg-white text-slate-900"
                : "hover:bg-slate-700"
                }`}
            >
              {item.label}
            </button>
          ))}
          <hr className="w-full" />
          <div className="p-2">
            <p className="text-xl text-red-200 font-light">Rejection Menus</p>
          </div>
          {rejectedMenuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => {
                setActiveMenu(item.key);
                setSidebarOpen(false); // auto close on mobile
              }}
              className={`w-full text-left px-4 py-2 rounded-lg transition ${activeMenu === item.key
                ? "bg-white text-slate-900"
                : "hover:bg-slate-700"
                }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* LOGOUT */}
        <div className="p-4 border-t border-slate-700">
          <button
            onClick={() => dispatch(logout())}
            className="w-full bg-red-600 hover:bg-red-700 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col w-full">

        {/* TOP BAR */}
        <header className="flex items-center justify-between bg-white p-4 shadow">

          {/* Hamburger */}
          <button
            className="md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <CgMenuGridR />
          </button>

          <h1 className="text-xl font-semibold capitalize">
            {activeMenu}
          </h1>

          <div className="text-sm text-gray-600 hidden sm:block">
            {loginInformation?.empName}
          </div>
        </header>

        {/* CONTENT */}
        {/* <main className="p-6 overflow-y-auto">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

            <div className="bg-white p-5 rounded-xl shadow">
              Total Employees
            </div>

            <div className="bg-white p-5 rounded-xl shadow">
              Attendance Overview
            </div>

            <div className="bg-white p-5 rounded-xl shadow">
              Project Status
            </div>

          </div>

        </main> */}

        <main className="p-6 overflow-y-auto">
          {activeMenu === "Required Your Approvals" && <RequiredApprovals />}
          {activeMenu === "All Employees" && <AllEmployees />}
          {activeMenu === "All Requisition" && <Requisitions />}

          {activeMenu.toLowerCase().includes("approved") && (
            <ApprovalRejection
              type="approved"
              id={approverMap[activeMenu]}
            />
          )}

          {activeMenu.toLowerCase().includes("rejection") && (
            <ApprovalRejection
              type="rejected"
              id={approverMap[activeMenu]}
            />
          )}
        </main>
      </div>
    </div>
  );


}




function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="flex justify-center gap-2 mt-6">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
      >
        Prev
      </button>

      <span className="px-4 py-1">
        {currentPage} / {totalPages}
      </span>

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}


function ApprovalRejection({ id, type }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const styles = {
    approved: {
      header: "bg-green-200",
      card: "bg-green-100",
      title: "Approved By",
    },
    rejected: {
      header: "bg-red-200",
      card: "bg-red-100",
      title: "Rejected By",
    },
  };

  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${APP_BACKEND_URL}/SubAdminAproval/GetUniqueEmployeesWithStatus?id=${id}&status=${type}`
      );

      setData(res.data);
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, type]); // ✅ IMPORTANT: include id

  if (loading) return <p>Loading...</p>;
  if (!data || !data.approvedBy) return null;

  return (
    <div className="mb-10">
      {/* 🔥 Approver Header */}
      <div className={`mb-6 p-4 rounded shadow ${styles[type].header}`}>
        <h2 className="font-bold text-lg">{styles[type].title}</h2>
        <p>{data.approvedBy?.empName}</p>
        <p className="text-sm">{data.approvedBy?.designation}</p>
      </div>

      {/* 🔥 Creators */}
      {data.creator?.map((creator) => (
        <div key={creator.creator_employee?.empID} className="mb-6">

          <div className="bg-white p-4 rounded shadow mb-3">
            <h3 className="font-semibold">
              {creator.creator_employee?.empName}
            </h3>
            <p className="text-sm text-gray-500">
              {creator.creator_employee?.designation}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {creator.requisition?.map((req) => (
              <div key={req.id} className={`${styles[type].card} p-4 rounded shadow`}>
                <h4 className="font-semibold">{req.jobTitle}</h4>
                <p className="text-sm">{req.department}</p>
                <p className="text-xs mt-2">{req.description}</p>
              </div>
            ))}
          </div>

        </div>
      ))}
    </div>
  );
}

function AllEmployees() {
  const { allEmployeesData = [] } = useContext(GetAllEmployeeContext);

  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  const totalPages = Math.ceil(allEmployeesData.length / itemsPerPage);

  const currentData = allEmployeesData.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {currentData.map((emp) => (
          <div
            key={emp.empID}
            className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition border"
          >
            {/* HEADER */}
            <div className="border-b pb-3 mb-3">
              <h2 className="text-lg font-semibold text-slate-800">
                {emp.empName}
              </h2>
              <p className="text-sm text-gray-500">{emp.mailID}</p>
            </div>

            {/* DETAILS */}
            <div className="space-y-1 text-sm text-gray-700">
              <p><span className="font-medium text-gray-500">ID:</span> {emp.empID}</p>
              <p><span className="font-medium text-gray-500">Role:</span> {emp.designation}</p>
              <p><span className="font-medium text-gray-500">Department:</span> {emp.dept}</p>
              <p><span className="font-medium text-gray-500">Location:</span> {emp.companyLocation}</p>
            </div>

            {/* STATUS */}
            <div className="mt-4 flex justify-between items-center">
              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                Level: {emp.level}
              </span>

              <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                {emp.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}



function RequiredApprovals() {


  const [requests, setRequests] = useState([]);
  const { setUpdateRequisitionData } = useContext(UpdateRequisitionContext);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [show, setShow] = useState(false)
  const [showModalOpen, setShowModelOpen] = useState(false)
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { loginInformation, requisitionStatusUpdateInformation, setRequisitionStatusUpdateInformation, requisitionInformation } = useContext(EmployeeLoginContext)
  const [tableData, setTableData] = useState([])
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);
  const [loadingId, setLoadingId] = useState(null);
  const [requisitionNextStatusUpdateTableData, setRequisitionNextStatusUpdateTableData] = useState([])
  const [profileModelShow, setProfileModelShow] = useState(false)


  const [requisitionUpdateId, setUpdateRequisitionId] = useState("")

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
  }

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.get(`${APP_BACKEND_URL}/Requisition/with-employee-by-irb/${loginInformation?.empID}`)

        if (response.data && response.data.length > 0) {
          setRequests(reverseTransform(response.data));
        }
      } catch (error) {
        console.error("Error fetching requisitions:", error);

      }
    }

    fetch()

  }, [loginInformation, requisitionInformation]);

  const handleEdit = (row) => {
    setUpdateRequisitionData(row);
  };

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

  useEffect(() => {
    const loadData = async () => {
      let approvalResponse, approvalResponseForNextEmployeeStatus;
      try {
        approvalResponse = await axios.get(`${APP_BACKEND_URL}/SubAdminAproval/ForNextEmployeeByAdmin?empId=${"PMA0002"}`)
      } catch (error) {
        console.log(error.message)
      }


      try {
        approvalResponseForNextEmployeeStatus = await axios.get(`${APP_BACKEND_URL}/SubAdminAproval/ForNextEmployeeApprovedStatus?empId=${"PMA0002"}`)
      } catch (error) {
        console.log(error.message)
      }



      const approvalData = approvalResponse?.data || [];
      const approvedStatusData = approvalResponseForNextEmployeeStatus?.data || [];
      const mergedData = mergeApprovedData(approvalData, approvedStatusData);
      setTableData(mergedData);
    };

    loadData();
  }, [loading]);

  const [curAndPrevData, setCurAndPrevData]=useState([])

  useEffect(()=>{
    const fetch=async()=>{
      try {
        const response=await axios.get(`${APP_BACKEND_URL}/SubAdminAproval/ForNextEmployeeByAdminForMunjal?empId=${loginInformation?.empID}`)
        setCurAndPrevData(response.data)
      } catch (error) {
        console.log(error.message)
      }
    }
    fetch()
  }, [loginInformation?.empID])



  console.log("Get data",curAndPrevData)

  const mergeStatus = (oldData, newData) => {
    return oldData.map((item) => {
      const match = newData.find(
        (n) => n.requisitionID === item.id
      );

      return match
        ? { ...item, previousStatus: match.status }
        : item;
    });
  };



  const updateStatus = async (id, status) => {
    try {
      setLoading(true);

      if (id !== '') {
        setUpdateRequisitionId(id)
        const response = await axios.post(
          `${API_BACKEND_URL}/SubAdminAproval/RequisitionStatusUpdate`,
          {
            requisitionID: id,
            nextEmpID: loginInformation?.irb,
            empID: loginInformation?.empID,
            previousStatus: status
          }
        );
        const updatedStatus = response.data?.data?.previousStatus;

        setTableData((prev) =>
          prev.map((item) =>
            item.id === id || item.requisitionID === id
              ? { ...item, previousStatus: updatedStatus || status }
              : item
          )
        );

        toast.success("Update status successfully")

      }

    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false);
    }
  };



  const updateStatusWithNext = async (id, previous, status) => {
    try {
      setLoadingId(id);

      const response = await axios.post(
        `${API_BACKEND_URL}/SubAdminAproval/RequisitionStatusUpdateWithNextUpdator`,
        {
          requisitionID: id,
          nextEmpID: loginInformation?.irb,
          empID: loginInformation?.empID,
          previousStatus: previous,
          currentStatus: status
        }
      );


      setRequisitionStatusUpdateInformation((prev) =>
        prev.map((item) =>
          item.requisitionID === id
            ? {
              ...item,
              currentStatus: status,
              previousStatus: previous
            }
            : item
        )
      );

      toast.success("Update status successfully");

    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoadingId(null);
    }
  };

  const updatedData = mergeStatus(requests, tableData);



  // FILTER + SEARCH LOGIC
  const filteredRequests = updatedData
    ?.map(data => ({
      ...data,
      previousStatus: data.previousStatus === undefined ? data.status : data.previousStatus
    }))
    .filter((r) => {
      const matchStatus = filter === "All" || r.previousStatus === filter;
      const matchSearch = r.name?.toLowerCase().includes(search.toLowerCase());
      return matchStatus && matchSearch;
    });

  const tearClick = function () {
    setShow(!show);
  }

  const stats = [
    { label: "Total", value: updatedData.length },
    {
      label: "Pending",
      value: updatedData.filter((r) => r.previousStatus === "pending").length,
    },
    {
      label: "Approved",
      value: updatedData.filter((r) => r.previousStatus === "approved").length,
    },
    {
      label: "Rejected",
      value: updatedData.filter((r) => r.previousStatus === "rejected").length,
    },
  ];



  const filters = ["All", "pending", "approved", "rejected"];

  return (
    <div className="min-h-screen bg-gray-100 flex">




      <div className={`${profileModelShow ? "w-full" : ""}`}>
        {profileModelShow && (<ProfileModal employeeData={loginInformation} />)}
      </div>

      {/* MAIN */}
      <div className={`${!profileModelShow ? "w-full" : ""}`}>
        {!profileModelShow && (
          <main className="flex-1 flex flex-col">
            <div className={`${show ? "p-4 my-4" : ""}`}>
              {show ? <h1 className="text-3xl text-gray-800 mb-6 uppercase font-light">Track Requisition </h1> : ''}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`${show ? 'h-full mt-2 bg-green-100 rounded-lg border-2 border-green-900' : ''}`}>
                {show ? <div className="p-2 md:p-6">


                  <Stepper steps={requisition.steps} />
                  <div className="bg-white shadow rounded-lg mt-2 p-4 mb-2">
                    <h2 className="text-xl font-bold">
                      {requisition.title}
                    </h2>
                    <p className="text-sm text-gray-500">
                      Created by: {requisition.createdBy}
                    </p>
                    <p className="text-sm mt-2">
                      Status:{" "}
                      <span className="font-semibold capitalize">
                        {requisition.status}
                      </span>
                    </p>
                  </div>
                </div> : ""}
              </motion.div>
            </div>

            <div className="p-6">
              <div className="bg-white p-4 rounded-lg my-4">
                <h1 className="mb-4 font-light text-2xl ">
                  Requisition Counts
                </h1>
                {/* STATS */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {stats.map((s, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-xl shadow p-5 border-l-4 border-pink-900"
                    >
                      <p className="text-gray-500 text-sm">{s.label}</p>
                      <p className="text-2xl font-bold">{s.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {open && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
                  <div className="w-full max-w-5xl">
                    <JobModel requisitionId={requisitionUpdateId} close={open} setClose={setOpen} modelTitleModification={"Modify requisition via your superviser"} differentOperationUrl={"https://localhost:7073/api/SubAdminAproval"} operationMode={"update"} />
                  </div>
                </div>
              )}
              {showModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
                  <div className="w-full max-w-5xl">
                    <EmployeeModal
                      isOpen={showModalOpen}
                      onClose={() => setShowModelOpen(false)}
                    />
                  </div>
                </div>
              )}

              {/* TABLE */}
              <div className="bg-white shadow rounded-xl overflow-hidden mt-6">

                {/* HEADER */}
                <div className="p-4 border-b flex flex-col md:flex-row md:justify-between md:items-center gap-3">
                  <h2 className="font-light text-xl md:text-2xl">
                    Head1 Type Requisition Approvals
                  </h2>
                  <button className="w-full md:w-auto px-4 bg-slate-800 text-white py-2 rounded-lg hover:bg-white hover:text-slate-800 transition border border-slate-800">
                    Generate Report
                  </button>
                </div>

                {/* TABLE */}
                {/* ================= DESKTOP TABLE ================= */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600">
                      <tr>
                        <th className="p-3 text-center">RFQ Name</th>
                        <th className="p-3 text-center">Designation</th>
                        <th className="p-3 text-center">Department</th>
                        <th className="p-3 text-center">Profile(Job Title) </th>
                        <th className="p-3 text-center">Date of RFQ </th>
                        <th className="p-3 text-center">Date of Deadline</th>
                        <th className="p-3 text-center">Status</th>
                        <th className="p-3 text-center">Action</th>
                        <th className="p-3 text-center">Modification</th>
                        <th className="p-3 text-center">View</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredRequests.map((r, idx) => (
                        <tr key={idx} className="border-b hover:bg-gray-50">

                          <td className="p-3 font-medium">{r?.name}</td>
                          <td className="p-3 font-medium">{r?.designation}</td>
                          <td className="p-3 text-gray-600">{r?.department}</td>
                          <td className="p-3 text-gray-600">{r?.jobTitle}</td>
                          <td className="p-3 text-gray-600">{formatDate(r?.createdAt)}</td>
                          <td className="p-3 text-gray-600">{formatDate(r?.deadline)}</td>

                          <td className="p-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${r.previousStatus === "approved"
                              ? "bg-green-100 text-green-700"
                              : r.previousStatus === "rejected"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                              }`}>
                              {r.previousStatus}
                            </span>
                          </td>


                          <td className="p-3 flex gap-2 justify-center mt-5">
                            <button
                              onClick={() => updateStatus(r.id, "approved")}
                              className={`${r.previousStatus === 'rejected' || r.previousStatus === 'approved' ? "bg-gray-200 text-xs px-2 py-1 text-slate-500" : "bg-green-600 text-white text-xs py-1 px-2 rounded"}`}
                              disabled={r.previousStatus === 'rejected' || r.previousStatus === 'approved'}
                            >
                              Approve {loading ? <FidgetSpinner
                                preset='rainbow'
                                visible={true}
                                height="20"
                                width="20"
                                radius="40"
                                color="#4fa94d"
                                ariaLabel="watch-loading"
                                wrapperStyle={{}}
                                wrapperClass=""
                              /> : ""}
                            </button>

                            <button
                              onClick={() => updateStatus(r.id, "rejected")}
                              disabled={r.previousStatus === 'rejected' || r.previousStatus === 'approved'}
                              className={`${r.previousStatus === 'rejected' || r.previousStatus === 'approved' ? "bg-gray-200 text-xs px-2 py-1 text-slate-500" : "bg-red-600 text-white text-xs py-1 px-2 rounded"}`}
                            >
                              Reject {loading ? <FidgetSpinner
                                preset='rainbow'
                                visible={true}
                                height="20"
                                width="20"
                                radius="40"
                                color="#4fa94d"
                                ariaLabel="watch-loading"
                                wrapperStyle={{}}
                                wrapperClass=""
                              /> : ""}
                            </button>
                          </td>

                          <td className="p-3">
                            <button
                              onClick={() => { setOpen(true); handleEdit(filteredRequests[idx]) }}
                              className={`${r.previousStatus === 'rejected' || r.previousStatus === 'approved' ? "bg-gray-200 text-xs px-2 py-1 text-slate-500" : "bg-orange-600 text-white text-xs py-1 px-2 rounded"} flex gap-3 justify-center items-center`}
                              disabled={r.previousStatus === 'rejected' || r.previousStatus === 'approved'}
                            >
                              Modify {loading ? <FidgetSpinner
                                preset='rainbow'
                                visible={true}
                                height="20"
                                width="20"
                                radius="40"
                                color="#4fa94d"
                                ariaLabel="watch-loading"
                                wrapperStyle={{}}
                                wrapperClass=""
                              /> : ""}
                            </button>
                          </td>

                          <td className="p-3">
                            <button

                              onClick={() => { setShowModelOpen(true); setUpdateRequisitionData(filteredRequests[idx]) }}
                              className="px-3 py-1 text-xs rounded bg-blue-600 text-white"
                            >
                              Show
                            </button>
                          </td>

                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              {/* TABLE */}
              <div className="bg-white shadow rounded-xl overflow-hidden mt-6">

                {/* HEADER */}
                <div className="p-4 border-b flex flex-col md:flex-row md:justify-between md:items-center gap-3">
                  <h2 className="font-light text-xl md:text-2xl">
                    Head2 Type Requisition Approvals
                  </h2>
                  <button className="w-full md:w-auto px-4 bg-slate-800 text-white py-2 rounded-lg hover:bg-white hover:text-slate-800 transition border border-slate-800">
                    Generate Report
                  </button>
                </div>

                {/* SEARCH + FILTER */}
                <div className="p-4 border-b flex flex-col md:flex-row gap-3 md:items-center md:justify-between">

                  {/* SEARCH */}
                  <input
                    type="text"
                    placeholder="Search candidate name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border px-3 py-2 rounded w-full md:w-1/3"
                  />

                  {/* FILTERS */}
                  <div className="flex flex-wrap gap-2">
                    {filters.map((f) => (
                      <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-3 py-1 text-sm rounded-full border transition ${filter === f
                          ? "bg-pink-900 text-white border-pink-600"
                          : "bg-white text-gray-600 hover:bg-gray-100"
                          }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>


                {/* ================= DESKTOP TABLE ================= */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600">
                      <tr>
                        <th className="p-3 text-center">RFQ Name</th>
                        <th className="p-3 text-center">Designation</th>
                        <th className="p-3 text-center">Department</th>
                        <th className="p-3 text-center">Profile(Job Title) </th>
                        <th className="p-3 text-center">Date of RFQ </th>
                        <th className="p-3 text-center">Date of Deadline</th>
                        <th className="p-3 text-center">Previous Status</th>
                        <th className="p-3 text-center">Current Status</th>
                        <th className="p-3 text-center">Action</th>
                        <th className="p-3 text-center">Modification</th>
                        <th className="p-3 text-center">View</th>
                      </tr>
                    </thead>

                    <tbody>
                      {tableData.map((r, idx) => {


                        const status = r.currentStatus?.toLowerCase() || "pending";
                        const isDisabled = status !== "pending";

                        return (
                          <tr key={idx}>

                            <td className="p-3 font-medium">{r?.createdByName}</td>
                            <td className="p-3 font-medium">{r?.designation}</td>
                            <td className="p-3 text-gray-600">{r?.department}</td>
                            <td className="p-3 text-gray-600">{r?.jobTitle}</td>
                            <td className="p-3 text-gray-600">{formatDate(r?.createdAt)}</td>
                            <td className="p-3 text-gray-600">{formatDate(r?.deadline)}</td>

                            {/* Previous Status */}
                            <td className="p-3 text-center">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${r.previousStatus === "approved"
                                ? "bg-green-100 text-green-700"
                                : r.previousStatus === "rejected"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-yellow-100 text-yellow-700"
                                }`}>
                                {r.previousStatus}
                              </span>

                              <div>
                                <span className="font-extralight mt-3 text-[8px] text-white bg-gray-800 rounded-lg p-1">
                                  {r.approverName}
                                </span>
                              </div>
                            </td>

                            {/* Current Status */}
                            <td className="p-3">
                              <span className={`text-xs px-2 py-1 rounded font-medium ${status === "approved"
                                ? "bg-green-100 text-green-700"
                                : status === "rejected"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-yellow-100 text-yellow-700"
                                }`}>
                                {status === "approved"
                                  ? "Approved"
                                  : status === "rejected"
                                    ? "Rejected"
                                    : "Pending"}
                              </span>
                            </td>

                            {/* Actions */}
                            <td className="p-3 flex flex-col gap-2 items-center">

                              {/* Buttons */}
                              <div className="flex gap-2">

                                <button
                                  onClick={() => updateStatusWithNext(r.requisitionID, r.previousStatus, "approved")}
                                  disabled={isDisabled}
                                  className={`text-xs px-2 py-1 rounded ${isDisabled
                                    ? "bg-gray-200 text-slate-500 cursor-not-allowed"
                                    : "bg-green-600 text-white"
                                    }`}
                                >
                                  Approve
                                  {loadingId === r.requisitionID && <FidgetSpinner height="20" width="20" />}
                                </button>

                                <button
                                  onClick={() => updateStatusWithNext(r.requisitionID, r.previousStatus, "rejected")}
                                  disabled={isDisabled}
                                  className={`text-xs px-2 py-1 rounded ${isDisabled
                                    ? "bg-gray-200 text-slate-500 cursor-not-allowed"
                                    : "bg-red-600 text-white"
                                    }`}
                                >
                                  Reject
                                  {loadingId === r.requisitionID && <FidgetSpinner height="20" width="20" />}
                                </button>

                              </div>
                            </td>

                            {/* Modify */}
                            <td className="p-3">
                              <button
                                onClick={() => { setOpen(true); handleEdit(r) }}
                                className={`text-xs px-2 py-1 rounded ${status !== "pending"
                                  ? "bg-gray-200 text-slate-500"
                                  : "bg-orange-600 text-white"
                                  }`}
                                disabled={status !== "pending"}
                              >
                                Modify
                              </button>
                            </td>

                            {/* Show */}
                            <td className="p-3">
                              <button
                                onClick={() => {
                                  setShowModelOpen(true);
                                  setUpdateRequisitionData(r);
                                }}
                                className="px-3 py-1 text-xs rounded bg-blue-600 text-white"
                              >
                                Show
                              </button>
                            </td>

                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                

                {/* ================= MOBILE CARD VIEW ================= */}
                <div className="md:hidden p-4 space-y-4">
                  {filteredRequests.map((r, idx) => (
                    <div key={r.id} className="border rounded-lg p-4 shadow-sm bg-white">

                      {/* NAME + ROLE */}
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">{r.name}</p>
                          <p className="text-sm text-gray-500">{r.jobTitle}</p>
                        </div>

                        {/* STATUS */}
                        <span className={`text-xs px-2 py-1 rounded-full ${r.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : r.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                          }`}>
                          {r.status}
                        </span>
                      </div>

                      {/* ACTIONS */}
                      <div className="mt-5 grid grid-cols-2 gap-2">

                        <button
                          disabled={loading}
                          onClick={() => updateStatus(r.id, "approved")}
                          className={`${loading ? "bg-green-600 text-white text-xs py-2 rounded" : "bg-gray-200 text-slate-500"}`}
                        >
                          Approve
                        </button>

                        <button
                          onClick={() => updateStatus(r.id, "rejected")}
                          className="bg-red-600 text-white text-xs py-2 rounded"
                        >
                          Reject
                        </button>

                        <button
                          onClick={() => { updateStatus(r.id, "modify"); setOpen(true); handleEdit(filteredRequests[idx]) }}
                          className="bg-yellow-600 text-white text-xs py-2 rounded"
                        >
                          Modify
                        </button>

                        <button
                          onClick={() => { updateStatus(r.id, "view"); setShowModelOpen(true); setUpdateRequisitionData(filteredRequests[idx]) }}
                          className="bg-blue-600 text-white text-xs py-2 rounded"
                        >
                          Show
                        </button>

                      </div>

                    </div>
                  ))}

                </div>

              </div>

              {/* ================= DESKTOP TABLE ================= */}
                <div className="hidden md:block overflow-x-auto my-4">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600">
                      <tr>
                        <th className="p-3 text-center">RFQ Name</th>
                        <th className="p-3 text-center">Designation</th>
                        <th className="p-3 text-center">Department</th>
                        <th className="p-3 text-center">Profile(Job Title) </th>
                        <th className="p-3 text-center">Date of RFQ </th>
                        <th className="p-3 text-center">Date of Deadline</th>
                        <th className="p-3 text-center">Previous Status</th>
                        <th className="p-3 text-center">Current Status</th>
                        <th className="p-3 text-center">Action</th>
                        <th className="p-3 text-center">Modification</th>
                        <th className="p-3 text-center">View</th>
                      </tr>
                    </thead>

                    <tbody>
                      {curAndPrevData?.map((r, idx) => {


                        const status = r.currentStatus?.toLowerCase() && "approved";
                        const isDisabled = status !== "approved";

                        return (
                          <tr key={idx}>

                            <td className="p-3 font-medium">{r?.createdByName}</td>
                            <td className="p-3 font-medium">{r?.designation}</td>
                            <td className="p-3 text-gray-600">{r?.department}</td>
                            <td className="p-3 text-gray-600">{r?.jobTitle}</td>
                            <td className="p-3 text-gray-600">{formatDate(r?.createdAt)}</td>
                            <td className="p-3 text-gray-600">{formatDate(r?.deadline)}</td>

                            {/* Previous Status */}
                            <td className="p-3 text-center">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${r.previousStatus === "approved"
                                ? "bg-green-100 text-green-700"
                                : r.previousStatus === "rejected"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-yellow-100 text-yellow-700"
                                }`}>
                                {r.previousStatus}
                              </span>

                              <div>
                                <span className="font-extralight mt-3 text-[8px] text-white bg-gray-800 rounded-lg p-1">
                                  {r.currentApprover}
                                </span>
                              </div>
                            </td>

                            {/* Current Status */}
                            <td className="p-3">
                              <span className={`text-xs px-2 py-1 rounded font-medium ${status !== "approved"
                                ? "bg-green-100 text-green-700"
                                : status === "rejected"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-yellow-100 text-yellow-700"
                                }`}>
                                {status !== "approved"
                                  ? "Approved"
                                  : status === "rejected"
                                    ? "Rejected"
                                    : "Pending"}
                              </span>
                            </td>

                            {/* Actions */}
                            <td className="p-3 flex flex-col gap-2 items-center">

                              {/* Buttons */}
                              <div className="flex gap-2">

                                <button
                                  onClick={() => updateStatusWithNext(r.requisitionID, r.previousStatus, "approved")}
                                  disabled={isDisabled}
                                  className={`text-xs px-2 py-1 rounded ${isDisabled
                                    ? "bg-gray-200 text-slate-500 cursor-not-allowed"
                                    : "bg-green-600 text-white"
                                    }`}
                                >
                                  Approve
                                  {loadingId === r.requisitionID && <FidgetSpinner height="20" width="20" />}
                                </button>

                                <button
                                  onClick={() => updateStatusWithNext(r.requisitionID, r.previousStatus, "rejected")}
                                  disabled={isDisabled}
                                  className={`text-xs px-2 py-1 rounded ${isDisabled
                                    ? "bg-gray-200 text-slate-500 cursor-not-allowed"
                                    : "bg-red-600 text-white"
                                    }`}
                                >
                                  Reject
                                  {loadingId === r.requisitionID && <FidgetSpinner height="20" width="20" />}
                                </button>
                              </div>
                            </td>

                            {/* Modify */}
                            <td className="p-3">
                              <button
                                onClick={() => { setOpen(true); handleEdit(r) }}
                                className={`text-xs px-2 py-1 rounded ${status === "pending"
                                  ? "bg-gray-200 text-slate-500"
                                  : "bg-orange-600 text-white"
                                  }`}
                                disabled={status === "pending"}
                              >
                                Modify
                              </button>
                            </td>

                            {/* Show */}
                            <td className="p-3">
                              <button
                                onClick={() => {
                                  setShowModelOpen(true);
                                  setUpdateRequisitionData(r);
                                }}
                                className="px-3 py-1 text-xs rounded bg-blue-600 text-white"
                              >
                                Show
                              </button>
                            </td>

                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
            </div>
          </main>)}
      </div>
    </div>
  );
}




function Requisitions() {
  const { allRequisitionsData = [] } = useContext(GetAllRequisitionContext);

  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  const totalPages = Math.ceil(allRequisitionsData.length / itemsPerPage);

  const currentData = allRequisitionsData.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {currentData.map((item) => (
          <div
            key={item.id}
            className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition border"
          >
            {/* HEADER */}
            <div className="border-b pb-3 mb-3">
              <h2 className="text-lg font-semibold text-slate-800">
                {item.jobTitle}
              </h2>
              <p className="text-sm text-gray-500">{item.department}</p>
            </div>

            {/* DESCRIPTION */}
            <p className="text-sm text-gray-600 mb-3 line-clamp-3">
              {item.description}
            </p>

            {/* DETAILS */}
            <div className="space-y-1 text-sm text-gray-700">
              <p><span className="font-medium text-gray-500">Experience:</span> {item.yearOfExperience} yrs</p>
              <p><span className="font-medium text-gray-500">Vacancy:</span> {item.vacancy}</p>
              <p><span className="font-medium text-gray-500">Location:</span> {item.location}</p>
              <p><span className="font-medium text-gray-500">Type:</span> {item.jobType}</p>
            </div>

            {/* FOOTER */}
            <div className="mt-4 flex justify-between items-center">
              <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">
                {item.reqType}
              </span>

              <span
                className={`text-xs px-2 py-1 rounded ${item.status === "pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-green-100 text-green-700"
                  }`}
              >
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </>
  );
}

export default AdminDashboard;