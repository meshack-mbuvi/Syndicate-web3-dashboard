/* This example requires Tailwind CSS v2.0+ */
import { formatAddress } from '@/utils/formatAddress';
import { floatedNumberWithCommas } from '@/utils/formattedNumbers';
import { Listbox, Transition } from '@headlessui/react';
import Image from 'next/image';
import { SearchForm } from '../searchForm';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Custom select input for member item
 *
 * @param props
 *   - memberItems -> an array of objects containing
 *      - memberAddress
 *      - tokens
 *      - ownershipShare, etc
 *   - selected -> the item which is currently selected
 *   - label -> label of the select component/field
 *   - searchValue -> string representing the value typed by user from the search field
 *   - searchHandler -> a function that sets searchValue
 * @returns
 */
export const SelectField: React.FC<{
  memberItems;
  label;
  handleSelected;
  selected;
  searchHandler;
  searchValue;
}> = (props) => {
  const {
    memberItems,
    label,
    selected,
    handleSelected,
    searchHandler,
    searchValue
  } = props;

  const handleSearch = (event) => {
    const { value } = event.target;
    searchHandler(value.trim());
  };

  return (
    <Listbox
      value={selected}
      onChange={(selected) => {
        const [selectedMember] = memberItems.filter(
          (member) => member.memberAddress === selected
        );
        handleSelected(selectedMember);
      }}
    >
      {({ open }) => (
        <div>
          <Listbox.Label className="block font-whyte mb-2">
            {label}
          </Listbox.Label>

          <div className="relative">
            <Listbox.Button className="relative p-4 w-full bg-transparent border-1 border-gray-24  rounded-md shadow-sm pr-10 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              {selected?.memberAddress ? (
                <>
                  <p className="flex items-center text-base leading-5">
                    <img
                      src={'/images/user.svg'}
                      alt=""
                      className="flex-shrink-0 h-6 w-6 rounded-full"
                    />
                    <span className="ml-3 font-whyte">
                      {formatAddress(selected?.memberAddress, 6, 4)}
                    </span>
                  </p>
                  <span className="ml-3 absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                    <Image
                      src="/images/chevron-double.svg"
                      height={1}
                      width={16}
                      alt="select item"
                    />
                  </span>
                </>
              ) : (
                <>
                  <span className="flex items-center">
                    <span className="text-gray-syn4 text-base font-whyte leading-5 py-1">
                      Please select a member address
                    </span>
                  </span>
                  <span className="ml-3 absolute inset-y-0 right-0 flex items-center p-4 pointer-events-none">
                    <Image
                      src="/images/chevron-double.svg"
                      height={16}
                      width={16}
                      alt="select item"
                    />
                  </span>
                </>
              )}
            </Listbox.Button>

            <Transition
              show={open}
              as={'div'}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-50 mt-1 w-full bg-black p-4 space-y-3 shadow-lg max-h-56 rounded-md text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                <SearchForm
                  searchValue={searchValue}
                  onChangeHandler={handleSearch}
                  full
                  customClass={'bg-gray-4  rounded-md'}
                  parentBackground="bg-gray-4"
                  padding="py-2 pl-3"
                  clearSearchValue={() => searchHandler('')}
                />

                <div className="overflow-scroll space-y-3">
                  {memberItems.length == 0 ? (
                    <p className="text-gray-syn4 my-12 text-center">
                      There are no members in this club that match your search.
                    </p>
                  ) : (
                    <>
                      <div className="flex justify-between text-gray-syn4 font-whyte text-sm">
                        <p>Member</p>
                        <p>Club tokens (share)</p>
                      </div>
                      <div className="space-y-4">
                        {memberItems.map((member) => (
                          <Listbox.Option
                            key={member.memberAddress}
                            className={() =>
                              classNames(
                                'cursor-pointer select-none relative text-white'
                              )
                            }
                            value={member?.memberAddress}
                          >
                            {({ selected }) => (
                              <div>
                                <div className="flex justify-between">
                                  <div className="flex space-x-3">
                                    <img
                                      src={'/images/user.svg'}
                                      alt=""
                                      className="flex-shrink-0 h-6 w-6 rounded-full"
                                    />
                                    <span
                                      className={classNames(
                                        selected
                                          ? 'bg-opacity-90'
                                          : 'font-normal',
                                        'leading-6 text-base font-whyte'
                                      )}
                                    >
                                      {formatAddress(
                                        member.memberAddress,
                                        6,
                                        6
                                      )}
                                    </span>
                                  </div>

                                  <div className="flex justify-between font-whyte my-auto">
                                    <div
                                      className={classNames(
                                        selected
                                          ? 'bg-opacity-90'
                                          : 'font-normal',
                                        'flex-shrink-0 text-right'
                                      )}
                                    >
                                      {floatedNumberWithCommas(
                                        member?.clubTokens || '0'
                                      )}
                                    </div>
                                    <div
                                      className={classNames(
                                        selected
                                          ? 'bg-opacity-90'
                                          : 'font-normal',
                                        'block text-right truncate flex-1 text-gray-syn4 w-16'
                                      )}
                                    >
                                      {`(${
                                        floatedNumberWithCommas(
                                          member?.ownershipShare
                                        ) || 0
                                      }%)`}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Listbox.Option>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </Listbox.Options>
            </Transition>
          </div>
        </div>
      )}
    </Listbox>
  );
};
