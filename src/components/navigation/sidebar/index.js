import React from "react";
import PropTypes from "prop-types";
import "./sidebar.css";

const Sidebar = ({ children }) => {
  return (
    <>
      <div className="h-screen flex overflow-hidden sidebar">
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
