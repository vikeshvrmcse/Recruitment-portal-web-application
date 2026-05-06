import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import {
    FaUsers,
    FaBuilding,
    FaTimesCircle,
    FaBriefcase,
    FaCheckCircle,
    FaClock,
} from "react-icons/fa";
import { MdCancel, MdCreateNewFolder } from "react-icons/md";
import { MdPreview } from "react-icons/md";
import JobModel from "../../modals/JobModal";
import { CgProfile } from "react-icons/cg";
import { RiLogoutCircleLine } from "react-icons/ri";
import Stepper from "../../utils/Stepper";
import { EmployeeLoginContext, TestContext, UpdateRequisitionContext } from "../../context/TestContext";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import EmployeeModal from "../../modals/EmployeeModal";
import ProfileModal from "../../modals/ProfileModal";
function TLDashboard() {
    // const { requisitionData } = useContext(TestContext)
    const { loginInformation, requisitionApproveStatus, storeRequistionTrack } = useContext(EmployeeLoginContext)
    const { setUpdateRequisitionData } = useContext(UpdateRequisitionContext);
    const [showModalOpen, setShowModelOpen] = useState(false)
    const [profileModelShow, setProfileModelShow] = useState(false)
    const [stepperData, setStepperData] = useState('')
    const [show, setShow] = useState(false)
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();

    const tearClick = () => {
        setShow(!show);
    }

    const isNew = (date) => {
        const now = new Date();
        const created = new Date(date);
        const diffHours = (now - created) / (1000 * 60 * 60);
        return diffHours < 24; // within 24 hours = NEW
    };

    const statusStyles = {
        all: "bg-green-100 text-green-600",
        Created: "bg-blue-100 text-green-600",
        Approved: "bg-green-100 text-green-600",
        Pending: "bg-yellow-100 text-yellow-600",
        Cancel: "bg-red-100 text-red-600",
        // Done: "bg-blue-100 text-blue-600"
    };
    const [activeFilter, setActiveFilter] = useState("all");

    const filteredRequests = requisitionApproveStatus?.map((data) => ({ ...data, name: loginInformation?.empName, designation: loginInformation?.designation })).filter(
        (item) => (item.requisitionDetails.status || item.status) === activeFilter
    );

  

    const formatTimeAgo = (date) => {
        if (!date) return "-";

        const now = new Date();
        const past = new Date(date);
        const diffInSeconds = Math.floor((now - past) / 1000);

        const minutes = Math.floor(diffInSeconds / 60);
        const hours = Math.floor(diffInSeconds / 3600);
        const days = Math.floor(diffInSeconds / 86400);

        if (diffInSeconds < 60) return "Just now";
        if (minutes < 60) return `${minutes} min ago`;
        if (hours < 24) return `${hours} hrs ago`;
        if (days === 1) return "Yesterday";
        if (days < 7) return `${days} days ago`;

        return past.toLocaleDateString();
    };


    console.log(requisitionApproveStatus)


    return (
        <div className="w-full flex bg-gray-100">

            {/* Sidebar */}
            <div className="w-64 min-h-screen bg-white shadow-md p-5 hidden md:block">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <FaBuilding /> TL DASHBOARD
                </h2>

                <div className="space-y-4 text-gray-600">
                    <div onClick={() => setProfileModelShow(!profileModelShow)} className={`flex items-center gap-2 hover:text-black cursor-pointer`}>
                        <CgProfile /> <span className={`${profileModelShow ? "scale-110 text-purple-700 font-bold" : ""}`}>{!profileModelShow ? "Profile" : "Close Profile"}</span>
                    </div>
                    <div className="flex items-center gap-2 hover:text-black cursor-pointer">
                        <FaUsers /> Requisitions
                    </div>
                    <div className="flex items-center gap-2 hover:text-black cursor-pointer">
                        <FaBriefcase /> Settings
                    </div>
                    <div onClick={() => { dispatch(logout()) }} className="flex items-center gap-2 hover:text-black cursor-pointer">
                        <RiLogoutCircleLine /> Logout
                    </div>
                </div>
            </div>

            <div className={`${profileModelShow ? "w-full" : ""}`}>
                {profileModelShow && (<ProfileModal employeeData={loginInformation} />)}
            </div>
            {/* Main Content */}

            <div className={`${!profileModelShow ? "w-full" : ""}`}>
                {!profileModelShow && (<div className="flex-1 p-4 md:p-8 overflow-auto">

                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 my-6"
                    >
                        <div className="flex flex-col">
                            <h1 className="text-3xl font-bold text-gray-800 uppercase">Welcome, <span className="text-slate-600">{loginInformation?.empName} </span></h1>
                            <hr className="bg-black size-1 w-full" />
                            <h5 className="text-md font-bold text-gray-800 mt-3 uppercase">Your Department, <span className="text-pink-600">{loginInformation?.dept} </span></h5>
                            <h5 className="text-[18px] font-light text-gray-800 mb-6 uppercase">And Designation, <span className="text-purple-700">{loginInformation?.designation} </span></h5>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <button onClick={() => setOpen(true)} className="text-xl font-light bg-green-100 border-2 border-green-800 hover:border-green-400 focus:border-dotted p-2 rounded-md hover:shadow-md hover:shadow-green-700">+ New Requisition</button>
                            {/* <button className="text-xl font-light bg-red-100 border-2 border-red-800 hover:border-red-400 focus:border-dotted p-2 rounded-md hover:shadow-md hover:shadow-red-700">- Resignation</button> */}
                            <button className=" bg-slate-800 text-white rounded-lg hover:shadow-md hover:shadow-slate-800 hover:bg-white p-2  transition-all duration-300 text-xl font-light hover:text-slate-800 flex items-center justify-center"> Notification</button>
                            {/* <button onClick={tearClick} className=" bg-slate-800 text-white rounded-lg hover:shadow-md hover:shadow-slate-800 p-2  hover:bg-white transition-all duration-300 text-xl font-light hover:text-slate-800 flex items-center justify-center"> Requisition Status</button> */}
                            {/* <button onClick={tearClick} className=" bg-slate-800 text-white rounded-lg hover:shadow-md hover:shadow-slate-800 p-2  hover:bg-white transition-all duration-300 text-xl font-light hover:text-slate-800 flex items-center justify-center"> Resignation Status</button> */}
                        </div>
                    </motion.div>

                    {open && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
                            <div className="w-full max-w-5xl">
                                <JobModel requisitionId={"NA"} key={open ? "open" : "closed"} close={open} setClose={setOpen} differentOperationUrl={"https://localhost:7073/api/Requisition"} operationMode={"create"} />
                            </div>
                        </div>
                    )}



                    <div>
                        {show ? <h1 className="text-3xl text-gray-800 mb-6 uppercase font-light">Track Requisition </h1> : ''}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`${show ? 'w-full h-full  md:h-full mt-2 bg-[#FFF0C4] rounded-lg border-4 border-dotted border-green-900' : ''}`}>
                            {show ? <div className="p-6">

                  <button onClick={tearClick} className=" bg-slate-800 text-white rounded-lg hover:shadow-md hover:shadow-slate-800 p-2  hover:bg-white transition-all duration-300 text-xl font-light hover:text-slate-800 flex items-center justify-center">Close</button>

                                <Stepper data={stepperData} />
                                <div className="bg-white shadow rounded-lg mt-2 p-4 mb-2">
                                    {/* <h2 className="text-xl font-bold">
                                        {"Dummy Title"}
                                    </h2>
                                    <p className="text-sm text-gray-500">
                                        Created by: {"Dummy Create By"}
                                    </p>
                                    <p className="text-sm mt-2">
                                        Status:{" "}
                                        <span className="font-semibold capitalize">
                                            {"Dummy Status"}
                                        </span>
                                    </p> */}
                                </div>
                            </div> : ""}
                        </motion.div>
                    </div>
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

                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col justify-between items-start my-6"
                    >
                        <h1 className="text-3xl text-gray-800 mb-6 uppercase font-light">
                            Requisition Filter
                        </h1>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 w-full">

                            {/* Approved */}
                            <div
                                onClick={() => setActiveFilter("all")}
                                className={`cursor-pointer w-full h-32 md:h-40 p-4 rounded-lg md:rounded-[10%] md:border-r-8 flex items-center justify-center text-2xl font-light transition-all duration-300 border-b-8 ${activeFilter === "all"
                                    ? "bg-white text-slate-700 shadow-md shadow-slate-500 scale-105"
                                    : "bg-slate-300 text-slate-800 border-slate-600"
                                    }`}
                            >
                                <FaCheckCircle className="mr-2 size-8" /> All
                            </div>
                            <div
                                onClick={() => setActiveFilter("approved")}
                                className={`cursor-pointer w-full h-32 md:h-40 p-4 rounded-lg md:rounded-[10%] md:border-r-8 flex items-center justify-center text-2xl font-light transition-all duration-300 border-b-8 ${activeFilter === "approved"
                                    ? "bg-white text-green-700 shadow-md shadow-green-500 scale-105"
                                    : "bg-green-300 text-green-800 border-green-600"
                                    }`}
                            >
                                <FaCheckCircle className="mr-2 size-8" /> Approved
                            </div>

                            {/* In Review */}
                            {/* <div
                            onClick={() => setActiveFilter("in review")}
                            className={`cursor-pointer w-full h-32 md:h-40 p-4 rounded-lg md:rounded-[10%] md:border-r-8 flex items-center justify-center text-2xl font-light transition-all duration-300 border-b-8
        ${activeFilter === "done"
                                    ? "bg-white text-indigo-700 shadow-md shadow-indigo-500 scale-105"
                                    : "bg-indigo-300 text-indigo-800 border-indigo-600"
                                }`}
                        >
                            <MdPreview className="mr-2 size-8" /> Done
                        </div> */}

                            {/* Pending */}
                            <div
                                onClick={() => setActiveFilter("pending")}
                                className={`cursor-pointer w-full h-32 md:h-40 p-4 rounded-lg md:rounded-[10%] md:border-r-8 flex items-center justify-center text-2xl font-light transition-all duration-300 border-b-8
        ${activeFilter === "pending"
                                        ? "bg-white text-orange-700 shadow-md shadow-orange-500 scale-105"
                                        : "bg-orange-300 text-orange-800 border-orange-600"
                                    }`}
                            >
                                <FaClock className="mr-2 size-8" /> Pending
                            </div>

                            {/* Cancel */}
                            <div
                                onClick={() => setActiveFilter("rejected")}
                                className={`cursor-pointer w-full h-32  md:h-40 p-4 rounded-lg md:rounded-[10%] md:border-r-8 flex items-center justify-center text-2xl font-light transition-all duration-300 border-b-8 ${activeFilter === "rejected"
                                    ? "bg-white text-red-700 shadow-md shadow-red-500 scale-105"
                                    : "bg-red-300 text-red-800 border-red-600"
                                    }`}
                            >
                                <MdCancel className="mr-2 size-8" /> Cancel
                            </div>

                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col justify-between items-start my-6">
                        <h1 className="text-3xl text-gray-800 mb-6 uppercase font-light">Employee Hiring Requests </h1>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-1 xl:grid-cols-3 gap-6">
                        {(activeFilter !== "all" ? filteredRequests : requisitionApproveStatus).map((item, index) => {

                            const isItemNew = isNew(item.requisition?.createdAt);

                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.08 }}
                                    whileHover={{ scale: 1.03 }}
                                    className={`rounded-xl shadow-md p-5 border transition-all duration-200 ${isItemNew
                                        ? "bg-blue-50 border-blue-400 shadow-blue-100"
                                        : "bg-white"
                                        }`}
                                >

                                    {/* Header */}
                                    <div className="mt-3 space-y-3 text-sm">

                                        <div className="flex justify-start items-start gap-2">

                                            {isItemNew && (
                                                <span className="text-[10px] bg-blue-500 text-white px-2 py-[2px] rounded">
                                                    NEW
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Requisition Title</span>
                                            <span className="font-bold text-gray-700 text-right">
                                                {item.requisitionDetails?.jobTitle}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Requisition Description</span>
                                            <span className="font-light text-gray-700 text-right">
                                                {item.requisitionDetails?.description.slice(0, 10) + `...`}
                                            </span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Requisition Status</span>
                                            <span
                                                className={`text-xs px-1 py-1 rounded-full flex items-center gap-1 capitalize ${statusStyles[item.status] || "bg-gray-100 text-gray-600"}`}>
                                                {(item.requisitionDetails.status || item.status) === "created" && <MdCreateNewFolder  />}
                                                {(item.requisitionDetails.status || item.status) === "approved" && <FaCheckCircle />}
                                                {(item.requisitionDetails.status || item.status) === "pending" && <FaClock />}
                                                {(item.requisitionDetails.status || item.status) === "rejected" && <FaTimesCircle />}
                                                {(item.requisitionDetails.status || item.status)}
                                            </span>
                                        </div>


                                    </div>

                                    {/* Details */}
                                    <div className="mt-3 space-y-3 text-sm">

                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Vacancy</span>
                                            <span className="font-semibold text-gray-800">
                                                {item.requisitionDetails?.vacancy ?? "-"}
                                            </span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Experience</span>
                                            <span className="font-semibold text-gray-800">
                                                {item.requisitionDetails?.year_of_experience ?? "-"} yrs
                                            </span>
                                        </div>

                                        {/* Optional: Verifier Info */}
                                        {item.verifiedBy && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Verified By</span>
                                                <span className="font-medium text-gray-700 text-right">
                                                    {item.requisitionDetails?.verifiedBy}
                                                </span>
                                            </div>
                                        )}

                                        {/* Optional: Verification Date */}
                                        {item.requisition?.verifiedAt && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Verified At</span>
                                                <span className="font-medium text-gray-700 text-right">
                                                    {formatTimeAgo(item.verifiedAt)}
                                                </span>
                                            </div>
                                        )}

                                        {/* Skills as Badges */}
                                        <div className="">
                                            <span className="text-gray-500">Skills</span>

                                            <div className="flex flex-wrap justify-start gap-1 max-w-auto">
                                                {Array.isArray(item.requisitionDetails?.skills) && item.requisitionDetails?.skills.length > 0 ? (
                                                    item.requisitionDetails?.skills?.slice(0, 3).map((skill, i) => {
                                                        const colors = [
                                                            "bg-blue-100 text-blue-700",
                                                            "bg-green-100 text-green-700",
                                                            "bg-purple-100 text-purple-700",
                                                            "bg-orange-100 text-orange-700"
                                                        ];

                                                        return (
                                                            <span
                                                                key={i}
                                                                className={`text-[10px] px-2 py-[2px] rounded-full ${colors[i % colors.length]}`}
                                                            >
                                                                {skill}
                                                            </span>
                                                        );
                                                    })
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </div>
                                        </div>



                                    </div>

                                    {/* Actions */}
                                    <div className="mt-4 flex justify-end gap-2 text-white text-xs">

                                        <button className="px-3 py-1 bg-black rounded-md hover:text-green-300 hover:shadow-green-500 transition-all">
                                            Edit
                                        </button>

                                        <button onClick={() => {setShow(true);setStepperData(item?.requisitionDetails?.id)}} className="px-3 py-1 bg-black rounded-md hover:text-red-300 hover:shadow-red-500 transition-all">
                                            status
                                        </button>

                                        <button onClick={() => { setShowModelOpen(true); setUpdateRequisitionData(item) }} className="px-3 py-1 bg-black rounded-md hover:text-blue-300 hover:shadow-blue-500 transition-all">
                                            Show
                                        </button>

                                    </div>

                                </motion.div>
                            );
                        })}

                    </div>
                </div>)}
            </div>
        </div>
    );
}

export default TLDashboard;