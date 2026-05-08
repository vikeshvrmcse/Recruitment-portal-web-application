import React, { useContext, useEffect, useState } from "react";
import { useNotification } from "../../context/NotificationContextProvider";
import NotificationModal from "../../modals/NotificationModel";
import NotificationBell from "../../utils/NotificationBell";
import { motion } from "framer-motion";
import Stepper from "../../utils/Stepper";
import JobModel from "../../modals/JobModal";
import { UpdateRequisitionContext, EmployeeLoginContext, GetApprovalDataContext } from "../../context/TestContext";
import { reverseTransform } from '../../utils/dataFormatter'

import EmployeeModal from "../../modals/EmployeeModal";
import { useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import axios from "axios";
import { fetchRequisitionsApprovalsByEmpID } from "../../utils/fetchApprovedData";
import { FidgetSpinner } from "react-loader-spinner";
import { toast } from "react-toastify";
import { current } from "@reduxjs/toolkit";
import ProfileModal from "../../modals/ProfileModal";
import { CgProfile } from "react-icons/cg";
import { FaCheckDouble } from "react-icons/fa";
import { RiLogoutCircleLine, RiSettings5Fill } from "react-icons/ri";

const API_BACKEND_URL = import.meta.env.VITE_DOTNET_BACKEND_URL


function UpperAdminDashboard() {


  const [requests, setRequests] = useState([]);
  const { setUpdateRequisitionData } = useContext(UpdateRequisitionContext);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [show, setShow] = useState(false)
  const [showModalOpen, setShowModelOpen] = useState(false)
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { loginInformation, requisitionInformation, reloadPage } = useContext(EmployeeLoginContext)
  const [tableData, setTableData] = useState([])
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);
  const [loadingId, setLoadingId] = useState(null);
  const [requisitionNextStatusUpdateTableData, setRequisitionNextStatusUpdateTableData] = useState([])
  const [profileModelShow, setProfileModelShow] = useState(false)
  const [isCreateRequisition, setIsCreateRequisition] = useState(false);
  const [stepperData, setStepperData] = useState('')
  const { requisitionApprovalData, refetch } = useContext(GetApprovalDataContext)
  const [requisitionUpdateId, setUpdateRequisitionId] = useState("")
  const [created, setCreated] = useState('')


  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
  }



  const updateStatus = async (id, status) => {
    try {
      setLoading(true);
      if (id !== '') {
        setUpdateRequisitionId(id)


        try {
          // debugger
          const responseNew = await axios.post(`${API_BACKEND_URL}/SubAdminAproval/approve?reqId=${id}&userId=${loginInformation?.empID}`);

          // Second API call directly here
          await axios.post(`${API_BACKEND_URL}/SubAdminAproval/create`, {
            empID: loginInformation?.irb,
            requisitionID: id,
            stepOrder: responseNew.data?.stepOrder + 1,
            status: "pending",
            remarks: "Everything OK",
          });

          toast.success(responseNew?.data.message);
          await refetch()
        } catch (error) {
          console.error(error);
          toast.error("Something went wrong");
        }
      }

    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false);
    }


  };





  const tearClick = function () {
    setShow(!show);
  }

  const stats = [
    { label: "Total", value: requisitionApprovalData.length },
    {
      label: "Pending",
      value: requisitionApprovalData.filter((r) => r.status === "pending").length,
    },
    {
      label: "Approved",
      value: requisitionApprovalData.filter((r) => r.status === "approved").length,
    },
    {
      label: "Rejected",
      value: requisitionApprovalData.filter((r) => r.status === "rejected").length,
    },
  ];



  const filters = ["All", "pending", "approved", "rejected"];

  const filterData = (data, activeFilter) => {
    if (activeFilter === "All") return data;

    return data.filter(item =>
      item.status?.toLowerCase() === activeFilter.toLowerCase()
    );
  };


  const handleEdit = async (data) => {
    setUpdateRequisitionData(data)
  }


  const result = filterData(requisitionApprovalData, filter);

  const handleDelete = async (id) => {

    try {

      const confirmed = window.confirm(
        "Confirm to delete this data?"
      );

      if (confirmed) {

        const deleteResponse = await axios.delete(
          `${API_BACKEND_URL}/Requisition/DeleteRequisition/${id}`
        );

        toast.success(deleteResponse.data?.message);

        await reloadPage();
      }

    } catch (error) {

      toast.error(error.response?.data?.message || error.message);
    }
  };


  const hasCreated = result.some(
    (r) => r.status === "created"
  );

  console.log(hasCreated)
  console.log(result)

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* SIDEBAR */}
      <aside className="w-64 bg-[#3E0703] text-[#FFF0C4]  hidden md:flex flex-col">
        <div className="p-5 text-xl font-light border-b border-gray-700 uppercase">
          Upper Admin Dashboard
        </div>

        <nav className="flex justify-start flex-col p-4 space-y-3 text-lg">
          <div
            onClick={() => setProfileModelShow(!profileModelShow)}
            className="flex  px-4 py-2 items-center gap-2 hover:text-white cursor-pointer"
          >
            <CgProfile />
            <span className={`${profileModelShow ? "scale-110 text-purple-300 font-bold" : ""}`}>
              {!profileModelShow ? "Profile" : "Close Profile"}
            </span>
          </div>

          <div className="flex flex-col items-start gap-3">

            <p className="hover:bg-gray-700 rounded px-4 py-2 cursor-pointer flex  justify-center items-center gap-2"><FaCheckDouble /> Final Approvals</p>
            <p className="hover:bg-gray-700 rounded  px-4 py-2 cursor-pointer flex  justify-center items-center gap-2"><RiSettings5Fill /> Settings</p>
            <p
              className="hover:bg-gray-700 rounded  px-4 py-2 cursor-pointer flex justify-center items-center gap-2"
              onClick={() => dispatch(logout())}
            >
              <RiLogoutCircleLine /> Logout
            </p>

          </div>
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
            <header className="bg-[#3E0703] text-[#FFF0C4] border-l-4 shadow px-6 py-4 flex justify-between items-center">
              <div className="flex flex-col justify-center items-center gap-3">
                <h1 className="font-light uppercase text-3xl">Welcome, {loginInformation?.empName}</h1>
                <span className="font-light uppercase text-sm">Location, {loginInformation?.companyLocation}</span>
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
                  <button onClick={() => setIsCreateRequisition(true)} className="mt-3 text-xl font-light bg-green-900 border-2 border-green-800 hover:border-green-400 focus:border-dotted p-2 rounded-md hover:shadow-md hover:shadow-green-700">+ New Requisition</button>

                </div>
              </div>
            </header>

            <div className={`${show ? "p-4 my-4" : ""}`}>
              {show ? <h1 className="text-3xl text-gray-800 mb-6 uppercase font-light">Track Requisition </h1> : ''}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`${show ? 'h-full mt-2 bg-[#FFF0C4] rounded-lg border-4 border-dotted border-green-900' : ''}`}>
                {show ? <div className="p-2 md:p-6">

                  <div className="flex justify-between items-center p-4 bg-amber-950 text-amber-100">

                    <h2 className="text-xl font-bold mb-6 text-amber-100">
                      Requisition Tracking
                    </h2>
                    <button onClick={tearClick} className=" bg-slate-800 text-white rounded-lg hover:shadow-md hover:shadow-slate-800 p-2  hover:bg-white transition-all duration-300 text-xl font-light hover:text-slate-800 flex items-center justify-center">Close</button>
                  </div>
                  <Stepper data={stepperData} />

                </div> : ""}
              </motion.div>
            </div>

            <div className="p-6">
              <div className="text-[#3E0703] bg-[#FFF0C4] border-x-8 border-[#3E0703] p-4 rounded-lg my-4">
                <h1 className="mb-4 font-light text-2xl ">
                  Requisition Statistics
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

              {isCreateRequisition && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
                  <div className="w-full max-w-5xl">
                    <JobModel requisitionId={"NA"} key={isCreateRequisition ? "open" : "closed"} close={isCreateRequisition} setClose={setIsCreateRequisition} differentOperationUrl={"https://localhost:7073/api/Requisition"} operationMode={"create"} />
                  </div>
                </div>
              )}

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
                <div className="p-4 bg-[#3E0703] text-[#FFF0C4] border-b flex flex-col md:flex-row md:justify-between md:items-center gap-3">
                  <h2 className="font-light text-xl md:text-2xl">
                    All requisitions to approving for you
                  </h2>
                  <button className="w-full md:w-auto px-4 bg-slate-800 text-white py-2 rounded-lg hover:bg-white hover:text-slate-800 transition border border-slate-800">
                    Generate Report
                  </button>
                </div>

                {/* SEARCH + FILTER */}
                <div className="p-4 bg-[#3E0703] border-b flex flex-col md:flex-row gap-3 md:items-center md:justify-between">

                  {/* SEARCH */}
                  {/* <input
                    type="text"
                    placeholder="Search candidate name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border px-3 py-2 rounded w-full md:w-1/3"
                  /> */}

                  {/* FILTERS */}
                  <div className="flex flex-wrap gap-2">
                    {filters.map((f, idx) => (
                      <button
                        key={idx}
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
                  <table className="w-full text-sm text-center">
                    <thead className="bg-[#3E0703] text-[#FFF0C4]">
                      <tr>
                        <th className="p-3 text-center">RFQ Name</th>
                        <th className="p-3 text-center">Designation</th>
                        <th className="p-3 text-center">Department</th>
                        <th className="p-3 text-center">Profile(Job Title) </th>
                        <th className="p-3 text-center">Date of RFQ </th>
                        <th className="p-3 text-center">Date of Deadline</th>
                        <th className="p-3 text-center">Previous Status</th>

                        <th className="p-3 text-center">Action</th>
                        <th className="p-3 text-center">Modification</th>
                        <th className="p-3 text-center">View</th>
                        <th className="p-3 text-center">Track Requisition</th>
                        {hasCreated && <th className="p-3 text-center">Deleted</th>}
                      </tr>
                    </thead>


                    <tbody>
                      {result.map((r, idx) => {

                        

                        return (
                          <tr key={idx} className="border-b hover:bg-gray-50 text-center">

                            <td className="p-3 font-medium">{r?.creator?.empName}</td>
                            <td className="p-3 font-medium">{r?.creator?.designation}</td>
                            <td className="p-3 text-gray-600">{r?.creator?.dept}</td>
                            <td className="p-3 text-gray-600">{r?.requisitionDetails?.jobTitle}</td>
                            <td className="p-3 text-gray-600">{formatDate(r?.requisitionDetails?.createdAt?.split("T")[0])}</td>
                            <td className="p-3 text-gray-600">{formatDate(r?.requisitionDetails?.deadline?.split("T")[0])}</td>

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
                                onClick={() => updateStatus(r?.requisitionID, "approved")}
                                className={`${r.status === 'rejected' || r.status === 'approved' || r.status==='done' || hasCreated ? "bg-gray-200 text-xs px-2 py-1 text-slate-500" : "bg-green-600 text-white text-xs py-1 px-2 rounded"}`}
                                disabled={r.status === 'rejected' || r.status === 'approved' || r.status==='done'||r.status === 'created'}
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
                                onClick={() => updateStatus(r?.requisitionID, "rejected")}
                                disabled={r.status === 'rejected' || r.status === 'approved' || r.status==='done' || r.status === 'created'}
                                className={`${r.status === 'rejected' || r.status === 'approved' || r.status==='done' || r.status === 'created' ? "bg-gray-200 text-xs px-2 py-1 text-slate-500" : "bg-red-600 text-white text-xs py-1 px-2 rounded"}`}
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
                                onClick={() => { setOpen(true); handleEdit(requisitionApprovalData[idx].requisitionDetails); setUpdateRequisitionId(requisitionApprovalData[idx].requisitionID) }}
                                className={`${r.status === 'rejected' || r.status === 'approved' || r.status==='done' || r.status === 'created' ? "bg-gray-200 text-xs px-2 py-1 text-slate-500" : "bg-orange-600 text-white text-xs py-1 px-2 rounded"}`}
                                disabled={r.status === 'rejected' || r.status === 'approved' || r.status==='done' || r.status === 'created'}
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

                                onClick={() => { setShowModelOpen(true); setUpdateRequisitionData(requisitionApprovalData[idx]) }}
                                className="px-3 py-1 text-xs rounded bg-blue-600 text-white"
                              >
                                Show
                              </button>
                            </td>
                            <td className="p-3">
                              <button

                                onClick={() => { setShow(true); setStepperData(requisitionApprovalData[idx].requisitionID) }}
                                className="px-3 py-1 text-xs rounded bg-blue-950 text-white"
                              >
                                Track
                              </button>
                            </td>
                            {r.status==='created' && <td className="p-3">
                              <button

                                onClick={() => { handleDelete(requisitionApprovalData[idx].requisitionID) }}
                                className="px-3 py-1 text-xs rounded bg-blue-950 text-white"
                              >
                                Delete
                              </button>
                            </td>
                            }
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                {/* ================= MOBILE CARD VIEW ================= */}
                <div className="md:hidden p-4 space-y-4">
                  {result.map((r, idx) => (
                    <div key={idx} className="border rounded-lg p-4 shadow-sm bg-white">

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
                          onClick={() => updateStatus(r?.requisitionID, "approved")}
                          className={`${r.status === 'rejected' || r.status === 'approved' || r.status === 'created'  || r.status==='done' ? "bg-gray-200 text-xs px-2 py-1 text-slate-500" : "bg-green-600 text-white text-xs py-1 px-2 rounded"}`}
                          disabled={r.status === 'rejected' || r.status === 'approved' || r.status === 'created'  || r.status==='done'}
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
                          onClick={() => updateStatus(r?.requisitionID, "rejected")}
                          disabled={r.status === 'rejected' || r.status === 'approved' || r.status === 'created' || r.status==='done'}
                          className={`${r.status === 'rejected' || r.status === 'approved' || r.status === 'created' || r.status==='done' ? "bg-gray-200 text-xs px-2 py-1 text-slate-500" : "bg-red-600 text-white text-xs py-1 px-2 rounded"}`}
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

                        <button
                          onClick={() => { setOpen(true); handleEdit(requisitionApprovalData[idx].requisitionDetails); setUpdateRequisitionId(requisitionApprovalData[idx].requisitionID) }}
                          className={`${r.status === 'rejected' || r.status === 'approved' || r.status === 'created' || r.status==='done' ? "bg-gray-200 text-xs px-2 py-1 text-slate-500" : "bg-orange-600 text-white text-xs py-1 px-2 rounded"}`}
                          disabled={r.status === 'rejected' || r.status === 'approved' || r.status === 'created' || r.status==='done'}
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

                        <button

                          onClick={() => { setShowModelOpen(true); setUpdateRequisitionData(requisitionApprovalData[idx]) }}
                          className="px-3 py-1 text-xs rounded bg-blue-600 text-white"
                        >
                          Show
                        </button>

                        <button

                          onClick={() => { setShow(true); setStepperData(requisitionApprovalData[idx].requisitionID) }}
                          className="px-3 py-1 text-xs rounded bg-blue-950 text-white"
                        >
                          Track
                        </button>


                        {r.status === 'created' &&
                          <button

                            onClick={() => {handleDelete(requisitionApprovalData[idx].requisitionID) }}
                            className="px-3 py-1 text-xs rounded bg-blue-950 text-white"
                          >
                            Delete
                          </button>

                        }
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

export default UpperAdminDashboard;