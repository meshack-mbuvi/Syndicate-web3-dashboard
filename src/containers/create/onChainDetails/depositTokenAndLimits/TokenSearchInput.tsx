/** input component to search/filter deposit tokens */
import { SearchIcon } from "@heroicons/react/solid";
import { useRef, useEffect } from "react";

export const TokenSearchInput = (props: { setSearchTerm: Function }) => {
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
          <SearchIcon className="h-5 w-5 text-gray-3" aria-hidden="true" />
        </div>
        <input
          type="text"
          name="token-search"
          id="token-search"
          className="font-whyte-light focus:ring-gray-5 block w-full pl-10 sm:text-sm rounded-md text-gray-3 bg-gray-darkInput border-none"
          placeholder="Search for any ERC-20 token"
          onChange={handleSearchInput}
          ref={searchInput}
        />
      </div>
    </div>
  );
};
