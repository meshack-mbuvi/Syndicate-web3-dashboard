import React from "react";

export const UserProfileWrapper: React.FC = ({ children }) => {
  return (
    <div
      className="flex ml-1 flex-col md:flex-row md:px-1 md:py-1 bg-gray-9
     bg-opacity-20 rounded-full cursor-pointer"
    >
      {children}
    </div>
  );
};

export default UserProfileWrapper;
