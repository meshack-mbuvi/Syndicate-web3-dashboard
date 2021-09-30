import React, { useEffect, useRef, useState } from "react";
import { ChevronDown } from "@/components/shared/Icons";

// The dropdown component where options will be rendered
const SelectInputItem: React.FC<{
  toggleSelect: () => void;
  storeSelectedOption: (option: any) => void;
  label?: string;
  value?: string;
  option?: any;
}> = ({ toggleSelect, storeSelectedOption, value, option }) => {
  // store selected value.
  const storeInputSelectedOption = async (option) => {
    // push selected option to the redux store.
    storeSelectedOption(option);

    // close the select dropdown after an item is selected.
    toggleSelect();
  };

  return (
    <button
      className={`flex font-whyte-light justify-between items-center p-2 w-full rounded-md cursor-pointer hover:bg-gray-darkInput focus:bg-gray-darkInput transition-all`}
      onClick={() => storeInputSelectedOption(option)}
    >
      <div className="flex justify-start items-center">
        <p className="text-white ml-1">{option}</p>
      </div>
    </button>
  );
};

const SelectDropdown: React.FC<{
  toggleSelect: () => void;
  selectOptions: any;
  storeSelectedOption: () => void;
}> = ({ toggleSelect, selectOptions, storeSelectedOption }) => {
  return (
    <div className="flex flex-col p-3 rounded-md bg-gray-darkBackground border-6 border-gray-darkBackground focus:outline-none h-fit-content">
      <div className="overflow-y-auto">
        {selectOptions.length &&
          selectOptions.map((option, index) => {
            return (
              <SelectInputItem
                key={index}
                toggleSelect={toggleSelect}
                storeSelectedOption={storeSelectedOption}
                {...{ option }}
              />
            );
          })}
      </div>
    </div>
  );
};

interface ISelectField {
  placeholder: string;
  selectOptions: any;
  storeSelectedOption: any;
  selectedValue?: any;
  showAdditionalInput?: boolean;
}
const SelectField: React.FC<ISelectField> = (props) => {
  const {
    placeholder,
    storeSelectedOption,
    selectedValue,
    selectOptions,
    showAdditionalInput,
  } = props;

  const dropdownRef = useRef(null);
  const [showSelectOptions, setShowSelectOptions] = useState(false);

  const toggleSelect = () => {
    setShowSelectOptions(!showSelectOptions);
  };

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

  return (
    <div>
      <div
        className="relative rounded-md shadow-sm items-center"
        ref={dropdownRef}
      >
        <input
          type="text"
          name="selected-option"
          id="selected-option"
          className={`block cursor-pointer w-full pr-10 pl-4 py-3 font-whyte bg-gray-darkInput border-gray-darkInput text-white ${
            showAdditionalInput ? "rounded-t-custom" : "rounded-custom"
          }`}
          placeholder={placeholder}
          value={selectedValue}
          readOnly
          onClick={toggleSelect}
        />

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
              }}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default SelectField;
