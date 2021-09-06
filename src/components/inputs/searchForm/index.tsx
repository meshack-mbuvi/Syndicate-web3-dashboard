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
        <div className="flex justify-start">
          <div className="relative w-full">
            <div className="relative bg-gray-8 flex items-stretch pl-0.5 flex-grow focus-within:z-10">
              <img
                src="/images/search.svg"
                alt="Search icon"
                className={`absolute inset-y-0 cursor-pointer pt-2.5 left-1 flex items-center ${
                  disabled ? "opacity-40" : ""
                }`}
              />
              <input
                type="text"
                name="search"
                id="search"
                className={`focus:ring-indigo-500 bg-black border-0 text-white font-whyte focus:border-indigo-500 block w-full rounded-md pl-6 sm:text-sm ${
                  disabled ? "opacity-40" : ""
                }`}
                placeholder={`Search ${memberCount} members`}
                onChange={onChangeHandler}
                value={searchValue}
                disabled={disabled ? true : false}
              />
            </div>
          </div>
        </div>
        <p className="text-red-500 text-xs mt-1 mb-1">
          {error && !disabled ? error : null}
        </p>
      </div>
    </div>
  );
};
