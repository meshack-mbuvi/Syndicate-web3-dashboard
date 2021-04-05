import React from "react";
import PropTypes from "prop-types";

export const UserProfileWrapper = ({ children }) => {
  return (
    <div className="flex px-2 justify-between bg-gray-9 bg-opacity-20 rounded-full mr-5 cursor-pointer">
      {children}
    </div>
  );
};

UserProfileWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export default UserProfileWrapper;
