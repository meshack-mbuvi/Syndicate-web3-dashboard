import React from "react";
import PropTypes from "prop-types";

export const BadgeCard = (props: {title, subTitle, text, icon?: JSX.Element}) => {
  const { title, subTitle, text, icon } = props;

  return (
    <div className="mt-4 m-2">
      <p className="text-xl leading-normal py-1">{title}</p>
      <div className="mr-2 px-6 py-4 rounded-custom bg-gray-nero flex bg-black-eerie">
        {icon}
        <div className="ml-6">
          <p className="text-lg leading-snug">{subTitle}</p>
          <p className="text-sm text-gray-dim leading-snug">{text}</p>
        </div>
      </div>
    </div>
  );
};

BadgeCard.propTypes = {
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  icon: PropTypes.any.isRequired,
};
