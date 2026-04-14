import React, { useContext, useState } from "react";
import { NotificationContext } from "./TestContext";



export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // Add notification
  const addNotification = (data) => {
    const newNotification = {
      id: Date.now(),
      createdAt: new Date(),

      // mapping fields
      jobTitle: data.jobTitle,
      description: data.description,
      requirements: data.requirements,

      // additional fields (from form or defaults)
      deadline: data.deadline,
      department: data.department,
      empID: data.empID,
      experienceLevel: data.experienceLevel || [],
      highest_qualification: data.highest_qualification,
      job_type: data.job_type,
      location: data.location,
      reqType: data.reqType,
      requisition_reason: data.requisition_reason,
      skills: data.skills || [],
      status: data.status,
      vacancy: data.vacancy,
      year_of_experience: data.year_of_experience,

      read: false,
    };

    setNotifications((prev) => [newNotification, ...prev]);
  };

  // mark as read
  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, read: true } : n
      )
    );
  };

  // remove notification (optional)
  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        markAsRead,
        removeNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);