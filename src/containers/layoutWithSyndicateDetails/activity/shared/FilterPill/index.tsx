import React, { useEffect, useState, useRef } from 'react';
import PillDropDown from '@/containers/layoutWithSyndicateDetails/activity/shared/CategoryPill/CategoryPillDropdown';
import { DropDownOptions } from '@/containers/layoutWithSyndicateDetails/activity/shared/FilterPill/dropDownOptions';

interface FilterPillProps {
  setFilter: (filter: string) => void;
}

/**
 * Filter pill component is used as a drop-down.
 * "Everything" if a category is not provided.
 * @returns
 */
const FilterPill: React.FC<FilterPillProps> = ({ setFilter }) => {
  const categorySelect = useRef(null);
  // drop down
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(
    DropDownOptions[0]
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
      window.addEventListener('click', onPageClickEvent);
    }

    return () => {
      window.removeEventListener('click', onPageClickEvent);
    };
  }, [showDropdown]);

  const handleSelect = (category) => {
    setSelectedCategory(
      DropDownOptions.find((option) => option.value === category)
    );
    setFilter(category);
  };

  return (
    <div
      className={`relative flex justify-between items-center rounded-full border-1 border-gray-syn6 cursor-pointer`}
      onClick={() => toggleDropdown()}
      ref={categorySelect}
      aria-hidden={true}
    >
      <div className="flex flex-shrink ml-4 justify-start items-center">
        <div className={`whitespace-nowrap py-2`}>
          <span className="text-base text-gray-syn4">
            Show: {selectedCategory?.text}
          </span>
        </div>
      </div>
      <div className="ml-2 mr-3">
        <img src="/images/activity/chevron-down.svg" alt="chevron-down" />
      </div>
      {showDropdown && (
        <div className="mt-2 absolute z-10 top-10 transition-all duration-500 ease-in-out">
          <PillDropDown
            options={DropDownOptions}
            onSelect={(e) => handleSelect(e)}
          />
        </div>
      )}
    </div>
  );
};

export default FilterPill;
