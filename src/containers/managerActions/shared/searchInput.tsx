import { isAddress } from 'ethers/lib/utils';
import { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import { formatAddress } from 'src/utils/formatAddress';

// component to set filter term for data.
export const SearchInput: React.FC<{
  setSearchTerm: Dispatch<SetStateAction<string>>;
  searchTerm: string;
  placeholder?: string;
}> = ({ setSearchTerm, searchTerm, placeholder = 'Search members' }) => {
  const searchInput = useRef<HTMLInputElement>(null);

  const clearInputField = (): void => {
    setSearchTerm('');
  };

  useEffect(() => {
    if (searchInput?.current) {
      searchInput.current.focus();
    }
  });

  return (
    <div>
      <div className="relative rounded-md shadow-sm mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <img src="/images/search.svg" alt="search" aria-hidden="true" />
        </div>
        <input
          type="text"
          name="member-filter"
          id="member-filter"
          className="font-whyte focus:ring-gray-4 block w-full pl-9 text-base sm:text-sm text-gray-3 focus:text-white bg-gray-4 border-none"
          style={{ borderRadius: '5px' }}
          placeholder={placeholder}
          onChange={(e): void => setSearchTerm(e.target.value)}
          value={
            isAddress(searchTerm)
              ? formatAddress(searchTerm, 18, 17)
              : searchTerm
          }
          ref={searchInput}
        />

        {searchTerm && (
          <button
            className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
            onClick={(): void => clearInputField()}
          >
            <img
              src="/images/close-circle.svg"
              alt="clear"
              aria-hidden="true"
            />
          </button>
        )}
      </div>
    </div>
  );
};
