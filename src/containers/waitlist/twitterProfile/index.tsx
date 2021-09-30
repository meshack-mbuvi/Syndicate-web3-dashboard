import React from "react";
import { useAuthUser } from "next-firebase-auth";

const TwitterProfile = () => {
  const authUser: any = useAuthUser();

  const { firebaseUser } = authUser;
  const { providerData, reloadUserInfo } = firebaseUser;
  const { displayName, photoURL } = providerData[0];
  const { screenName } = reloadUserInfo;

  return (
    <div className="flex flex-col justify-center items-center">
      <div
        className="rounded-full h-10 w-10 bg-gray-spindle mb-1"
        style={{
          backgroundImage: `url(${photoURL})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      ></div>
      <p className="text-lg 2xl:text-2xl">{displayName}</p>
      <div className="flex justify-start items-center font-white-light">
        <img
          alt="logo"
          src="/images/social/twitter-logo-small.svg"
          className="mr-1"
        />
        <p className="text-gray-lightManatee font-whyte-light">@{screenName}</p>
      </div>
    </div>
  );
};

export default TwitterProfile;
