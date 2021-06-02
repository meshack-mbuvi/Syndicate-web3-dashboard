import React from "react";

interface Props {
  children: JSX.Element;
}

export const UserProfileWrapper = ({ children }: Props) => {
  return (
    <div
      className="flex w-full mx-1 flex-col md:flex-row md:px-2 bg-gray-9
     bg-opacity-20 rounded-full cursor-pointer">
      {children}
    </div>
  );
};

export default UserProfileWrapper;
