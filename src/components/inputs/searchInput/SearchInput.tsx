import { SearchIcon } from '@/components/shared/Icons';
import Image from 'next/image';
import React from 'react';

/**
 * An input component with label and icon at the right end
 * If the input is disable, the input field without border, and with grayish
 *  small text is rendered.
 * @param {*} props
 */
export const SearchInput = (props: {
  name?: string;
  id?: string;
  onChangeHandler;
  disabled?: boolean;
  error?: string;
  column?: boolean;
  full?: boolean;
  searchValue: string;
  itemsCount?;
  customClass?: string;
  searchItem?: string;
  clearSearchValue?: (event) => void;
  width?: number;
  parentBackground?: string;
  padding?: string;
}): JSX.Element => {
  const {
    error,
    onChangeHandler,
    searchValue,
    itemsCount,
    full,
    clearSearchValue,
    customClass = 'bg-black',
    disabled = false,
    column = false,
    searchItem = 'members',
    width,
    parentBackground = 'bg-gray-8',
    padding = 'py-2.5 pl-1'
  } = props;

  return (
    <div
      className={`flex ${
        column ? `flex-col mr-2 sm:mr-4` : `flex-row`
      } justify-center ${full ? `w-full` : ``} `}
    >
      <div className={`w-5/6 flex-grow flex flex-col justify-between`}>
        {/* input field */}
        <div className="flex justify-start items-center">
          <div className="relative flex items-center justify-start w-full">
            <div
              className={`relative rounded ${padding} flex items-stretch flex-grow focus-within:z-10 ${parentBackground}`}
            >
              <div
                className={`absolute my-auto align-middle inset-y-0 pt-0.5 h-full z-8 flex items-center justify-center pr-2 ${
                  disabled ? 'opacity-40' : ''
                }`}
              >
                <SearchIcon
                  color={searchValue ? 'text-white' : 'text-gray-syn4'}
                  width="w-4"
                  height="h-4"
                />
              </div>

              <input
                type="text"
                name="search"
                id="search"
                className={`focus:ring-0 ${customClass} relative border-0 font-whyte text-white leading-6 text-lg block w-full rounded-md pl-5 pr-5 sm:text-sm ${
                  disabled ? 'opacity-40' : ''
                }`}
                placeholder={`Search ${
                  itemsCount ? itemsCount : ''
                } ${searchItem}`}
                onChange={onChangeHandler}
                value={searchValue}
                disabled={disabled ? true : false}
                autoComplete="off"
                style={{
                  width: searchValue && width ? width : 'auto'
                }}
              />
              {searchValue.trim() !== '' && clearSearchValue !== undefined && (
                <button
                  className="flex items-center pr-2 cursor-pointer text-gray-syn5"
                  onClick={clearSearchValue}
                >
                  <div className="flex-shrink-0 flex items-center">
                    <Image
                      src="/images/close-circle.svg"
                      height="16"
                      width="16"
                      alt="Selector Icon"
                    />
                  </div>

                  {/* <p className="ml-2">Clear</p> */}
                </button>
              )}
            </div>
          </div>
        </div>
        {error && (
          <p className="text-red-error text-xs mt-1 mb-1">
            {error && !disabled ? error : null}
          </p>
        )}
      </div>
    </div>
  );
};
