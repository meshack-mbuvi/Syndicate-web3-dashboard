import React, { useEffect, useState, useRef } from 'react';
import PillDropDown from '@/containers/layoutWithSyndicateDetails/activity/shared/CategoryPill/CategoryPillDropdown';

interface FilterPillProps {
  setFilter: (filter: string) => void;
  filter?: string;
  dropDownOptions: {
    text: string;
    value: string | null;
    icon: string;
  }[];
  // putting this here because we have 'Show: Everything' under activity but we
  // show 'Viewing options' under assets
  showViewingOptionsPlaceholder?: boolean;
  showHiddenAssetsToggle?: boolean;
  showHiddenAssets?: boolean;
  setShowHiddenAssets?: (hidden: boolean) => void;
  isOwner?: boolean;
}

/**
 * Filter pill component is used as a drop-down.
 * "Everything" if a category is not provided.
 * @returns
 */
const FilterPill: React.FC<FilterPillProps> = ({
  setFilter,
  dropDownOptions,
  showViewingOptionsPlaceholder = false,
  showHiddenAssetsToggle,
  showHiddenAssets = false,
  setShowHiddenAssets,
  filter,
  isOwner
}) => {
  const categorySelect = useRef(null);
  // drop down
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(
    dropDownOptions[0]
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
  }, [showDropdown]);

  const handleSelect = (category: any) => {
    setSelectedCategory(
      dropDownOptions.find((option) => option.value === category)
    );
    setFilter(category);
  };

  return (
    <div
      className={`relative flex justify-between items-center rounded-full border-1 border-gray-syn6 cursor-pointer min-w-40`}
      onClick={() => toggleDropdown()}
      ref={categorySelect}
      aria-hidden={true}
    >
      <div className="flex flex-shrink ml-4 justify-start items-center">
        <div className={`whitespace-nowrap py-2`}>
          <span className="text-base text-gray-syn4">
            {showViewingOptionsPlaceholder && filter === 'all'
              ? 'Viewing options'
              : `Show: ${selectedCategory?.text}`}
          </span>
        </div>
      </div>
      <div className="ml-2 mr-3">
        <img src="/images/activity/chevron-down.svg" alt="chevron-down" />
      </div>
      {showDropdown && (
        <div className="mt-2 absolute z-20 top-10 transition-all duration-500 ease-in-out">
          <PillDropDown
            options={dropDownOptions}
            onSelect={(e) => handleSelect(e)}
            showHiddenAssetsToggle={showHiddenAssetsToggle}
            setShowHiddenAssets={setShowHiddenAssets}
            showHiddenAssets={showHiddenAssets}
            isOwner={isOwner}
          />
        </div>
      )}
    </div>
  );
};

export default FilterPill;
