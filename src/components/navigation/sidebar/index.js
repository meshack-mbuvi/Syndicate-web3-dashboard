import React from "react";
import PropTypes from "prop-types";

const Sidebar = ({ children }) => {
  return (
    <>
      <div className="h-screen flex overflow-hidden  w-1/6 border-r border-gray">
        <div className="flex flex-col w-full">
          <div className="flex flex-col flex-grow pb-4 overflow-y-auto pt-2">
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

Sidebar.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Sidebar;
