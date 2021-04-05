import React from "react";
import PropTypes from "prop-types";

export const BadgeCard = (props: {title, subTitle, text, icon?: JSX.Element}) => {
  const { title, subTitle, text, icon } = props;

  return (
    <div className="mt-4 lg:w-3/4 m-2">
      <p className="leading-loose py-1">{title}</p>
      <div className="mr-2 px-6 py-4 rounded-md bg-gray-nero flex bg-black-eerie">
        {icon}
        <div className="ml-6">
          <p className="leading-loose">{subTitle}</p>
          <p className="text-gray-dim leading-loose">{text}</p>
        </div>
      </div>
    </div>
  );
};

BadgeCard.propTypes = {
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
};
