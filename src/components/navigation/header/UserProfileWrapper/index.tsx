import React from "react";

interface Props {
  children: JSX.Element;
}

export const UserProfileWrapper = ({ children }: Props) => {
  return (
    <div
      className="flex mx-1 flex-col md:flex-row md:px-1 md:py-1 bg-gray-9
     bg-opacity-20 rounded-full cursor-pointer"
    >
      {children}
    </div>
  );
};

export default UserProfileWrapper;
