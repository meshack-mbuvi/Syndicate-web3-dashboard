import React from "react";
import PropTypes from "prop-types";
import "./card.css";

const Card = ({ content, customClass, subText }) => {
  return (
    <div className="m-2">
      <div className={`card flex ${customClass}`}>
        <span className="m-auto">{content}</span>
      </div>
      <p className="subText mt-2">{subText}</p>
    </div>
  );
};

Card.propTypes = {
  content: PropTypes.string.isRequired,
  customClass: PropTypes.string.isRequired,
  subText: PropTypes.string.isRequired,
};

export default Card;
