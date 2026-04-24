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
import { current } from "@reduxjs/toolkit";
// import { Hairball, HairballPreset } from 'react-loader-spinner/dist/beta';
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
  const { loginInformation, requisitionStatusUpdateInformation, setRequisitionStatusUpdateInformation, requisitionInformation } = useContext(EmployeeLoginContext)
  const [tableData, setTableData] = useState([])
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);
  const [loadingId, setLoadingId] = useState(null);
  const [requisitionNextStatusUpdateTableData, setRequisitionNextStatusUpdateTableData] = useState([])

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
  }, [loginInformation, requisitionInformation]);

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

  // const latestData = Object.values(
  //   requisitionStatusUpdateInformation.reduce((acc, item) => {

  //     const existing = acc[item.requisitionID];

  //     if (
  //       !existing ||
  //       new Date(item.createdAt) > new Date(existing.createdAt)
  //     ) {
  //       acc[item.requisitionID] = item;
  //     }

  //     return acc;
  //   }, {})
  // );


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

  console.log("Different users requisition", filteredRequests)
  console.log("Different users requisition and approved", requisitionStatusUpdateInformation)

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

  const requisition = {
    id: 1,
    title: "PLC Designer requisition",
    status: "pending", // overall status
    createdBy: "Ashish Sharma",
    steps: [
      {
        id: 1,
        name: "Mr. Surya",
        role: "Requester",
        status: "confirmed",
        date: "2026-04-10",
      },
      {
        id: 2,
        name: "Mhd. Harish",
        role: "Reviewer",
        status: "confirmed",
        date: "2026-04-10",
      },
      {
        id: 3,
        name: "Arpana",
        role: "Reviewer",
        status: "confirmed",
        date: "2026-07-10",
      },
      {
        id: 4,
        name: "Anuj",
        role: "Approver",
        status: "pending",
        date: null,
      },
    ],
  };

  const filters = ["All", "pending", "approved", "rejected"];

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* SIDEBAR */}
      <aside className="w-64 bg-[#0f172a] text-white hidden md:flex flex-col">
        <div className="p-5 text-xl font-light border-b border-gray-700 uppercase">
          Upper Admin Dashboard
        </div>

        <nav className="flex-1 p-4 space-y-3 text-sm">
          <p className="hover:bg-gray-700 p-2 rounded cursor-pointer">Profile</p>
          <p className="hover:bg-gray-700 p-2 rounded cursor-pointer">Approvals</p>
          <p className="hover:bg-gray-700 p-2 rounded cursor-pointer">Settings</p>
          <p className="hover:bg-gray-700 p-2 rounded cursor-pointer" onClick={() => { dispatch(logout()) }}>Logout</p>
        </nav>
      </aside>

      {/* MAIN */}
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
                  {requisitionStatusUpdateInformation.map(item => {
                    const group = requisitionStatusUpdateInformation.filter(
                      r => r.currentApprover === item.nextApprover
                    );

                    const isApproved = group.some(g => g.currentApprover === item.nextApprover);

                    return {
                      ...item,
                      currentStatus: isApproved ? "approved" : item.currentStatus
                    };
                  }).map((r, idx) => {

                    console.log(r)
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
        </div>
      </main>
    </div>
  );
}

export default UpperAdminDashboard;