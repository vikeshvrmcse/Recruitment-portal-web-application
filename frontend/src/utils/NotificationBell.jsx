import React, { useEffect, useRef, useState } from "react";
import { useNotification } from "../context/NotificationContextProvider";
import { RiNotification2Fill, RiNotification2Line } from "react-icons/ri";

function NotificationBell() {
  const { notifications, markAsRead } = useNotification();
  const [open, setOpen] = useState(false);
  const ref = useRef();

  const unreadCount = notifications.filter((n) => !n.read).length;

  // 🔒 Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">

      {/* BELL BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className="relative"
      >
        {open ? (
          <RiNotification2Fill className="text-3xl md:text-4xl" />
        ) : (
          <RiNotification2Line className="text-3xl md:text-4xl" />
        )}

        {/* BADGE */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] px-1.5 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {/* DROPDOWN */}
      {open && (
        <div
          className="
            fixed md:absolute
            top-16 md:top-12
            right-2 md:right-0
            w-[95vw] md:w-80
            bg-white shadow-xl rounded-xl z-50
            border
          "
        >

          {/* HEADER */}
          <div className="p-3 border-b font-semibold">
            Notifications
          </div>

          {/* LIST */}
          <div className="max-h-80 overflow-y-auto">

            {notifications.length === 0 ? (
              <p className="p-3 text-sm text-gray-500">
                No notifications
              </p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markAsRead(n.id)}
                  className={`
                    p-3 border-b cursor-pointer transition
                    hover:bg-gray-100
                    ${!n.read ? "bg-yellow-50" : ""}
                  `}
                >
                  <p className="font-medium text-sm">{n.title}</p>
                  <p className="text-xs text-gray-600">{n.message}</p>

                  {!n.read && (
                    <p className="text-xs text-blue-600 mt-1">
                      Tap to mark as read
                    </p>
                  )}
                </div>
              ))
            )}

          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;