import React from "react";

import ProfileIcon from "src/images/profileIcon.png";

export const UserProfile = () => {
  return (
    <div className="flex flex-row w-auto mr-4">
      <img
        src={ProfileIcon}
        className="border-2 rounded-full border-white mr-2 w-10  my-1"
      />
      <p className="my-3">Meshack Mbuvi</p>
    </div>
  );
};

export default UserProfile;
