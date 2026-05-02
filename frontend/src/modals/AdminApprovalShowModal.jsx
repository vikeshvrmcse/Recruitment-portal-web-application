import React, { useContext } from "react";
import { UpdateRequisitionContext } from "../context/TestContext";
import { motion } from 'framer-motion'
export default function AdminApprovalShowModal({ isOpen, onClose, approvalData }) {

    if (!isOpen) return null;

    console.log(approvalData)
    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center  justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-[92%] sm:w-[80%] md:w-[60%] lg:w-[50%] max-h-[85vh] overflow-y-auto rounded-2xl bg-white backdrop-blur-xl shadow-2xl border border-slate-900 animate-fadeIn">

                {/* Header */}
                <div className="flex shadow-md w-full px-4 pt-4  justify-between items-start mb-4">
                    <div>
                        <div className="text-gray-800">
                            <span className="text-md font-light">Requisition Title </span> <br /> <b className="text-xl">{approvalData?.jobTitle}</b>
                        </div>
                        <div className=" mt-3 text-gray-800">
                            <span className="text-md font-light mt-8">Requistion Status</span>
                            <p className="text-2xl text-gray-600">{approvalData?.role}</p>
                        </div>
                        {/* Status Badge */}
                        <span className="inline-block px-2 py-2 text-md rounded-full bg-yellow-100 text-yellow-700 mb-4">
                            Current Status: {approvalData?.status}
                        </span>
                    </div>

                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-black text-xl"
                    >
                        ✕
                    </button>
                </div>



                {/* Content Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 text-sm text-gray-700">
                    <Info label="Requisition Creator Employee Name" value={approvalData?.name
                    } />
                    {/* <Info label="Requisition Creator Employee ID" value={approvalData?.empID} /> */}
                    <Info label="Requisition Creator Designation" value={approvalData?.designation} />
                    <Info label="Requisition Creator Department" value={approvalData?.department} />

                    <Info label="Requisition Title" value={approvalData?.jobTitle} />
                    <Info label="Requisition description" value={approvalData?.description} />
                    <Info label="Requisition reason" value={approvalData?.requisitionReason} />
                    <Info label="Requisition Requirements" value={approvalData?.requirements} />
                    <Info label="Requisition Department" value={approvalData?.requisitionDepartment} />
                    <Info label="Job Type" value={approvalData?.jobType} />
                    <Info label="Location" value={approvalData?.location} />
                    <Info label="Experience" value={`${approvalData?.yearOfExperience} Years`} />
                    <Info label="Qualification" value={approvalData?.highestQualification} />
                    <Info label="Vacancy" value={approvalData?.vacancy} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 text-sm text-gray-700">
                    {/* Timing */}
                    <div className="mt-4">
                        <p className="text-sm text-gray-600 font-medium">RFQ Date</p>
                        <p className="text-sm text-gray-800">{new Date(approvalData?.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                        })}</p>
                    </div>
                    {/* Timing */}
                    <div className="mt-4">
                        <p className="text-sm text-gray-600 font-medium">Deadline</p>
                        <p className="text-sm text-gray-800">{new Date(approvalData?.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>

                </div>

                {/* Description */}
                <div className="mt-4 px-6">
                    <p className="text-sm text-gray-600 font-medium">Description</p>
                    <p className="text-sm text-gray-800">{approvalData?.description}</p>
                </div>

                {/* Skills */}
                <div className="mt-4 px-6">
                    <p className="text-sm text-gray-600 font-medium">Skills</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {approvalData?.skills?.map((skill, i) => (
                            <span
                                key={i}
                                className="px-2 py-1 text-xs bg-gray-100 rounded-full border border-gray-200"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-6 pb-4 pr-4 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl bg-black text-white hover:bg-gray-800 transition"
                    >
                        Close
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

/* Reusable Info component */
function Info({ label, value }) {
    return (
        <div className="bg-white/40 p-3 rounded-xl border border-white/30">
            <p className="text-xs text-gray-500">{label}</p>
            <p className="text-sm font-medium text-gray-800">{value}</p>
        </div>
    );
}