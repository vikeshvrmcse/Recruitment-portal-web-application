import React from "react";

function ProfileModal({ employeeData }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-9xl bg-white shadow-2xl rounded-2xl p-8">

        {/* Welcome Section */}
        <div className="mb-6">
          <h1 className="text-[48px] font-bold text-gray-800 leading-tight">
            Welcome Dear
          </h1>
          <h2 className="text-[32px] font-semibold text-blue-600">
            {employeeData?.empName || "User"}
          </h2>
        </div>

        {/* Profile Card */}
        <div className="border rounded-xl p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
            Profile Information
          </h3>

          {/* Header inside card */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-blue-500 text-white flex items-center justify-center text-xl font-bold">
              {employeeData?.empName?.charAt(0) || "U"}
            </div>
            <div>
              <p className="text-lg font-medium text-gray-800">
                {employeeData?.empName || "User"}
              </p>
              <p className="text-sm text-gray-500">
                {employeeData?.designation || "Employee"}
              </p>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            <ProfileItem label="Employee ID" value={employeeData?.empID} />
            <ProfileItem label="Email" value={employeeData?.mailID} />
            <ProfileItem label="Designation" value={employeeData?.designation} />
            <ProfileItem label="Level" value={employeeData?.level} />
            <ProfileItem label="Department" value={employeeData?.dept} />
            <ProfileItem label="IRB" value={employeeData?.irb} />
            <ProfileItem label="Location" value={employeeData?.companyLocation} />
            <ProfileItem label="Password" value="••••••••" />
          </div>
        </div>
      </div>
    </div>
  );
}

const ProfileItem = ({ label, value }) => (
  <div className="bg-gray-50 p-4 rounded-lg border hover:shadow-md transition">
    <p className="text-xs text-gray-500 mb-1">{label}</p>
    <p className="text-sm font-medium text-gray-800">
      {value || "—"}
    </p>
  </div>
);

export default ProfileModal;