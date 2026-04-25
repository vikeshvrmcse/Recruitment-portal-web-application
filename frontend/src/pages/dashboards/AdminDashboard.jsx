import React, { useContext, useState } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import { EmployeeLoginContext } from "../../context/TestContext";
import { CgMenuGridR   } from "react-icons/cg";
import { RiCloseCircleFill } from "react-icons/ri";

function AdminDashboard() {
  const { loginInformation } = useContext(EmployeeLoginContext);
  const dispatch = useDispatch();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("dashboard");

  const menuItems = [
    { key: "dashboard", label: "Dashboard" },
    { key: "employees", label: "Employees" },
    { key: "attendance", label: "Attendance" },
    { key: "projects", label: "Projects" },
    { key: "reports", label: "Reports" },
    { key: "settings", label: "Settings" },
  ];

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
            <RiCloseCircleFill  />
          </button>
        </div>

        {/* USER INFO */}
        <div className="p-4 border-b border-slate-700">
          <p className="text-sm text-gray-300">Welcome</p>
          <p className="font-medium">{loginInformation?.empName}</p>
        </div>

        {/* MENU */}
        <nav className="flex-1 p-3 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => {
                setActiveMenu(item.key);
                setSidebarOpen(false); // auto close on mobile
              }}
              className={`w-full text-left px-4 py-2 rounded-lg transition ${
                activeMenu === item.key
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
        <main className="p-6 overflow-y-auto">

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

        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;