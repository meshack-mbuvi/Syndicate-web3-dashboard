import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { SearchIcon } from "@heroicons/react/solid";
import { ChevronDown } from "@/components/shared/Icons";
import { ExclamationCircleIcon } from "@heroicons/react/solid";
import { useCreateSyndicateContext } from "@/context/CreateSyndicateContext";

// search input field
const SearchInput: React.FC<{
  setSearchTerm: (searchTerm: string) => void;
  placeholderText: string;
}> = ({ setSearchTerm, placeholderText }) => {
  const searchInput = useRef(null);

  const handleSearchInput = (event) => {
    const searchTerm = event.target.value;
    setSearchTerm(searchTerm);
  };

  // shift focus to the search input
  useEffect(() => {
    searchInput.current.focus();
  });
  return (
    <div>
      <div className="relative rounded-md shadow-sm mb-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon className="h-5 w-5 text-gray-3" aria-hidden="true" />
        </div>
        <input
          type="text"
          name="search"
          id="search"
          className="font-whyte-light focus:ring-gray-5 block w-full pl-10 sm:text-sm rounded-md text-gray-3 bg-gray-darkInput border-none"
          placeholder={placeholderText}
          onChange={handleSearchInput}
          ref={searchInput}
        />
      </div>
    </div>
  );
};

// The dropdown component where options and search input will be rendered
const SelectInputItem: React.FC<{
  toggleSelect: () => void;
  storeSelectedOption: (option: any) => void;
  label?: string;
  timezone?: string;
  value?: string;
  option?: any;
  usingTimezone?: boolean;
}> = ({
  toggleSelect,
  storeSelectedOption,
  timezone,
  value,
  option,
  usingTimezone,
}) => {
  const router = useRouter();
  const templateRoute = router.pathname.includes("template");
  const { currentTemplateSubstep } = useCreateSyndicateContext();
  const usingTemplate = templateRoute && !currentTemplateSubstep.length;
  // store selected value.
  const storeInputSelectedOption = async (option) => {
    // push selected option to the redux store.
    storeSelectedOption(option);

    // close the select dropdown after an item is selected.
    toggleSelect();
  };

  // number of characters to show for each option to stop values from overflowing
  const numberOfCharacters = usingTemplate ? 14 : 24;
  return (
    <button
      className={`flex justify-between items-center ${
        usingTimezone && !usingTemplate ? "px-4" : "px-2"
      } w-full py-2 rounded-md cursor-pointer hover:bg-gray-darkInput focus:bg-gray-darkInput transition-all`}
      onClick={() => storeInputSelectedOption(option)}
    >
      <div className="flex justify-start items-center">
        <p className="text-white ml-3">
          {value.length > numberOfCharacters
            ? `${value.replace(/\_/g, " ").slice(0, numberOfCharacters)}...`
            : value.replace(/\_/g, " ")}
        </p>
      </div>
      {usingTimezone && !usingTemplate ? (
        <p className="text-gray-3 uppercase">UTC {timezone}</p>
      ) : null}
    </button>
  );
};

const SelectDropdown: React.FC<{
  toggleSelect: () => void;
  selectOptions: any;
  storeSelectedOption: () => void;
  isSearchable?: boolean;
  usingTimezone?: boolean;
}> = ({
  toggleSelect,
  selectOptions,
  storeSelectedOption,
  isSearchable = true,
  usingTimezone = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [noOptionFound, setNoOptionFound] = useState(false);

  // handle search
  useEffect(() => {
    if (searchTerm) {
      const searchKeyword = searchTerm.toLowerCase().trim();
      // users are allowed to search by name or symbol
      const searchResults = selectOptions.filter((option) =>
        usingTimezone
          ? option.value.toLowerCase().includes(searchKeyword)
          : option.toLowerCase().includes(searchKeyword),
      );
      if (searchResults.length) {
        setSearchResults(searchResults);
        setNoOptionFound(false);
      } else {
        setSearchResults([]);
        setNoOptionFound(true);
      }
    } else {
      // populate full list if there is no search term
      setSearchResults(selectOptions);
    }
  }, [searchTerm, selectOptions]);
  return (
    <div className="flex flex-col p-4 pb-0 rounded-md bg-gray-darkBackground border-6 border-gray-darkBackground focus:outline-none h-96">
      {isSearchable ? (
        <SearchInput
          setSearchTerm={setSearchTerm}
          placeholderText="Search timezones"
        />
      ) : null}
      <div className={`${usingTimezone ? "my-2" : ""} overflow-y-auto pr-2`}>
        {searchResults.length ? (
          searchResults.map((option, index) => {
            let { label, timezone, value } = option;
            if (!usingTimezone) {
              value = option;
              label = "";
              timezone = "";
            }

            return (
              <SelectInputItem
                key={index}
                toggleSelect={toggleSelect}
                storeSelectedOption={storeSelectedOption}
                {...{ label, timezone, value, option, usingTimezone }}
              />
            );
          })
        ) : noOptionFound ? (
          <div className="flex flex-col justify-center w-full h-full items-center">
            <ExclamationCircleIcon className="h-10 w-10 mb-2" />
            <p className="text-sm text-gray-3">No timezone found</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

interface ICustomSelectInput {
  label?: string;
  placeholder: string;
  selectOptions: any;
  storeSelectedOption: any;
  icon?: string;
  required?: boolean;
  isSearchable?: boolean;
  selectedValue?: any;
  showMoreInfo?: boolean;
  usingTimezone?: boolean;
}
export const CustomSelectInput: React.FC<ICustomSelectInput> = (props) => {
  const {
    label = "",
    required,
    placeholder,
    isSearchable = true,
    storeSelectedOption,
    icon = "",
    selectedValue,
    selectOptions,
    showMoreInfo = false,
    usingTimezone = false,
  } = props;
  const router = useRouter();
  const templateRoute = router.pathname.includes("template");
  const { currentTemplateSubstep } = useCreateSyndicateContext();
  const usingTemplate = templateRoute && !currentTemplateSubstep.length;

  const [showSelectOptions, setShowSelectOptions] = useState(false);

  const toggleSelect = () => {
    setShowSelectOptions(!showSelectOptions);
  };

  const dropdownRef = useRef(null);

  useEffect(() => {
    const onPageClickEvent = (e) => {
      if (
        dropdownRef.current !== null &&
        !dropdownRef.current.contains(e.target)
      ) {
        setShowSelectOptions(!showSelectOptions);
      }
    };

    if (showSelectOptions) {
      window.addEventListener("click", onPageClickEvent);
    }

    return () => {
      window.removeEventListener("click", onPageClickEvent);
    };
  }, [showSelectOptions]);

  // custom select currently used only for the timezone and time fields
  // check value to display based on the above.
  const selectedValueToShow =
    usingTimezone && !usingTemplate
      ? selectedValue.label.replace(/\_/g, " ")
      : usingTimezone && usingTemplate
      ? selectedValue.label.replace(/\_/g, " ").split("/")[1]
      : selectedValue;

  // some timezone labels are too long and will overflow the input field/options
  // we'll limit the number of characters to display
  const charactersToShow = usingTemplate ? 6 : 24;

  return (
    <div>
      {label ? (
        <div className="flex justify-between items-center">
          <label htmlFor="email" className="block text-white">
            {label}
            {templateRoute ? "*" : null}
          </label>
          {required && (
            <p className="block text-gray-3 text-sm font-normal">Required</p>
          )}
        </div>
      ) : null}

      <div
        className="relative rounded-md shadow-sm items-center"
        ref={dropdownRef}
      >
        {icon ? (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <img src={icon} className="h-6 w-6" alt="logo" aria-hidden="true" />
          </div>
        ) : null}
        <input
          type="text"
          name="selected-option"
          id="selected-option"
          className={`block cursor-pointer w-full pr-10 ${
            icon ? "pl-12" : "pl-4"
          } font-whyte dark-input-field`}
          placeholder={placeholder}
          value={
            selectedValueToShow.length > charactersToShow
              ? `${selectedValueToShow.slice(0, charactersToShow)}...`
              : selectedValueToShow
          }
          readOnly
          onClick={toggleSelect}
        />

        {showMoreInfo && usingTimezone ? (
          <div className="absolute inset-y-0 right-7 pr-3 mt-1 flex items-center pointer-events-none">
            <span
              className={`font-whyte text-gray-placeholder ${
                usingTemplate ? "text-sm" : "text-base"
              }`}
              id="percentage-addon"
            >
              {usingTemplate
                ? `(UTC ${selectedValue.timezone})`
                : `UTC ${selectedValue.timezone}`}
            </span>
          </div>
        ) : null}

        <div className="absolute inset-y-0 right-0 pr-3 pt-1 flex items-center pointer-events-none">
          <ChevronDown width="w-5" height="h-5" />
        </div>

        {showSelectOptions ? (
          <div className="mt-2 w-full absolute z-50 no-scroll-bar">
            <SelectDropdown
              toggleSelect={toggleSelect}
              {...{
                selectOptions,
                storeSelectedOption,
                isSearchable,
                usingTimezone,
              }}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};
