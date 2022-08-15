import React from 'react';

interface Props {
  icon: string;
  title: string;
  details: string;
  hoverBorderColor: string;
  inlineLink?: { label: string; URL: string };
  onClick?: () => void;
}

export const DetailedButton: React.FC<Props> = ({
  icon,
  title,
  details,
  hoverBorderColor,
  inlineLink,
  onClick
}) => {
  return (
    <button
      className={`p-6 rounded-custom border ${
        hoverBorderColor
          ? `hover:border-${hoverBorderColor}`
          : 'hover:border-white'
      } border-gray-syn6 transition-all ease-out w-full sm:w-58`}
      onClick={onClick}
    >
      <div className="h-full w-full">
        {' '}
        {/* This is to avoid automatic vertical centering of contents */}
        {/* Icon */}
        <div className="w-full h-23 mx-auto mb-5">
          <img
            src={icon}
            alt="Icon"
            className="top-full relative -translate-y-full transform"
          />
        </div>
        {/* Title */}
        <div className="text-sm text-left mb-1">{title}</div>
        {/* Details */}
        <div className="text-xs text-left text-gray-syn4">{details}</div>
        {/* Link */}
        {inlineLink && (
          <div className="flex items-center text-xs text-gray-syn4 mt-2 space-x-1">
            <a href={inlineLink.URL} className="hover:underline">
              {inlineLink.label}
            </a>
            <img
              src="/images/externalLinkGray.svg"
              className="w-3 h-3"
              alt="Icon"
            />
          </div>
        )}
      </div>
    </button>
  );
};
