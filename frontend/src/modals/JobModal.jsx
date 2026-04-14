import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaChevronDown, FaTimes } from "react-icons/fa";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { TestContext } from "../context/TestContext";
import { departments, skills, qualifications } from "../data/ComboBoxData";
import { useNotification } from "../context/NotificationContextProvider";
function JobModel({ close, setClose, modelTitleModification, differentOperationUrl, operationMode }) {
  const { requisitionData, setRequisitionData } = useContext(TestContext)
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(false);
  const { addNotification } = useNotification();
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      reqType: "",
      location: "",
    },
  });



  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredSkills = skills?.filter((skill) =>
    skill.toLowerCase().includes(search.toLowerCase())
  );

  const { updateRequisitionData } = useContext(TestContext);

  // useEffect(() => {
  //   if (updateRequisitionData) {
  //     reset(updateRequisitionData);  //BEST WAY
  //   }
  // }, [updateRequisitionData, reset]);

  const createNewRequest = () => {
    const newData = {
      title: "New Candidate Applied",
      message: "John Doe applied for Frontend role",
      detail: "Full profile: React, Node, 3 years experience",
    };

    addNotification(newData);
  };

  // SUBMIT
  const onSubmit = async (data) => {

    const finalData = {
      ...data,
      empID: "PMA002",
      status: "pending",
      createdAt: new Date(),
    };

    console.log("Final Data:", finalData);

    try {
      setLoading(true);

      if (operationMode === "update") {
        // await axios.post(differentOperationUrl, finalData);
        alert(differentOperationUrl + operationMode)
        if (updateRequisitionData) {
          reset(updateRequisitionData);  //BEST WAY
        }

      }

      if (operationMode === 'create') {
        // await axios.post(differentOperationUrl, finalData);
        alert(differentOperationUrl+operationMode)
        setRequisitionData([...requisitionData, finalData])
        addNotification(finalData)
      }

      reset();
      toast.success("Requisition Created Successfully");
      setSelectedSkills([]);
      setExperiences([]);

    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-black/40 flex items-center justify-center z-50 p-4">

      {/* MODAL */}
      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-6xl bg-white  rounded-xl shadow-2xl p-4 md:p-6 max-h-[90vh] overflow-y-auto"
      >

        {/* HEADER */}
        <div className="flex justify-between items-center  mb-4">
          <span className="text-lg md:text-xl font-bold tracking-widest text-gray-800 uppercase">
            {modelTitleModification}
          </span>

          <button
            onClick={() => setClose(!close)}
            className="bg-red-700 text-white px-3 py-1 rounded-md hover:bg-red-900 transition"
          >
            <FaTimes />
          </button>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">

          {/* LEFT */}
          <div className="space-y-3">

            <input
              {...register("jobTitle", { required: "Job Title is required" })}
              type="text"
              placeholder="Job Title"
              className="w-full border p-2 rounded-md text-sm"
            />

            {errors.jobTitle && (
              <p className="text-red-500 text-xs">{errors.jobTitle.message}</p>
            )}

            <textarea
              {...register("description", { required: "Description required" })}
              placeholder="Job Description"
              className="w-full border p-2 rounded-md text-sm h-20 md:h-24"
            />

            {errors.description && (
              <p className="text-red-500 text-xs">{errors.description.message}</p>
            )}

            <textarea
              {...register("requirements", { required: "Requirements required" })}
              placeholder="Enter all requirements here"
              className="w-full border p-2 rounded-md text-sm h-20 md:h-24 focus:ring-2 focus:ring-slate-500 outline-none"
            />

            {errors.requirements && (
              <p className="text-red-500 text-xs">{errors.requirements.message}</p>
            )}



            <textarea
              {...register("requisition_reason", { required: "Requisition required" })}
              placeholder="Enter here reason for Requisition"
              className="w-full border p-2 rounded-md text-sm h-20 md:h-24 focus:ring-2 focus:ring-slate-500 outline-none"
            />

            {errors.requisition_reason && (
              <p className="text-red-500 text-xs">{errors.requisition_reason.message}</p>
            )}

            <p className="text-sm">Requisition deadline</p>

            <input
              {...register("deadline", { required: "Deadline required" })}
              type="date"
              className="w-full border p-2 rounded-md text-sm"
            />

            {errors.deadline && (
              <p className="text-red-500 text-xs">{errors.deadline.message}</p>
            )}

            <select
              {...register("job_type", { required: "Job type required" })}
              className="w-full border p-2 rounded-md text-sm"
              defaultValue=""
            >
              <option value="">Select Job Type</option>
              <option value="Full Time">Full Time</option>
              <option value="Part Time">Part Time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>

            {errors.job_type && (
              <p className="text-red-500 text-xs">{errors.job_type.message}</p>
            )}

            <select
              {...register("highest_qualification", { required: "Highest qualification required" })}
              className="w-full border p-2 rounded-md text-sm"
              defaultValue=""
            >
              <option value="">Highest Qualification</option>
              {qualifications?.map((item, idx) => <option key={idx}>{item}</option>)}

            </select>

            {errors.highest_qualification && (
              <p className="text-red-500 text-xs">{errors.highest_qualification.message}</p>
            )}
            <select
              className="w-full border p-2 rounded-md text-sm"
              {...register("department", { required: "Department required" })}
              defaultValue=""
            >
              <option value="">Department</option>
              {departments?.map((item, idx) => (<option key={idx}>{item}</option>))}
            </select>

            {errors.department && (
              <p className="text-red-500 text-xs">{errors.department.message}</p>
            )}

          </div>

          {/* RIGHT */}
          <div className="space-y-3">

            {/* REQ TYPE */}
            <Controller
              name="reqType"
              control={control}
              rules={{ required: "Requisition type required" }}
              render={({ field }) => (
                <div>
                  <p className="text-sm mb-1">Type of Requisition</p>

                  <div className="flex flex-wrap gap-2">
                    {["New", "Replacement", "Both"].map((type) => (
                      <label
                        key={type}
                        className={`px-3 py-1 rounded-md border text-xs cursor-pointer
              ${field.value === type
                            ? "bg-slate-600 text-white"
                            : "bg-white text-gray-700"
                          }`}
                      >
                        <input
                          type="radio"
                          className="hidden"
                          value={type}
                          checked={field.value === type}   // ADD THIS
                          onChange={() => field.onChange(type)}
                        />
                        {type}
                      </label>
                    ))}
                  </div>

                  {errors.reqType && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.reqType.message}
                    </p>
                  )}
                </div>
              )}
            />

            {/* LOCATION */}
            <Controller
              name="location"
              control={control}
              rules={{ required: "Location required" }}
              render={({ field }) => (
                <div>
                  <p className="text-sm mb-1">Location</p>

                  <div className="flex flex-wrap gap-2">
                    {["Pune", "Ghaziabad", "Both"].map((loc) => (
                      <label
                        key={loc}
                        className={`px-3 py-1 rounded-md border text-xs cursor-pointer
              ${field.value === loc
                            ? "bg-green-600 text-white"
                            : "bg-white text-gray-700"
                          }`}
                      >
                        <input
                          type="radio"
                          className="hidden"
                          checked={field.value === loc}   //IMPORTANT FIX
                          onChange={() => field.onChange(loc)}
                        />
                        {loc}
                      </label>
                    ))}
                  </div>

                  {errors.location && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.location.message}
                    </p>
                  )}
                </div>
              )}
            />

            <Controller
              name="vacancy"
              control={control}
              rules={{
                required: "Vacancy is required",
                min: { value: 1, message: "Minimum 1 vacancy required" },
                max: { value: 20, message: "Maximum 20 allowed" },
              }}
              render={({ field }) => (
                <div>
                  <p className="text-sm">Vacancy: {field.value}</p>

                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={field.value || 1}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className="w-full accent-slate-600"
                  />

                  {errors.vacancy && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.vacancy.message}
                    </p>
                  )}
                </div>
              )}
            />
            <Controller
              name="year_of_experience"
              control={control}
              rules={{
                required: "Experience is required",
                min: { value: 1, message: "Minimum 0 experience required" },
                max: { value: 20, message: "Maximum 20 allowed" },
              }}
              render={({ field }) => (
                <div>
                  <p className="text-sm">Experience Years: {field.value}</p>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={field.value || 1}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className="w-full accent-slate-600"
                  />

                  {errors.year_of_experience && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.year_of_experience.message}
                    </p>
                  )}
                </div>
              )}
            />



            {/* EXPERIENCE LEVEL */}
            <Controller
              name="experienceLevel"
              control={control}
              rules={{
                validate: (value) =>
                  (value && value.length > 0) || "Select at least one experience level",
              }}
              render={({ field }) => {
                // ALWAYS ensure array
                const current = Array.isArray(field.value) ? field.value : [];

                return (
                  <div>
                    <p className="text-sm mb-1">Experience Level</p>

                    <div className="flex flex-wrap gap-2">
                      {["Fresher", "Junior", "Mid", "Senior"].map((exp) => (
                        <label
                          key={exp}
                          className={`px-3 py-1 rounded-md border text-xs cursor-pointer ${current.includes(exp)
                            ? "bg-purple-600 text-white"
                            : "bg-white text-gray-700"
                            }`}
                        >
                          <input
                            type="checkbox"
                            className="hidden"
                            checked={current.includes(exp)}
                            onChange={() => {
                              if (current.includes(exp)) {
                                field.onChange(current.filter((item) => item !== exp));
                              } else {
                                field.onChange([...current, exp]);
                              }
                            }}
                          />

                          {exp}
                        </label>
                      ))}
                    </div>

                    {errors.experienceLevel && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.experienceLevel.message}
                      </p>
                    )}
                  </div>
                );
              }}
            />

            {/* SKILLS */}
            <Controller
              name="skills"
              control={control}
              rules={{
                validate: (value) =>
                  value?.length > 0 || "Select at least one skill",
              }}
              render={({ field }) => {
                const handleToggle = (skill) => {
                  const current = field.value || [];

                  if (current.includes(skill)) {
                    field.onChange(current.filter((s) => s !== skill));
                  } else {
                    field.onChange([...current, skill]);
                  }
                };

                const removeSkill = (skill) => {
                  const current = field.value || [];
                  field.onChange(current.filter((s) => s !== skill));
                };

                return (
                  <div className="mt-4 relative">
                    <p className="text-sm mb-1">Skills</p>

                    <div
                      onClick={() => setOpen(!open)}
                      className="border rounded-md p-2 flex flex-wrap gap-2 items-center cursor-pointer"
                    >
                      {(field.value || []).map((skill, index) => (
                        <span
                          key={index}
                          className="flex items-center gap-1 bg-slate-600 text-white px-2 py-1 rounded text-xs"
                        >
                          {skill}
                          <FaTimes
                            onClick={(e) => {
                              e.stopPropagation();
                              removeSkill(skill);
                            }}
                          />
                        </span>
                      ))}

                      <input
                        type="text"
                        placeholder="Select skills..."
                        value={search}
                        onChange={(e) => {
                          setSearch(e.target.value);
                          setOpen(true);
                        }}
                        className="flex-1 outline-none text-sm"
                      />
                      <FaChevronDown />
                    </div>

                    {open && (
                      <div className="absolute w-full mt-1 bg-white border rounded-md shadow-md max-h-40 md:max-h-48 overflow-y-auto z-50">
                        {filteredSkills?.map((skill, index) => (
                          <div
                            key={index}
                            onClick={() => handleToggle(skill)}
                            className="px-3 py-2 text-sm cursor-pointer flex justify-between hover:bg-gray-100"
                          >
                            {skill}
                            {(field.value || []).includes(skill) && "✓"}
                          </div>
                        ))}
                      </div>
                    )}

                    {errors.skills && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.skills.message}
                      </p>
                    )}
                  </div>
                );
              }}
            />
          </div>
        </div>


        {/* BUTTONS */}
        <div className="mt-4 flex flex-col md:flex-row gap-3">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-800 text-white py-2 rounded-lg text-sm md:text-lg flex justify-center items-center gap-2"
          >
            {loading && (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            )}
            {loading ? "Creating..." : "Create Requisition"}
          </button>

          <button
            type="button"
            onClick={() => {
              reset();
              setSelectedSkills([]);
              setExperiences([]);
            }}
            className="w-full bg-slate-800 text-white py-2 rounded-lg text-sm md:text-lg"
          >
            Reset Fields
          </button>
        </div>

      </motion.form>
    </div>
  );
}

export default JobModel;    