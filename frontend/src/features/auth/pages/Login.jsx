import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";

import pioneer_logo from "../../../assets/pioneer-logo.png";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { EmployeeLoginContext } from "../../../context/TestContext";
import axios from "axios";
const APP_BACKEND_URL = import.meta.env.VITE_DOTNET_BACKEND_URL;
import { useDispatch } from "react-redux";
import { loginSuccess } from "../authSlice";

function Login() {
  const { setLoginInformation, setTLLoginInformation, setRequisitionInformation } = useContext(EmployeeLoginContext)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  const captchaValue = "1234";

  const onSubmit = (data) => {
    try {
      setLoading(true);
      setTimeout(async () => {
        setLoading(false);

        if (data.captcha !== captchaValue) {
          toast.error("Invalid captcha!");
          return;
        }

        if (data.empID === "PMA0171") {
          localStorage.removeItem("auth");
          const response = await axios.post(`${APP_BACKEND_URL}/EmployeeDetails`, {
            empID: data.empID,
            password: data.password
          })
          
          dispatch(loginSuccess(response.data?.data))
          // setLoginInformation(response.data?.data)
          toast.success(response.data?.data?.message);
          // navigate('/sub_admin_dashboard')
          return;

        }

        if (data.empID === "PMA0170") {
          localStorage.removeItem("auth");
          const response = await axios.post(`${APP_BACKEND_URL}/EmployeeDetails`, {
            empID: data.empID,
            password: data.password
          })
          dispatch(loginSuccess(response.data?.data))
          // setLoginInformation(response.data?.data)
          toast.success(response.data?.data?.message);
          // navigate('/tl_dashboard')
          return;
        }
        reset();
      }, 1200);
    } catch (error) {
      toast.error(error.message)
    }


  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">
      <ToastContainer />
      {/* PAGE ANIMATION */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8"
      >

        {/* HEADER ANIMATION */}
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold flex justify-center items-center text-center text-gray-800 mb-6"
        >
          <img
            src={pioneer_logo}
            height={20}
            width={80}
            className="object-contain mt-2 mx-2"
          />
          SIGN IN
        </motion.h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* EMAIL */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <label className="text-xl font-light text-gray-700">
              Employee ID
            </label>

            <div className="mt-2 flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-500">
              <FaEnvelope className="text-gray-400 mr-2" />
              <input
                type="text"
                className="w-full outline-none bg-transparent text-gray-700"
                {...register("empID", { required: "Employee ID is required" })}
              />
            </div>

            {errors.empID && (
              <p className="text-red-500 text-sm mt-1">
                {errors.empID.message}
              </p>
            )}
          </motion.div>

          {/* PASSWORD */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <label className="text-xl font-light text-gray-700">
              Password
            </label>

            <div className="mt-2 flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-500">
              <FaLock className="text-gray-400 mr-2" />

              <input
                type={showPassword ? "text" : "password"}
                className="w-full outline-none bg-transparent text-gray-700"
                {...register("password", {
                  required: "Password is required",
                })}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </motion.div>

          {/* CAPTCHA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <label className="text-xl flex justify-between items-center font-light text-gray-700">
              <p>CAPTCHA</p>
              <p>1234</p>
            </label>

            <input
              type="text"
              className="mt-2 w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              {...register("captcha", { required: "Captcha required" })}
            />
          </motion.div>

          {/* BUTTON */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="w-full bg-slate-800 text-white py-2 rounded-lg hover:shadow-md hover:shadow-slate-800 hover:bg-white transition-all duration-300 text-2xl font-light hover:text-slate-800 flex items-center justify-center"
          >
            {loading ? (
              <span className="animate-spin h-5 w-5 border-2 border-slate-800 border-t-transparent rounded-full"></span>
            ) : (
              "Sign In"
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

export default Login;