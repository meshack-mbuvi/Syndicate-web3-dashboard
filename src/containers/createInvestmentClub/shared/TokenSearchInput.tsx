import { SearchIcon } from "@heroicons/react/solid";
import { useRef, useEffect } from "react";

// component implements serach bar for token dropdown
export const TokenSearchBar = (props: { setSearchTerm: Function }) => {
  const { setSearchTerm } = props;
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
      <div className="relative rounded-md shadow-sm mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon
            className="h-5 w-5 text-gray-3 focus:text-white"
            aria-hidden="true"
          />
        </div>
        <input
          type="text"
          name="token-search"
          id="token-search"
          className="font-whyte focus:ring-gray-5 block w-full h-14 pl-10 text-base sm:text-sm rounded-md text-gray-3 focus:text-white bg-gray-syn7 border-none"
          placeholder="Search name or contract address"
          onChange={handleSearchInput}
          ref={searchInput}
        />
      </div>
    </div>
  );
};
