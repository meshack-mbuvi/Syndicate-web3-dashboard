import PillDropDown from "@/containers/layoutWithSyndicateDetails/activity/shared/CategoryPill/CategoryPillDropdown";
import { investmentRounds } from "@/containers/layoutWithSyndicateDetails/activity/shared/InvestmentDetails/InvestmentDetailsConstants";
import React, { useEffect, useRef, useState } from "react";
import { useController } from "react-hook-form";
import { TextField } from "@/components/inputs";

/**
 * RoundDropDown component is used as a drop-down select for investment rounds.
 * "Everything" if a category is not provided.
 * @returns
 */
interface IRoundDropDown {
  showModal?: boolean;
  readonly?: boolean;
  editMode?: boolean;
  name: string;
  label: string;
  control: any;
  borderStyles?: string;
  disabled?: boolean;
}

const RoundDropDown: React.FC<IRoundDropDown> = ({
  editMode,
  name,
  label,
  control,
  borderStyles = "border-none",
  disabled = false,
}) => {
  const categorySelect = useRef(null);
  // drop down
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const [showInputField, setShowInputField] = useState(false);

  const {
    field: { onChange, value },
  } = useController({
    name,
    control,
    defaultValue: "",
  });

  const [selectedCategory, setSelectedCategory] = useState(
    editMode
      ? {
          ...(value
            ? { text: value, value: value }
            : { text: "Select", value: "" }),
        }
      : value
      ? investmentRounds.find((round) => round.text === value)
      : investmentRounds[0],
  );

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // close drop down when clicking outside of it.
  useEffect(() => {
    const onPageClickEvent = (e) => {
      if (
        categorySelect.current !== null &&
        !categorySelect.current.contains(e.target)
      ) {
        setShowDropdown(!showDropdown);
      }
    };

    if (showDropdown) {
      window.addEventListener("click", onPageClickEvent);
    }

    return () => {
      window.removeEventListener("click", onPageClickEvent);
    };
  }, [showDropdown, setShowDropdown]);

  const handleSelect = (round) => {
    if (round === "custom") {
      setShowInputField(true);
      return;
    }
    const selectedCategory = investmentRounds.find(
      (option) => option.value === round,
    );

    setSelectedCategory(selectedCategory);
    onChange(selectedCategory.text);
  };

  const customTextStyles = "text-white text-base";

  return (
    <div
      className={`relative flex justify-between items-center ${borderStyles} cursor-pointer float-right`}
      onClick={() => toggleDropdown()}
      ref={categorySelect}
      aria-hidden="true"
    >
      {label ? (
        <div className={`my-auto w-2/5 leading-5 text-gray-syn4`}>{label}</div>
      ) : null}
      {!showInputField && editMode ? (
        <div className="flex items-center">
          <div className="flex flex-shrink ml-4 justify-start items-center">
            <div className={`whitespace-nowrap py-4`}>
              <span className="text-base font-whyte text-white">
                {selectedCategory?.text}
              </span>
            </div>
            {showDropdown &&
            editMode &&
            selectedCategory?.value !== "custom" ? (
              <div className="w-50 mt-1 absolute z-20 top-10 transition-all duration-500 ease-in-out">
                <PillDropDown
                  options={investmentRounds}
                  onSelect={(e) => handleSelect(e)}
                  customTextStyles={customTextStyles}
                />
              </div>
            ) : null}
          </div>
          {editMode ? (
            <div className="ml-2 mr-0">
              <img src="/images/activity/chevron-down.svg" alt="chevron-down" />
            </div>
          ) : null}
        </div>
      ) : (
        <TextField
          name="investmentRound"
          control={control}
          column={true}
          borderOutline={false}
          textAlignment="text-right"
          placeholder="Enter custom round"
          paddingStyles="p-4 pr-0"
          disabled={disabled}
        />
      )}
    </div>
  );
};

export default RoundDropDown;
