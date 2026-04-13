import React, { createContext, useContext, useState } from "react";
import { NotificationContext } from "./TestContext";



export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // ➕ Add notification
  const addNotification = (data) => {
    const newNotification = {
      id: Date.now(),
      title: data.title,
      message: data.message,
      detail: data.detail,
      read: false,
    };

    setNotifications((prev) => [newNotification, ...prev]);
  };

  // ✅ mark as read
  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, read: true } : n
      )
    );
  };

  // ❌ remove notification (optional)
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