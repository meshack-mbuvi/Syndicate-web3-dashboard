import React from "react";
import PropTypes from "prop-types";

const Card = ({ content, customClass, subText }) => {
  return (
    <div className="m-2">
      <div className={`w-44 h-40 rounded-lg flex ${customClass}`}>
        <span className="m-auto">{content}</span>
      </div>
      <p className="leading-4 text-xs text-gray-400 mt-2 w-44 mx-2">
        {subText}
      </p>
    </div>
  );
};

Card.propTypes = {
  content: PropTypes.string.isRequired,
  customClass: PropTypes.string.isRequired,
  subText: PropTypes.string.isRequired,
};

export default Card;
