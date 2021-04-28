import React from "react";
import PropTypes from "prop-types";
import { EditButton } from "src/components/syndicates/shared/editButton";

export const BadgeCard = (props: {
  title;
  subTitle;
  text;
  icon?: JSX.Element;
  isEditable?: boolean;
}) => {
  const { title, subTitle, text, icon, isEditable } = props;

  return (
    <div className="w-full mt-4 m-2">
      <p className="text-xl leading-normal py-1">{title}</p>
      <div className="w-full flex items-center">
        <div className="flex w-7/12 items-center">
          <div className="w-full mr-2 px-6 py-4 rounded-custom bg-gray-nero flex bg-black-eerie">
            {icon}
            <div className="ml-6">
              <p className="text-lg leading-snug">{subTitle}</p>
              <p className="text-sm text-gray-dim leading-snug">{text}</p>
            </div>
          </div>
        </div>
        {isEditable ? (
          <div className="flex items-center h-full">
            <EditButton />
          </div>
        ) : null}
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
