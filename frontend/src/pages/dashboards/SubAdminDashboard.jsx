import React, { useContext, useEffect, useState } from "react";
import { useNotification } from "../../context/NotificationContextProvider";
import NotificationModal from "../../modals/NotificationModel";
import NotificationBell from "../../utils/NotificationBell";
import { motion } from "framer-motion";
import Stepper from "../../utils/Stepper";
import JobModel from "../../modals/JobModal";
import { UpdateRequisitionContext, EmployeeLoginContext } from "../../context/TestContext";
import { reverseTransform } from '../../utils/dataFormatter'

import EmployeeModal from "../../modals/EmployeeModal";
import { useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import axios from "axios";
import { fetchRequisitionsApprovalsByEmpID } from "../../utils/fetchApprovedData";
import { FidgetSpinner } from "react-loader-spinner";
import { toast } from "react-toastify";
import { CgProfile } from "react-icons/cg";
import ProfileModal from "../../modals/ProfileModal";
// import { Hairball, HairballPreset } from 'react-loader-spinner/dist/beta';
const API_BACKEND_URL = import.meta.env.VITE_DOTNET_BACKEND_URL


function SubAdminDashboard() {


  const [requests, setRequests] = useState([]);
  const { setUpdateRequisitionData } = useContext(UpdateRequisitionContext);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [show, setShow] = useState(false)
  const [showModalOpen, setShowModelOpen] = useState(false)
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { loginInformation, requisitionInformation } = useContext(EmployeeLoginContext)
  const [tableData, setTableData] = useState([])
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);
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
    if (requisitionInformation && requisitionInformation.length > 0) {
      setRequests(reverseTransform(requisitionInformation));
    }
  }, [requisitionInformation]);

  const handleEdit = (row) => {
    setUpdateRequisitionData(row);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!loginInformation?.empID) return;

        const result = await fetchRequisitionsApprovalsByEmpID(loginInformation.empID);

        setTableData(result || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    loadData();
  }, [loginInformation?.empID, loading]);

  const mergeStatus = (oldData, newData) => {
    return oldData.map((item) => {
      const match = newData.find(
        (n) => n.requisitionID === item.id
      );

      return match
        ? { ...item, status: match.status }
        : item;
    });
  };

  const updateStatus = async (id, status) => {
    try {
      setLoading(true);

      if (id !== '') {
        console.log({
          requisitionID: id,
          nextEmpID: loginInformation?.irb,
          empID: loginInformation?.empID,
          previousStatus: status
        })
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
              ? { ...item, status: updatedStatus || status }
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

  const updatedData = mergeStatus(requests, tableData);


  // FILTER + SEARCH LOGIC
  const filteredRequests = updatedData?.map((data) => ({ ...data})).filter((r) => {
    const matchStatus = filter === "All" || r.status === filter;
    const matchSearch =
      r.name?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });


  const tearClick = function () {
    setShow(!show);
  }

  const stats = [
    { label: "Total", value: updatedData.length },
    {
      label: "Pending",
      value: updatedData.filter((r) => r.status === "pending").length,
    },
    {
      label: "Approved",
      value: updatedData.filter((r) => r.status === "approved").length,
    },
    {
      label: "Rejected",
      value: updatedData.filter((r) => r.status === "rejected").length,
    },
  ];

  

const data = [
  {
    "stepType": "Requisition Created",
    "requisitionId": "1b76491e-1b77-48aa-b1db-b16d1592d8cc",
    "actionBy": "SURYA PRATAP SINGH",
    "status": "pending",
    "date": "2026-04-18T18:00:08.8602255"
  },
  {
    "stepType": "Approval Step",
    "requisitionId": "1b76491e-1b77-48aa-b1db-b16d1592d8cc",
    "actionBy": "Mohammad  Haris",
    "nextApprover": "Munjal Girishchandra Shroff",
    "status": "approve",
    "rawStatus": "pending",
    "date": "2026-04-24T17:25:22.7265327"
  },
  {
    "stepType": "Approval Step",
    "requisitionId": "1b76491e-1b77-48aa-b1db-b16d1592d8cc",
    "actionBy": "Munjal Girishchandra Shroff",
    "nextApprover": "Anuj Kumar Singh",
    "status": "cancelled",
    "rawStatus": "rejected",
    "date": "2026-04-25T10:47:32.9314097"
  }
]


  const filters = ["All", "pending", "approved", "rejected"];

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* SIDEBAR */}
      <aside className="w-64 bg-[#0f172a] text-white hidden md:flex flex-col">
        <div className="p-5 text-xl font-light border-b border-gray-700 uppercase">
          SubAdmin Dashboard
        </div>

        <nav className="flex-1 p-4 space-y-3 text-sm">
          <div onClick={() => setProfileModelShow(!profileModelShow)} className={`flex items-center gap-2 hover:text-white cursor-pointer`}>
            <CgProfile /> <span className={`${profileModelShow ? "scale-110 text-purple-300 font-bold" : ""}`}>{!profileModelShow ? "Profile" : "Close Profile"}</span>
          </div>
          <p className="hover:bg-gray-700 p-2 rounded cursor-pointer">Your IRB Approvals</p>
          <p className="hover:bg-gray-700 p-2 rounded cursor-pointer">Your IRB Rejects</p>
          <p className="hover:bg-gray-700 p-2 rounded cursor-pointer">Settings</p>
          <p className="hover:bg-gray-700 p-2 rounded cursor-pointer" onClick={() => { dispatch(logout()) }}>Logout</p>
        </nav>
      </aside>

      <div className={`${profileModelShow ? "w-full" : ""}`}>
        {profileModelShow && (<ProfileModal employeeData={loginInformation} />)}
      </div>

      {/* MAIN */}
      <div className={`${!profileModelShow ? "w-full" : ""}`}>
        {!profileModelShow && (
          <main className="flex-1 flex flex-col">

            {/* TOP BAR */}
            <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
              <div className="flex flex-col justify-center items-center gap-3">
                <h1 className="font-light uppercase text-3xl">Welcome, {loginInformation?.empName}</h1>
                <span className="font-light uppercase text-sm">Location, {loginInformation?.companyLocation}</span>
                <button onClick={tearClick} className=" bg-slate-800 text-white rounded-lg hover:shadow-md hover:shadow-slate-800 p-2  hover:bg-white transition-all duration-300 text-xl font-light hover:text-slate-800 flex items-center justify-center">Requisition Status</button>
              </div>
              <div className="flex items-center gap-3">


                <div className="p-6 ">

                  {/* TOP BAR */}
                  <div className="flex justify-between items-center gap-6">
                    <div className="w-9 h-9 uppercase rounded-full bg-pink-900 text-white flex items-center justify-center">
                      {loginInformation?.empName?.slice(0, 2)}
                    </div>

                    <NotificationBell />
                  </div>

                  {/* MODAL */}
                  <NotificationModal
                    data={selected}
                    onClose={() => setSelected(null)}
                  />

                </div>
              </div>
            </header>

            <div className={`${show ? "p-4 my-4" : ""}`}>
              {show ? <h1 className="text-3xl text-gray-800 mb-6 uppercase font-light">Track Requisition </h1> : ''}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`${show ? 'h-full mt-2 bg-green-100 rounded-lg border-2 border-green-900' : ''}`}>
                {show ? <div className="p-2 md:p-6">
                  <Stepper data={data} />
                  
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
              {/* TABLE */}
              <div className="bg-white shadow rounded-xl overflow-hidden mt-6">

                {/* HEADER */}
                <div className="p-4 border-b flex flex-col md:flex-row md:justify-between md:items-center gap-3">
                  <h2 className="font-light text-xl md:text-2xl">
                    Requisition Approvals
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
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${r.status === "approved"
                              ? "bg-green-100 text-green-700"
                              : r.status === "rejected"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                              }`}>
                              {r.status}
                            </span>
                          </td>


                          <td className="p-3 flex gap-2 justify-center mt-5">
                            <button
                              onClick={() => updateStatus(r.id, "approved")}
                              className={`${r.status === 'rejected' || r.status === 'approved' ? "bg-gray-200 text-xs px-2 py-1 text-slate-500" : "bg-green-600 text-white text-xs py-1 px-2 rounded"}`}
                              disabled={r.status === 'rejected' || r.status === 'approved'}
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
                              disabled={r.status === 'rejected' || r.status === 'approved'}
                              className={`${r.status === 'rejected' || r.status === 'approved' ? "bg-gray-200 text-xs px-2 py-1 text-slate-500" : "bg-red-600 text-white text-xs py-1 px-2 rounded"}`}
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
                              className={`${r.status === 'rejected' || r.status === 'approved' ? "bg-gray-200 text-xs px-2 py-1 text-slate-500" : "bg-orange-600 text-white text-xs py-1 px-2 rounded"} flex gap-3 justify-center items-center`}
                              disabled={r.status === 'rejected' || r.status === 'approved'}
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
                          onClick={() => { /*updateStatus(r.id, "view");*/ setShowModelOpen(true); setUpdateRequisitionData(filteredRequests[idx]) }}
                          className="bg-blue-600 text-white text-xs py-2 rounded"
                        >
                          Show
                        </button>

                      </div>

                    </div>
                  ))}

                </div>

              </div>
            </div>
          </main>)}
      </div>
    </div>
  );
}

export default SubAdminDashboard;