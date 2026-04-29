import React, { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import { EmployeeLoginContext, GetAllEmployeeContext, GetAllRequisitionContext } from "../../context/TestContext";
import { CgMenuGridR } from "react-icons/cg";
import { RiCloseCircleFill } from "react-icons/ri";
import axios from "axios";
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
              setActiveMenu("All Employees");
              setSidebarOpen(false); // auto close on mobile
            }}
            className={`w-full text-left px-4 py-2 rounded-lg transition ${activeMenu === "All Employees"
              ? "bg-white text-slate-900"
              : "hover:bg-slate-700"
              }`}
          >
            {"All Employees"}
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