import React from "react";
import { SearchIcon } from "@/components/shared/Icons";

/**
 * An input component with label and icon at the right end
 * If the input is disable, the input field without border, and with grayish
 *  small text is rendered.
 * @param {*} props
 */
export const SearchForm = (props: {
  name?: string;
  id?: string;
  onChangeHandler;
  disabled?: boolean;
  error?: string;
  column?: boolean;
  full?: boolean;
  searchValue: string;
  memberCount;
}): JSX.Element => {
  const {
    error,
    onChangeHandler,
    searchValue,
    memberCount,
    full,
    disabled = false,
    column = false,
  } = props;

  return (
    <div
      className={`flex ${
        column ? `flex-col mr-2 sm:mr-4` : `flex-row`
      } justify-center ${full ? `w-full` : ``}`}
    >
      <div className={` w-5/6 flex-grow flex flex-col justify-between`}>
        {/* input field */}
        <div className="flex justify-start items-center">
          <div className="relative w-full">
            <div className="relative bg-gray-8 flex items-stretch flex-grow focus-within:z-10">
              <div
                className={`absolute inset-y-0 mr-2 pb-2 flex items-center justify-center ${
                  disabled ? "opacity-40" : ""
                }`}
              >
                <SearchIcon
                  color="text-gray-lightManatee"
                  width="w-4"
                  height="h-4"
                />
              </div>

              <input
                type="text"
                name="search"
                id="search"
                className={`bg-black border-0 border-black text-white leading-6 focus:ring-0 block w-full pl-6 py-0 pb-1 text-sm sm:text-base font-whyte placeholder-gray-lightManatee ${
                  disabled ? "opacity-40" : ""
                }`}
                placeholder={`Search ${memberCount} members`}
                onChange={onChangeHandler}
                value={searchValue}
                disabled={disabled ? true : false}
                autoComplete="off"
              />
            </div>
          </div>
        </div>

        {error && !disabled ? (
          <p className="text-red-500 text-xs mt-1 mb-1">{error}</p>
        ) : null}
      </div>
    </div>
  );
};
