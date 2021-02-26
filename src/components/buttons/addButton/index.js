import React from "react";
import PropTypes from "prop-types";

export const AddButton = ({ children }) => {
  return (
    <button className="text-white bg-light-green btn-round">{children}</button>
  );
};

AddButton.propTypes = {
  children: PropTypes.string.isRequired,
};

export default AddButton;
