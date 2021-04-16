import React from "react";
import PropTypes from "prop-types";

export const BadgeCard = (props: {
  title;
  subTitle;
  text;
  icon?: JSX.Element;
  isEditable: boolean;
}) => {
  const { title, subTitle, text, icon, isEditable } = props;

  return (
    <div className="w-full">
      <p className="leading-loose font-semibold text-lg mt-4">{title}</p>
      <div className="flex items-center">
        <div className="w-1/2 p-4 rounded-md bg-gray-nero flex bg-black-eerie">
          {icon}
          <div className="ml-6">
            <p className="leading-loose">{subTitle}</p>
            <p className="text-gray-dim text-sm leading-loose">{text}</p>
          </div>
        </div>
        <div className="w-10"></div>
        {isEditable && (
          <button className="ml-12 px-9 py-2 h-10 rounded-3xl bg-blue-deepAzure text-blue-light">
            Edit
          </button>
        )}
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
