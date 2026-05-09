import React, { useEffect, useState } from 'react';
import ProfileModal from '../../modals/ProfileModal';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { RiLogoutCircleLine } from 'react-icons/ri';
import { logout } from '../../features/auth/authSlice';
import { toast } from 'react-toastify';

const API_BACKEND_URL = import.meta.env.VITE_DOTNET_BACKEND_URL;

function SubHRDashboard() {

    const dispatch = useDispatch();

    const storedUser = localStorage.getItem("auth");
    const user = JSON.parse(storedUser);

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const sendToBelowHrClick = async () => {

        try {

            setLoading(true);

            const seenResponse = await axios.get(
                `${API_BACKEND_URL}/FinalApproval/GetHRActionSeen/${user?.empID}`
            );

            setData(seenResponse.data?.data || []);

        } catch (error) {

            console.log(error.message);

        } finally {

            setLoading(false);
        }
    };

    const ImSeen=async(id)=>{
        try {

            setLoading(true);

            const seenResponse = await axios.put(
                `${API_BACKEND_URL}/FinalApproval/HRActionSeenBySubHr/${id}`
            );

            toast.success(seenResponse.data?.message)

        } catch (error) {

            console.log(error.message);

        } finally {

            setLoading(false);
        }
    }

    useEffect(() => {

        if (user?.empID) {
            sendToBelowHrClick();
        }

    }, [user?.empID]);

    return (
        <div className="min-h-screen bg-gray-100 p-6">

            {/* Header */}
            <div className="bg-white shadow-md rounded-xl p-5 flex justify-between items-center">

                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        Sub HR Dashboard
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Welcome back, {user?.empName}
                    </p>
                </div>

                <button
                    className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg flex items-center gap-2 transition"
                    onClick={() => dispatch(logout())}
                >
                    <RiLogoutCircleLine size={20} />
                    Logout
                </button>
            </div>

            {/* Profile Section */}
            <div className="mt-6 bg-white rounded-xl shadow-md p-5">

                <h2 className="text-xl font-semibold mb-4 text-gray-700">
                    Profile Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Employee Name</p>
                        <p className="font-semibold text-lg">
                            {user?.empName || 'N/A'}
                        </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Employee ID</p>
                        <p className="font-semibold text-lg">
                            {user?.empID || 'N/A'}
                        </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Department</p>
                        <p className="font-semibold text-lg">
                            {user?.department || 'N/A'}
                        </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-semibold text-lg">
                            {user?.email || 'N/A'}
                        </p>
                    </div>

                </div>

                <div className="mt-4">
                    <ProfileModal employeeData={user} />
                </div>

            </div>

            {/* Requests Section */}
            <div className="mt-6 bg-white rounded-xl shadow-md p-5">

                <h2 className="text-xl font-semibold mb-4 text-gray-700">
                    HR Actions
                </h2>

                {loading ? (

                    <div className="text-center py-10 text-gray-500">
                        Loading...
                    </div>

                ) : data.length === 0 ? (

                    <div className="text-center py-10 text-gray-400">
                        No Data Found
                    </div>

                ) : (

                    <div className="overflow-x-auto">

                        <table className="w-full border-collapse">

                            <thead>

                                <tr className="bg-gray-200 text-gray-700">

                                    <th className="p-3 text-left">Approval ID</th>
                                    <th className="p-3 text-left">Creator</th>
                                    <th className="p-3 text-left">Verifier</th>
                                    <th className="p-3 text-left">Status</th>
                                    <th className="p-3 text-left">Seen</th>
                                    <th className="p-3 text-left">Created</th>

                                </tr>

                            </thead>

                            <tbody>

                                {data.map((item, index) => (

                                    <tr
                                        key={index}
                                        className="border-b hover:bg-gray-50"
                                    >

                                        <td className="p-3">
                                            {item.approvalID}
                                        </td>

                                        <td className="p-3">
                                            {item.creator?.empName}
                                        </td>

                                        <td className="p-3">
                                            {item.requisitionApproval?.employee?.empName}
                                        </td>

                                        <td className="p-3">
                                            <span
                                                className={`px-3 py-1 rounded-full text-sm text-white
                                                ${item.requisitionApproval?.status === 'done'
                                                        ? 'bg-green-500'
                                                        : item.status === 'pending'
                                                            ? 'bg-yellow-500'
                                                            : 'bg-red-500'
                                                    }`}
                                            >
                                                {item.status}
                                            </span>
                                        </td>

                                        <td className="p-3">

                                            {item?.seen ? (

                                                <span className="text-green-600 font-semibold">
                                                    Seen
                                                </span>

                                            ) : (

                                                <span className="text-red-500 font-semibold">
                                                    Unseen
                                                </span>

                                            )}

                                        </td>

                                        <td className="p-3">
                                            {item?.createdAt
                                                ? new Date(item?.createdAt).toLocaleDateString()
                                                : 'N/A'}
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

            <div className="mt-6 bg-white rounded-xl shadow-md p-5">

                <h2 className="text-2xl font-bold mb-5 text-gray-700">
                    HR Assigned Requests
                </h2>

                {data.length === 0 ? (

                    <div className="text-center text-gray-500 py-10">
                        No Requests Found
                    </div>

                ) : (

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

                        {data.map((item) => (

                            <div
                                key={item.id}
                                className="border rounded-xl p-5 shadow hover:shadow-lg transition bg-gray-50"
                            >

                                <div className="flex justify-between items-center mb-3">

                                    <h3 className="text-lg font-bold text-blue-700">
                                        {item.requisition?.jobTitle}
                                    </h3>

                                    <span
                                        className={`px-3 py-1 rounded-full text-sm text-white
                            ${item.requisition?.status === 'pending'
                                                ? 'bg-yellow-500'
                                                : 'bg-green-500'
                                            }`}
                                    >
                                        {item.requisitionApproval?.status}
                                    </span>

                                </div>

                                <div className="space-y-2 text-sm">

                                    <p>
                                        <span className="font-semibold">
                                            Department:
                                        </span>{" "}
                                        {item.requisition?.department}
                                    </p>

                                    <p>
                                        <span className="font-semibold">
                                            Requested By:
                                        </span>{" "}
                                        {
                                            item.requisition?.employeeDetailDatas?.empName
                                        }
                                    </p>

                                    <p>
                                        <span className="font-semibold">
                                            Location:
                                        </span>{" "}
                                        {item.requisition?.location}
                                    </p>

                                    <p>
                                        <span className="font-semibold">
                                            Experience:
                                        </span>{" "}
                                        {item.requisition?.yearOfExperience} Years
                                    </p>

                                    <p>
                                        <span className="font-semibold">
                                            Vacancy:
                                        </span>{" "}
                                        {item.requisition?.vacancy}
                                    </p>

                                    <p>
                                        <span className="font-semibold">
                                            Deadline:
                                        </span>{" "}
                                        {
                                            item.requisition?.deadline
                                                ? new Date(
                                                    item.requisition.deadline
                                                ).toLocaleDateString()
                                                : "N/A"
                                        }
                                    </p>

                                    <div className='flex w-full justify-between items-center'>

                                        <div className="mt-3">

                                            <span
                                                className={`px-3 py-1 rounded-md text-white text-md
                                ${item.seen
                                                        ? "bg-green-500"
                                                        : "bg-red-300"
                                                    }`}
                                            >
                                                {item.seen ? "Seen" : "Unseen"}
                                            </span>

                                        </div>

                                        <div className="mt-3">

                                            <button
                                                onClick={()=>ImSeen(item.id)}
                                                disabled={(item.seen === true) ? true : false}
                                                className={`px-3 py-1 rounded-md text-white text-md
                                ${item.seen
                                                        ? "bg-green-200 text-green-500"
                                                        : "bg-slate-800 text-white hover:border-2 hover:scale-110 transition-all hover:bg-white hover:text-slate-900"
                                                    }`}
                                            >
                                                {item.seen ? "Seen" : "Unseen"}
                                            </button>

                                        </div>

                                    </div>



                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>
    );
}

export default SubHRDashboard;