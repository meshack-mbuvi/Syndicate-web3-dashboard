import React from 'react';

interface Props {
  options: {
    icon: string;
    title: string;
    subtitle?: string;
    url?: string;
    action?: () => void;
  }[];
}

export const Widget: React.FC<Props> = ({ options }) => {
  const iconStyles = 'flex-shrink-0 w-4.5 h-4.5 overflow-hidden mr-4';

  const renderedOptions = options.map((option, index) => (
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    <a
      className={`block space-y-1 hover:bg-gray-syn7 rounded-xl cursor-pointer py-2 px-4`}
      key={index}
    >
      {/* Title + icon */}
      <div className="flex items-center">
        <div className="flex-shrink-0 w-4.5 h-4.5 bg-blue overflow-hidden mr-4">
          icon
        </div>
        <div>{option.title}</div>
      </div>

      {/* Subtitle */}
      {option.subtitle && (
        <div className="flex">
          <div className={iconStyles} />{' '}
          {/* take up space that an icon would */}
          <div className="text-gray-syn4 text-sm">{option.subtitle}</div>
        </div>
      )}
    </a>
  ));

  return (
    <div className="space-y-4 bg-gray-syn8 p-5 rounded-2.5xl">
      {renderedOptions}
    </div>
  );
};
