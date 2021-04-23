import React from "react";

export const UserProfile = () => {
  return (
    <div className="flex flex-row bg-gray-dark  rounded-full my-1 mx-4 pt-1 pl-1 pr-3 h-8">
      <img
        src="/images/profileIcon.png"
        className="border-1 rounded-full border-white mr-2 w-6 h-6"
      />
      <p className="text-sm">Not connected</p>
    </div>
  );
};

export default UserProfile;
