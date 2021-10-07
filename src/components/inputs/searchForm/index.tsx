import { SearchIcon } from "@/components/shared/Icons";
import Image from "next/image";
import React from "react";

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
  memberCount?;
  customClass?: string;
  clearSearchValue?: (event) => void;
}): JSX.Element => {
  const {
    error,
    onChangeHandler,
    searchValue,
    memberCount,
    full,
    clearSearchValue,
    customClass = "bg-black",
    disabled = false,
    column = false,
  } = props;

  return (
    <div
      className={`flex ${
        column ? `flex-col mr-2 sm:mr-4` : `flex-row`
      } justify-center ${full ? `w-full` : ``}`}
    >
      <div className={`w-5/6 flex-grow flex flex-col justify-between`}>
        {/* input field */}
        <div className="flex justify-start items-center">
          <div className="relative w-full">
            <div className="relative bg-gray-8 pl-1 flex items-stretch flex-grow focus-within:z-10">
              <div
                className={`absolute my-auto align-middle inset-y-0 pt-0.5 h-full z-50 flex items-center justify-center ${
                  disabled ? "opacity-40" : ""
                }`}
              >
                <SearchIcon color="text-gray-syn4" width="w-4" height="h-4" />
              </div>

              <input
                type="text"
                name="search"
                id="search"
                className={`focus:ring-indigo-500 ${customClass} relative border-0 text-white font-whyte leading-6 text-base focus:border-indigo-500 block w-full rounded-md pl-5 pr-8 sm:text-sm ${
                  disabled ? "opacity-40" : ""
                }`}
                placeholder={`Search ${memberCount ? memberCount : ""} members`}
                onChange={onChangeHandler}
                value={searchValue}
                disabled={disabled ? true : false}
                autoComplete="off"
              />
              {searchValue.trim() !== "" && clearSearchValue !== undefined && (
                <button
                  className="absolute inset-y-0 right-0 flex items-center pr-2 cursor-pointer"
                  onClick={clearSearchValue}
                >
                  <Image
                    src="/images/close-circle.svg"
                    height="19"
                    width="16"
                    alt="Selector Icon"
                  />
                </button>
              )}
            </div>
          </div>
        </div>
        {error && (
          <p className="text-red-semantic text-xs mt-1 mb-1">
            {error && !disabled ? error : null}
          </p>
        )}
      </div>
    </div>
  );
};
