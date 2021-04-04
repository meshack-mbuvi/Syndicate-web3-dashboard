import React from "react";
<<<<<<< HEAD:src/components/navigation/header/userProfile/index.tsx
=======
import ProfileIcon from "src/images/profileIcon.png";
>>>>>>> Show totalDeposits, distributions, totalLpdeposits and lpWithdrawals on my syndicates screen.:src/components/navigation/header/userProfile/index.js

export const UserProfile = () => {
  return (
    <div className="flex justify-between w-auto mr-4 rounded-full pl-1 pr-3 py-1 bg-gray-dark">
      <img
<<<<<<< HEAD:src/components/navigation/header/userProfile/index.tsx
        src="/images/profileIcon.png"
        className="border-2 rounded-full border-white mr-2 w-10  my-1"
=======
        src={ProfileIcon}
        className="border rounded-full border-white mr-2 w-7 h-7"
>>>>>>> Show totalDeposits, distributions, totalLpdeposits and lpWithdrawals on my syndicates screen.:src/components/navigation/header/userProfile/index.js
      />
      <p>Meshack Mbuvi</p>
    </div>
  );
};

export default UserProfile;
