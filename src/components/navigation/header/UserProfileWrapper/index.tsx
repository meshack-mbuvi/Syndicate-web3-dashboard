import PropTypes from "prop-types";
import React from "react";

export const UserProfileWrapper = ({ children }) => {
  return (
    <div
      className="flex w-full mx-1 flex-col md:flex-row md:px-2 bg-gray-9
     bg-opacity-20 rounded-full cursor-pointer"
    >
      {children}
    </div>
  );
};

UserProfileWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export default UserProfileWrapper;
