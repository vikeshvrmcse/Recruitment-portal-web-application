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
import { fetchRequisitionsApprovalsByEmpID } from "../../utils/FetchApprovedData";
import { FidgetSpinner } from "react-loader-spinner";
import { toast } from "react-toastify";
import ProfileModal from "../../modals/ProfileModal";
import { CgMenuGridR, CgProfile } from "react-icons/cg";
import { RiLogoutCircleLine, RiSettings5Fill } from "react-icons/ri";
import { FaCheckDouble } from "react-icons/fa";



const API_BACKEND_URL = import.meta.env.VITE_DOTNET_BACKEND_URL


function SubAdminDashboard() {

  const [profileModelShow, setProfileModelShow] = useState(false)
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
  const [requisitionUpdateId, setUpdateRequisitionId] = useState("")
  const [showSidebar, setShowSidebar] = useState(false);
  const { requisitionApprovalData, refetch } = useContext(GetApprovalDataContext)
  const [stepperData, setStepperData] = useState('');
  const [isCreateRequisition, setIsCreateRequisition] = useState(false);
  const [showFinalDataComponent, setShowFinalDataComponent] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [finalApprovalData, setFinalApprovalData] = useState([])

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
          //debugger
          // const responseNew = await axios.post(`${API_BACKEND_URL}/SubAdminAproval/approve?reqId=${id}&userId=${loginInformation?.empID}`);
          let responseNew;

          if (status === "approved") {
            responseNew = await axios.post(`${API_BACKEND_URL}/approval/approve/`, { requisitionId: id, empId: loginInformation?.empID });
            // Second API call directly here
            // await axios.post(`${API_BACKEND_URL}/SubAdminAproval/create`, {
            await axios.post(`${API_BACKEND_URL}/approval/create/`, {
              empId: loginInformation?.irb,
              requisitionId: id,
              stepOrder: responseNew.data?.stepOrder + 1,
              status: "pending",
              remarks: "Everything OK",
            });
          }
          if (status === "rejected") {
            responseNew = await axios.post(`${API_BACKEND_URL}/approval/reject/`, { requisitionId: id, empId: loginInformation?.empID });
          }


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


  useEffect(() => {
    const fetch = async () => {

      try {
        const response = await axios.get(`${API_BACKEND_URL}/FinalApproval`)
        console.log(response?.data.data)
        setFinalApprovalData(response.data?.data)
        await refetch()
      } catch (error) {
        console.log(error.data.message)
      }
    }
    fetch()
  }, [loginInformation?.empID])


  const tearClick = function () {
    setShow(!show);
  }


  console.log(finalApprovalData)

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
    console.log(data)
    setUpdateRequisitionData(data)
  }

  const handleDelete = async (id) => {

    try {

      const confirmed = window.confirm(
        "Confirm to delete this data?"
      );

      if (confirmed) {

        const deleteResponse = await axios.delete(
          // `${API_BACKEND_URL}/Requisition/DeleteRequisition/${id}`
          `${API_BACKEND_URL}/requisition/delete/${id}/`
        );

        toast.success(deleteResponse.data?.message);

        await reloadPage();
      }

    } catch (error) {

      toast.error(error.response?.data?.message || error.message);
    }
  };


  const result = filterData(requisitionApprovalData, filter);

  const hasCreated = result.some(
    (r) => r.status === "created"
  );
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">

      {/* SIDEBAR TOGGLE BUTTON (mobile only) */}
      <div className="md:hidden p-4 bg-pink-950 text-white flex justify-end">
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="rounded-full shadow-md hover:scale-110 shadow-white border-x-4 transition-all duration-300 m-1 p-4"
        >
          <CgMenuGridR />
        </button>
      </div>

      {/* SIDEBAR */}
      <aside
        className={`w-64  bg-[#3E0703] text-[#FFF0C4] flex flex-col fixed md:static top-0 left-0 transition-transform duration-300 md:translate-x-0 ${showSidebar ? "translate-x-0 h-full" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="p-5 text-xl font-light border-b border-gray-700 uppercase">
          SubAdmin Dashboard
        </div>

        <nav className="flex justify-start flex-col p-4 space-y-3 text-lg">

          <div
            onClick={() => setActiveTab("dashboard")}
            className="flex  px-4 py-2 items-center gap-2 hover:text-white cursor-pointer"
          >
            <CgProfile />
            <span className={`${activeTab === 'dashboard' ? "scale-110 text-purple-300 font-bold" : ""}`}>
              {activeTab === 'dashboard' ? "Dashboard" : "Close Dashboard"}
            </span>
          </div>

          <div
            onClick={() => setActiveTab('profile')}
            className="flex  px-4 py-2 items-center gap-2 hover:text-white cursor-pointer"
          >
            <CgProfile />
            <span className={`${activeTab === 'profile' ? "scale-110 text-purple-300 font-bold" : ""}`}>
              {activeTab === 'profile' ? "Profile" : "Close Profile"}
            </span>
          </div>

          <div className="flex flex-col items-start gap-3">

            <p className="hover:bg-gray-700 rounded px-4 py-2 cursor-pointer flex  justify-center items-center gap-2" onClick={() => setActiveTab('final')}><FaCheckDouble /> Final Approvals</p>
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

      {/* <div className={`w-full`}> */}
      {activeTab === 'profile' && (<ProfileModal employeeData={loginInformation} />)}
      {/* </div>
      <div className={`w-full`}> */}
      {activeTab === 'final' && (<FinalApprovalModal finalData={finalApprovalData} />)}
      {/* </div> */}


      {/* MAIN */}
      {/* <div className={`w-full`}> */}
      {activeTab === 'dashboard' && (
        <main className="flex-1 flex flex-col">

          {/* TOP BAR */}
          <header className=" bg-[#3E0703] border-l-4 text-[#FFF0C4] shadow px-6 py-4 flex justify-between items-center">
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
                <div className="bg-white shadow rounded-lg mt-2 p-4 mb-2">

                </div>
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
                {stats && stats?.map((s, i) => (
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
                  {/* <JobModel requisitionId={"NA"} key={isCreateRequisition ? "open" : "closed"} close={isCreateRequisition} setClose={setIsCreateRequisition} differentOperationUrl={"https://localhost:7073/api/Requisition"} operationMode={"create"} /> */}
                  <JobModel requisitionId={"NA"} key={isCreateRequisition ? "open" : "closed"} close={isCreateRequisition} setClose={setIsCreateRequisition} differentOperationUrl={`${API_BACKEND_URL}/requisition/create/`} operationMode={"create"} />

                </div>
              </div>
            )}

            {open && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
                <div className="w-full max-w-5xl">
                  {/* <JobModel requisitionId={requisitionUpdateId} close={open} setClose={setOpen} modelTitleModification={"Modify requisition via your superviser"} differentOperationUrl={"https://localhost:7073/api/SubAdminAproval"} operationMode={"update"} /> */}
                  <JobModel requisitionId={requisitionUpdateId} key={open ? "open" : "closed"} close={open} setClose={setOpen} differentOperationUrl={`${API_BACKEND_URL}/update-requisition/`} operationMode={"update"} />

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
              <div className="p-4 border-b  bg-[#3E0703] text-[#FFF0C4]  flex flex-col md:flex-row md:justify-between md:items-center gap-3">
                <h2 className="font-light text-xl md:text-2xl">
                  Requisition Approvals
                </h2>
                <button className="w-full md:w-auto px-4 bg-slate-800 text-white py-2 rounded-lg hover:bg-white hover:text-slate-800 transition border border-slate-800">
                  Generate Report
                </button>
              </div>

              {/* SEARCH + FILTER */}
              <div className="p-4 border-b bg-[#3E0703] flex flex-col md:flex-row gap-3 md:items-center md:justify-between">

                {/* SEARCH */}
                {/* <input
                    type="text"
                    placeholder="Search candidate name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border px-3 py-2 rounded w-full md:w-1/3"
                  /> */}

                {/* FILTERS */}
                <div className="flex flex-wrap gap-2 ">
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
                  <thead className="bg-[#3E0703] text-[#FFF0C4]">
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
                      <th className="p-3 text-center">Track Requisition</th>
                      {hasCreated && <th className="p-3 text-center">Deleted</th>}
                    </tr>
                  </thead>

                  <tbody>
                    {result.map((r, idx) => (
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
                            className={`${r.status === 'rejected' || r.status === 'approved' || r.status === 'created' ? "bg-gray-200 text-xs px-2 py-1 text-slate-500" : "bg-green-600 text-white text-xs py-1 px-2 rounded"}`}
                            disabled={r.status === 'rejected' || r.status === 'approved' || r.status === 'created'}
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
                            disabled={r.status === 'rejected' || r.status === 'approved' || r.status === 'created'}
                            className={`${r.status === 'rejected' || r.status === 'approved' || r.status === 'created' ? "bg-gray-200 text-xs px-2 py-1 text-slate-500" : "bg-red-600 text-white text-xs py-1 px-2 rounded"}`}
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
                            className={`${r.status === 'rejected' || r.status === 'approved' || r.status === 'created' ? "bg-gray-200 text-xs px-2 py-1 text-slate-500" : "bg-orange-600 text-white text-xs py-1 px-2 rounded"}`}
                            disabled={r.status === 'rejected' || r.status === 'approved' || r.status === 'created'}
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

                        {r.status === 'created' && <td className="p-3">
                          <button

                            onClick={() => { handleDelete(requisitionApprovalData[idx].requisitionID) }}
                            className="px-3 py-1 text-xs rounded bg-blue-950 text-white"
                          >
                            Delete
                          </button>
                        </td>
                        }
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ================= MOBILE CARD VIEW ================= */}
              <div className="md:hidden p-4 space-y-4">
                {requisitionApprovalData?.map((r, idx) => (
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
                        className={`${r.status === 'rejected' || r.status === 'approved' || r.status === 'created' ? "bg-gray-200 text-xs px-2 py-1 text-slate-500" : "bg-green-600 text-white text-xs py-1 px-2 rounded"}`}
                        disabled={r.status === 'rejected' || r.status === 'approved' || r.status === 'created'}
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
                        disabled={r.status === 'rejected' || r.status === 'approved' || r.status === 'created'}
                        className={`${r.status === 'rejected' || r.status === 'approved' || r.status === 'created' ? "bg-gray-200 text-xs px-2 py-1 text-slate-500" : "bg-red-600 text-white text-xs py-1 px-2 rounded"}`}
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
                        onClick={() => { setOpen(true); handleEdit(requisitionApprovalData[idx].requisitionDetails) }}
                        className={`${r.status === 'rejected' || r.status === 'approved' || r.status === 'created' ? "bg-gray-200 text-xs px-2 py-1 text-slate-500" : "bg-orange-600 text-white text-xs py-1 px-2 rounded"}`}
                        disabled={r.status === 'rejected' || r.status === 'approved' || r.status === 'created'}
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

                          onClick={() => { handleDelete(requisitionApprovalData[idx].requisitionID) }}
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
    // </div>
  );
}

const FinalApprovalModal = ({ finalData = [] }) => {
  const [seenData, setSeenData] = useState([])
  const [selectedHR, setSelectedHR] = useState("HR1");
  const storedUser = localStorage.getItem("auth");
  const user = JSON.parse(storedUser);
  const sendToBelowHrClick = async (apprId, reqId, assgnToId) => {
    try {
      // console.log(apprId, reqId, assgnToId)
      // const seenResponse = await axios.post(`${API_BACKEND_URL}/FinalApproval/FinalHRAction`,
      const seenResponse = await axios.post(`${API_BACKEND_URL}/personal_assitant_action/hr_action/`,
        {
          approvalID: apprId,
          requisitionID: reqId,
          assignedByEmpID: user?.empID,
          assignedToEmpID: assgnToId,
        })
      toast.success(seenResponse.data?.message)
    } catch (error) {
      console.log(error.message)
    }
  }

  const [data, setData] = useState([])
  useEffect(() => {
    const fetch = async () => {

      try {
        const response = await axios.get(`${API_BACKEND_URL}/FinalApproval/`)
        console.log(response?.data.data)
        setData(response.data?.data)
        // await refetch()
        // toast.success("All")
      } catch (error) {
        // console.log(error.data.message)
      }
    }
    fetch()
  }, [user?.empID])

  return (<div className="p-6 w-full bg-gray-100 min-h-screen">


    <div className="flex justify-between">
      <h2 className="w-full bg-amber-950 text-amber-100 p-3 text-3xl text-left font-light my-3">
        FINAL APPROVALS
      </h2>

      <div className="flex">
        <button className="cursor-pointer bg-sky-950 text-amber-100 p-3 text-3xl font-light my-3 focus:text-amber-950 focus:bg-amber-100">
          FILTERS
        </button>

        <button className="cursor-pointer bg-amber-950 text-amber-100 p-3 text-3xl font-light my-3 focus:text-amber-950 focus:bg-amber-100">
          HR1
        </button>

        <button className="cursor-pointer bg-amber-950 text-amber-100 p-3 text-3xl font-light my-3 focus:text-amber-950 focus:bg-amber-100">
          HR2
        </button>

        <button className="cursor-pointer bg-amber-950 text-amber-100 p-3 text-3xl font-light my-3 focus:text-amber-950 focus:bg-amber-100">
          HR3
        </button>
      </div>
    </div>
    {/* FILTER BUTTONS */}


    {/* CARD GRID */}
    <div className="grid md:grid-cols-1 lg:grid-cols-4 gap-6">

      {data?.map((item, index) => {

        const created = new Date(item.createdAt).toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "short"
        });

        const updated = new Date(item.updatedAt).toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "short"
        });

        const deadline = new Date(item?.requisititionDeadline).toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "short"
        });

        return (
          <div
            key={index}
            className={`${item?.seen == false ? 'bg-white' : 'bg-green-100'} rounded-2xl shadow-lg p-6 border-l-4 border-purple-700  transition-all duration-300`}
          >
            {/* HEADER */}
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-gray-800">
                {item?.requisitionTitle}
              </h2>

              <h2 className="text-lg font-semibold text-gray-800">
                {item?.seen == false ? "" : `Seened By ${item?.assignedToEmpID}`}
              </h2>

              <h2 className="text-md text-gray-800">
                {item?.creatorName}
              </h2>

              <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 font-semibold">
                {item.status && item.status[0].toUpperCase() + item.status.substring(1)}
              </span>
            </div>

            {/* BODY */}
            <div className="space-y-2 text-sm text-gray-600">

              <p>
                <span className="font-semibold text-gray-800">Approved By:</span>{" "}
                {item.verifierName}
              </p>

              <p>
                <span className="font-semibold text-gray-800">RFQ Date:</span>{" "}
                {created}
              </p>

              <p>
                <span className="font-semibold text-gray-800">Approved Date:</span>{" "}
                {updated}
              </p>

              <p>
                <span className="font-semibold text-gray-800">Deadline Date:</span>{" "}
                {deadline}
              </p>

            </div>

            {/* FOOTER */}
            <div className="flex flex-col items-center gap-4 mb-2 bg-amber-100  rounded-lg justify-center mt-4">
              <div className="w-full text-center rounded-md  bg-amber-950">
                <span className="font-light uppercase text-amber-100 text-2xl text-center cursor-default">send to</span>
              </div>

              <div className="flex flex-col w-full p-4 items-center gap-4 justify-center">
                <button
                  disabled={item?.mainId === "" ? false : true}
                  onClick={() => { sendToBelowHrClick(item.approvalID, item?.requisitionID, "PMA0376") }}
                  className={`px-5 py-2 mx-3 rounded-md shadow-md ${item?.mainId === "" ? "" : "bg-slate-400 text-slate-600"} transition-all duration-300 w-full bg-amber-700 text-white scale-105`}
                >
                  {"MR. KULDEEP"}
                </button>
                <button
                  disabled={item?.mainId === "" ? false : true}
                  onClick={() => { sendToBelowHrClick(item.approvalID, item?.requisitionID, "PMA0638") }}
                  className={`px-5 py-2 mx-3 rounded-md ${item?.mainId === "" ? "" : "bg-slate-400 text-slate-600"} shadow-md transition-all duration-300 w-full bg-amber-700 text-white scale-105`}
                >
                  {"MR. CHANDAN"}
                </button>
                <button
                  disabled={item?.mainId === "" ? false : true}
                  onClick={() => { sendToBelowHrClick(item.approvalID, item?.requisitionID, "PMA0608") }}
                  className={`px-5 py-2 mx-3 rounded-md ${item?.mainId === "" ? "" : "bg-slate-400 text-slate-600"} shadow-md transition-all duration-300 w-full bg-amber-700 text-white scale-105`}
                >
                  {"MS. HEENA"}
                </button>

              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>)
}

export default SubAdminDashboard;