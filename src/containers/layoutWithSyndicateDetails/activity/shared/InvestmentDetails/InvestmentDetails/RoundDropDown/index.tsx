import { TextField } from '@/components/inputs';
import PillDropDown from '@/containers/layoutWithSyndicateDetails/activity/shared/CategoryPill/CategoryPillDropdown';
import { investmentRounds } from '@/containers/layoutWithSyndicateDetails/activity/shared/InvestmentDetails/InvestmentDetailsConstants';
import React, { useEffect, useRef, useState } from 'react';
import { useController } from 'react-hook-form';

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
  defaultValue?: string;
  resetRound: () => void;
}

const RoundDropDown: React.FC<IRoundDropDown> = ({
  editMode,
  name,
  label,
  control,
  defaultValue,
  borderStyles = 'border-none',
  disabled = false,
  resetRound
}) => {
  const categorySelect = useRef(null);
  // drop down
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const [showInputField, setShowInputField] = useState(false);

  const {
    field: { onChange, value }
  } = useController({
    name,
    control,
    defaultValue
  });

  const [selectedCategory, setSelectedCategory] = useState(
    editMode
      ? {
          ...(value
            ? { text: value, value: value }
            : { text: 'Select', value: '' })
        }
      : value
      ? investmentRounds.find((round) => round.text === value)
        ? investmentRounds.find((round) => round.text === defaultValue)
        : { text: value, value }
      : investmentRounds[0]
  );

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // close drop down when clicking outside of it.
  useEffect(() => {
    const onPageClickEvent = (e: any) => {
      if (
        categorySelect.current !== null &&
        // @ts-expect-error TS(2339): Property 'contains' does not exist on type 'never'... Remove this comment to see the full error message
        !categorySelect.current.contains(e.target)
      ) {
        setShowDropdown(!showDropdown);
      }
    };

    if (showDropdown) {
      window.addEventListener('click', onPageClickEvent);
    }

    return () => {
      window.removeEventListener('click', onPageClickEvent);
    };
  }, [showDropdown, setShowDropdown]);

  const closeDropDown = () => {
    setShowDropdown(false);
  };

  const handleSelect = (round: any) => {
    if (!round) {
      setShowInputField(true);
      // Remove the previously set round value
      resetRound();
      return;
    } else {
      const selectedCategory = investmentRounds.find(
        (option) => option.text === round
      );

      setSelectedCategory(selectedCategory);
      // @ts-expect-error TS(2532): Object is possibly 'undefined'.
      onChange(selectedCategory.text);
    }
  };

  const customTextStyles = 'text-white text-base';
  return (
    <div
      className={`relative flex justify-between items-center ${borderStyles} ${
        editMode ? 'cursor-pointer' : ''
      }float-right`}
      ref={categorySelect}
      aria-hidden="true"
    >
      {label ? (
        <div className={`my-auto w-2/5 leading-5 text-gray-syn4`}>{label}</div>
      ) : null}
      {!showInputField && editMode ? (
        <div
          className="flex items-center cursor-pointer"
          onClick={() => toggleDropdown()}
          onMouseLeave={() => closeDropDown()}
          onKeyDown={() => null}
          role="button"
          tabIndex={0}
        >
          <div className="flex flex-shrink ml-4 justify-start items-center">
            <div className={`whitespace-nowrap py-4`}>
              <span className="text-base font-whyte text-white">
                {selectedCategory?.text}
              </span>
            </div>
            {showDropdown && editMode ? (
              <div className="w-50 mt-1 absolute z-20 top-10 transition-all duration-500 ease-in-out">
                <PillDropDown
                  options={investmentRounds}
                  // @ts-expect-error TS(2322): Type '(text: string) => void' is not assignable to... Remove this comment to see the full error message
                  onSelect={(text: string) => handleSelect(text)}
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
          defaultValue={defaultValue}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus={true}
        />
      )}
    </div>
  );
};

export default RoundDropDown;
