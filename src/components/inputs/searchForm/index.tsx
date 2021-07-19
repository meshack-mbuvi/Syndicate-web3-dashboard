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
}): JSX.Element => {
  const {
    error,
    onChangeHandler,
    searchValue,
    disabled = false,
    column = false,
    full,
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
            <div className="relative flex items-stretch flex-grow focus-within:z-10">
              <div
                className={`absolute inset-y-0 cursor-pointer left-0 pl-3 flex items-center`}
              >
                <img
                  src="/images/search.svg"
                  alt="Search icon"
                  className={`${disabled ? "opacity-40" : ""}`}
                />
              </div>
              <input
                type="text"
                name="search"
                id="search"
                className={`focus:ring-indigo-500 font-whyte focus:border-indigo-500 block w-full rounded-none rounded-md pl-10 sm:text-sm border-gray-300 ${
                  disabled ? "opacity-40" : ""
                }`}
                placeholder="Search member address"
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
