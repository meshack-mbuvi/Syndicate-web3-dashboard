import React, { Dispatch, SetStateAction } from 'react';

interface IOptions {
  text: string;
  value: string;
  icon?: string;
}

interface ICategoryPillDropDown {
  options: IOptions[];
  onSelect: Dispatch<SetStateAction<string>>;
  customTextStyles?: string;
}

/**
 * Drop down component
 * @param options options to show
 * @param onSelect function to set selected option in the state or redux store
 * @param customTextStyles custom styling for different components overloading this component
 * @returns
 */
const CategoryPillDropDown: React.FC<ICategoryPillDropDown> = ({
  options,
  onSelect,
  customTextStyles
}) => {
  return (
    <div className="rounded-custom bg-gray-syn9 py-5 px-2 space-y-3">
      {options.length > 0 &&
        options.map(({ text, value, icon }, idx) => {
          return (
            <div
              className={`flex justify-start ${
                customTextStyles ? customTextStyles : ``
              } items-center hover:bg-gray-syn8 rounded-custom p-2 w-full`}
              key={idx}
              onClick={() => onSelect(value)}
              aria-hidden="true"
            >
              {/*we are reusing this component but I do not want to style the plus size icon*/}
              {icon && (
                <div
                  className={`flex-shrink-0 icon mr-2 ${
                    icon !== 'plus-sign.svg' ? `h-8 w-8` : ``
                  }`}
                >
                  <img src={`/images/activity/${icon}`} alt="option-icon" />
                </div>
              )}
              <p
                className={`whitespace-nowrap ${
                  text === 'Custom' && 'text-gray-syn4'
                }`}
              >
                {text}
              </p>
            </div>
          );
        })}
    </div>
  );
};

export default CategoryPillDropDown;
