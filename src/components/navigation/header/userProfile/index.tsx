import React from "react";

export const UserProfile = () => {
  return (
    <div className="flex flex-row w-auto mr-4">
      <img
        src="/images/profileIcon.png"
        className="border-2 rounded-full border-white mr-2 w-10  my-1"
      />
      <p className="my-3">Meshack Mbuvi</p>
    </div>
  );
};

export default UserProfile;
