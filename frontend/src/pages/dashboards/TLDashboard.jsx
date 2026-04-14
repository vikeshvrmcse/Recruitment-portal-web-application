import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import {
    FaUsers,
    FaBuilding,
    FaBriefcase,
    FaCheckCircle,
    FaClock,
} from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { MdPreview } from "react-icons/md";
import JobModel from "../../modals/JobModal";
import { CgProfile } from "react-icons/cg";
import { RiLogoutCircleLine } from "react-icons/ri";
import Stepper from "../../utils/Stepper";
import { TestContext } from "../../context/TestContext";
import { useNavigate } from "react-router-dom";

function TLDashboard() {
    const { requisitionData } = useContext(TestContext)
    const [show, setShow] = useState(false)
    const [open, setOpen] = useState(false);


    const navigate = useNavigate();
    console.log(requisitionData)
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
        Approved: "bg-green-100 text-green-600",
        Pending: "bg-yellow-100 text-yellow-600",
        Cancel: "bg-red-100 text-red-600",
        "In Review": "bg-blue-100 text-blue-600"
    };
    const [activeFilter, setActiveFilter] = useState("approved");

    const filteredRequests = requisitionData?.filter(
        (item) => item.status === activeFilter
    );
    const requisition = {
        id: 1,
        title: "Purchase Laptop",
        status: "review", // overall status
        createdBy: "Rahul",
        steps: [
            {
                id: 1,
                name: "Rahul",
                role: "Requester",
                status: "confirmed",
                date: "2026-04-10",
            },
            {
                id: 2,
                name: "Amit",
                role: "Reviewer",
                status: "review",
                date: null,
            },
            {
                id: 3,
                name: "Sneha",
                role: "Approver",
                status: "pending",
                date: null,
            },
        ],
    };



    return (
        <div className="w-full flex bg-gray-100">

            {/* Sidebar */}
            <div className="w-64 min-h-screen bg-white shadow-md p-5 hidden md:block">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <FaBuilding /> TL DASHBOARD
                </h2>

                <div className="space-y-4 text-gray-600">
                    <div className="flex items-center gap-2 hover:text-black cursor-pointer">
                        <CgProfile /> Profile
                    </div>
                    <div className="flex items-center gap-2 hover:text-black cursor-pointer">
                        <FaUsers /> Requests
                    </div>
                    <div className="flex items-center gap-2 hover:text-black cursor-pointer">
                        <FaBriefcase /> Departments
                    </div>
                    <div onClick={() => navigate('/')} className="flex items-center gap-2 hover:text-black cursor-pointer">
                        <RiLogoutCircleLine /> Logout
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-4 md:p-8 overflow-auto">

                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 my-6"
                >
                    <h1 className="text-3xl font-bold text-gray-800 mb-6 uppercase">Welcome, <span className="text-pink-600">Team Leader </span></h1>
                    <div className="flex flex-wrap gap-2">
                        <button onClick={() => setOpen(true)} className="text-xl font-light bg-green-100 border-2 border-green-800 hover:border-green-400 focus:border-dotted p-2 rounded-md hover:shadow-md hover:shadow-green-700">+ New Requisition</button>
                        <button className="text-xl font-light bg-red-100 border-2 border-red-800 hover:border-red-400 focus:border-dotted p-2 rounded-md hover:shadow-md hover:shadow-red-700">- Resignation</button>
                        <button className=" bg-slate-800 text-white rounded-lg hover:shadow-md hover:shadow-slate-800 hover:bg-white p-2  transition-all duration-300 text-xl font-light hover:text-slate-800 flex items-center justify-center"> Notification</button>
                        <button onClick={tearClick} className=" bg-slate-800 text-white rounded-lg hover:shadow-md hover:shadow-slate-800 p-2  hover:bg-white transition-all duration-300 text-xl font-light hover:text-slate-800 flex items-center justify-center"> Requisition Status</button>
                        <button onClick={tearClick} className=" bg-slate-800 text-white rounded-lg hover:shadow-md hover:shadow-slate-800 p-2  hover:bg-white transition-all duration-300 text-xl font-light hover:text-slate-800 flex items-center justify-center"> Resignation Status</button>
                    </div>
                </motion.div>

                {open && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
                        <div className="w-full max-w-5xl">
                            <JobModel key={open ? "open" : "closed"} close={open} setClose={setOpen} differentOperationUrl={"https://localhost:6000/user"} operationMode={"create"} />
                        </div>
                    </div>
                )}



                <div>
                    {show ? <h1 className="text-3xl text-gray-800 mb-6 uppercase font-light">Track Requisition </h1> : ''}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`${show ? 'w-full h-full  md:h-full mt-2 bg-green-100 rounded-lg border-2 border-green-900' : ''}`}>
                        {show ? <div className="p-6">


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
                            onClick={() => setActiveFilter("approved")}
                            className={`cursor-pointer w-full h-32 md:h-40 p-4 rounded-lg flex items-center justify-center text-2xl font-light transition-all duration-300 border-b-8
        ${activeFilter === "approved"
                                    ? "bg-white text-green-700 shadow-xl shadow-green-500 scale-105"
                                    : "bg-green-300 text-green-800 border-green-600"
                                }`}
                        >
                            <FaCheckCircle className="mr-2 size-8" /> Approved
                        </div>

                        {/* In Review */}
                        <div
                            onClick={() => setActiveFilter("in review")}
                            className={`cursor-pointer w-full h-32 md:h-40 p-4 rounded-lg flex items-center justify-center text-2xl font-light transition-all duration-300 border-b-8
        ${activeFilter === "in review"
                                    ? "bg-white text-indigo-700 shadow-xl shadow-indigo-500 scale-105"
                                    : "bg-indigo-300 text-indigo-800 border-indigo-600"
                                }`}
                        >
                            <MdPreview className="mr-2 size-8" /> In Review
                        </div>

                        {/* Pending */}
                        <div
                            onClick={() => setActiveFilter("pending")}
                            className={`cursor-pointer w-full h-32 md:h-40 p-4 rounded-lg flex items-center justify-center text-2xl font-light transition-all duration-300 border-b-8
        ${activeFilter === "pending"
                                    ? "bg-white text-orange-700 shadow-xl shadow-orange-500 scale-105"
                                    : "bg-orange-300 text-orange-800 border-orange-600"
                                }`}
                        >
                            <FaClock className="mr-2 size-8" /> Pending
                        </div>

                        {/* Cancel */}
                        <div
                            onClick={() => setActiveFilter("cancel")}
                            className={`cursor-pointer w-full h-32 md:h-40 p-4 rounded-lg flex items-center justify-center text-2xl font-light transition-all duration-300 border-b-8
        ${activeFilter === "cancel"
                                    ? "bg-white text-red-700 shadow-xl shadow-red-500 scale-105"
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
                    className="flex flex-col justify-between items-start my-6"
                >
                    <h1 className="text-3xl text-gray-800 mb-6 uppercase font-light">Employee Hiring Requests </h1>
                </motion.div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                    {/* {isNew(item.createdAt) && (
                        <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded ml-2">
                            NEW
                        </span>
                    )} */}


                    {filteredRequests?.map((item, index) => {
                        const isItemNew = isNew(item.createdAt);

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.08 }}
                                whileHover={{ scale: 1.03 }}
                                className={`rounded-xl shadow-md p-5 border transition-all duration-200
        ${isItemNew
                                        ? "bg-blue-50 border-blue-400 shadow-blue-100"
                                        : "bg-white"
                                    }`}
                            >

                                {/* Header */}
                                <div className="flex justify-between items-center mb-3">

                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-gray-800">
                                            {item.department}
                                        </h3>

                                        {isItemNew && (
                                            <span className="text-[10px] bg-blue-500 text-white px-2 py-[2px] rounded">
                                                NEW
                                            </span>
                                        )}
                                    </div>

                                    <span
                                        className={`text-xs px-2 py-1 rounded-full flex items-center gap-1
            ${statusStyles[item.status] || "bg-gray-100 text-gray-600"}
          `}
                                    >
                                        {item.status === "approved" ? <FaCheckCircle /> : <FaClock />}
                                        {item.status}
                                    </span>
                                </div>

                                {/* Role */}
                                <p className="text-lg font-medium text-gray-700">
                                    {item.empID || "N/A"}
                                </p>

                                {/* Details */}
                                <div className="mt-3 space-y-2 text-sm text-gray-600">

                                    <p className="flex justify-between">
                                        <span>Positions</span>
                                        <span className="font-medium">{item.vacancy ?? "-"}</span>
                                    </p>

                                    <p className="flex justify-between">
                                        <span>Experience</span>
                                        <span className="font-medium">{item.year_of_experience ?? "-"} years</span>
                                    </p>

                                    <p className="flex justify-between items-start">
                                        <span>Skills</span>
                                        <span className="font-medium text-right max-w-[150px] break-words">
                                            {item.skills || "-"}
                                        </span>
                                    </p>

                                </div>

                                {/* Actions */}
                                <div className="mt-4 flex justify-between text-white text-xs">

                                    <button className="px-3 py-1 bg-black rounded-md hover:text-green-300 hover:shadow-green-500 transition-all">
                                        Edit
                                    </button>

                                    <button className="px-3 py-1 bg-black rounded-md hover:text-red-300 hover:shadow-red-500 transition-all">
                                        Delete
                                    </button>

                                    <button className="px-3 py-1 bg-black rounded-md hover:text-blue-300 hover:shadow-blue-500 transition-all">
                                        Status
                                    </button>

                                </div>

                            </motion.div>
                        );
                    })}

                </div>
            </div>
        </div>
    );
}

export default TLDashboard;