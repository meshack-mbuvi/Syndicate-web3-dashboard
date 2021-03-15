import React from "react";

// import AlertIcon from "src/images/alert.svg";
import AlertNotificationIcon from "src/images/notification.png";

export const Notification = () => {
  return (
    <div className="flex px-4 py-2 cursor-pointer">
      <img src={AlertNotificationIcon} className="pr-1 mr-2 h-6 w-6" />
    </div>
  );
};

export default Notification;
