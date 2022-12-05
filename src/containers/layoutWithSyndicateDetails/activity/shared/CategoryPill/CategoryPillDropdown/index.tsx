import React, { Dispatch, SetStateAction } from 'react';
import { Switch, SwitchType } from '@/components/switch';

interface IOptions {
  text: string;
  value: string | null;
  icon?: string;
}

interface ICategoryPillDropDown {
  options: IOptions[];
  onSelect: Dispatch<SetStateAction<string | null>>;
  customTextStyles?: string;
  showHiddenAssetsToggle?: boolean;
  setShowHiddenAssets?: (hidden: boolean) => void;
  showHiddenAssets?: boolean;
  isOwner?: boolean;
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
  customTextStyles,
  showHiddenAssetsToggle = false,
  setShowHiddenAssets,
  showHiddenAssets,
  isOwner
}) => {
  return (
    <div className="rounded-custom bg-gray-syn8 py-5  space-y-3">
      <div className="px-4">
        {options.length > 0 &&
          options.map(({ text, value, icon }, idx) => {
            return (
              <div
                className={`flex justify-start ${
                  customTextStyles ? customTextStyles : ``
                } items-center hover:bg-gray-syn7 rounded-custom p-2 w-full`}
                key={idx}
                onClick={() => onSelect(value)}
                aria-hidden="true"
              >
                {/*we are reusing this component but I do not want to style the plus size icon*/}
                {icon && (
                  <div
                    className={`flex-shrink-0 icon flex items-center justify-start ${
                      icon !== 'plus-sign.svg' ? `h-8 w-8` : ``
                    } ${showHiddenAssetsToggle ? '' : 'mr-2'}`}
                  >
                    <img src={`${icon}`} alt="option-icon" />
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

      {/* hide/show tokens toggle  */}
      {showHiddenAssetsToggle && isOwner ? (
        <button
          className="border-t-1 border-gray-syn6 flex justify-between items-center pt-4 px-6 w-full"
          onClick={(e) => {
            e.stopPropagation();
            if (setShowHiddenAssets) {
              setShowHiddenAssets(!showHiddenAssets);
            }
          }}
        >
          <div>Show hidden</div>
          <div>
            <Switch
              isOn={showHiddenAssets ? true : false}
              type={SwitchType.REGULAR}
              onClick={() => {
                if (setShowHiddenAssets) {
                  setShowHiddenAssets(!showHiddenAssets);
                }
              }}
            />
          </div>
        </button>
      ) : null}
    </div>
  );
};

export default CategoryPillDropDown;
