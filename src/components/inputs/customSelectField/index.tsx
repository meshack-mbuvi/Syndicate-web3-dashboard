/* This example requires Tailwind CSS v2.0+ */
import { formatAddress } from "@/utils/formatAddress";
import { floatedNumberWithCommas } from "@/utils/formattedNumbers";
import { Listbox, Transition } from "@headlessui/react";
import Image from "next/image";
import React from "react";
import { SearchForm } from "../searchForm";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export const CustomSelectInputField = (props: {
  label?: string;
  data: {
    memberAddress: string;
    avatar: string;
    memberStake: string;
    memberDeposit: string;
  }[];
  onSelectHandler;
  selected;
  filterAddressOnChangeHandler;
  searchAddress: string;
  error: string;
  inputBackground?: string;
  clearSearchValue: (event) => void;
  showNewMemberButton: boolean;
  placeholder?: string;
  showInputField?: (state: boolean) => void;
}): JSX.Element => {
  const {
    label,
    data,
    filterAddressOnChangeHandler,
    searchAddress,
    onSelectHandler,
    selected,
    clearSearchValue,
    showInputField,
    error,
    placeholder = "",
    showNewMemberButton = false,
    inputBackground = "bg-transparent",
  } = props;

  return (
    <div>
      <Listbox value={selected} onChange={onSelectHandler}>
        <Listbox.Label className="block text-base text-white font-whyte leading-5 mb-2">
          {label}
        </Listbox.Label>
        <div className="relative">
          <Listbox.Button
            className={`flex leading-6 w-full px-5 py-4 font-whyte text-base h-14 rounded-md ${inputBackground} border border-gray-24 focus:border-blue text-white focus:outline-none focus:ring-gray-24 flex-grow justify-between`}
          >
            <button
              className={`block truncate ${
                selected?.memberAddress ? "" : "text-gray-lightManatee"
              }`}
            >
              <span>{selected?.memberAddress || placeholder}</span>
            </button>
            <span className="absolute inset-y-0 right-0 flex items-center pr-5">
              <Image
                src="/images/selectorIcon.svg"
                height="19"
                width="16"
                alt="Selector Icon"
              />
            </span>
          </Listbox.Button>

          <Transition
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            className="relative"
          >
            <Listbox.Options className="absolute my-1 max-h-72 z-50 w-full bg-black shadow-lg overflow-y-scroll rounded-md p-4 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
              <div className="pr-1">
                <div className="flex justify-between">
                  <div className="flex w-full">
                    <SearchForm
                      {...{
                        clearSearchValue,
                        full: true,
                        onChangeHandler: filterAddressOnChangeHandler,
                        searchValue: searchAddress,
                        customClass: "bg-gray-4",
                      }}
                    />
                  </div>

                  {/* button to add new member address */}
                  {showNewMemberButton === true && (
                    <div className="min-w-max font-whyte text-right pt-1 ml-8 align-middle text-blue text-sm justify-between hover:opacity-80">
                      <button
                        className={`flex `}
                        onClick={() => showInputField(true)}
                      >
                        <img
                          src={"/images/plus-circle-blue.svg"}
                          alt="icon"
                          className="mr-2 mt-0.5 flex"
                        />
                        <p className="block">New Member</p>
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="h-full px-3">
                {data.length > 0 && (
                  <div className="flex justify-between text-sm text-gray-lightManatee mt-4 mb-3">
                    <span>Member</span> <span>Deposits/Share</span>
                  </div>
                )}
                {data.length ? (
                  data.map((member) => (
                    <Listbox.Option
                      key={member.memberAddress}
                      className={({ active }) =>
                        classNames(
                          active
                            ? "hover:bg-gray-syn8 cursor-pointer"
                            : "text-white",
                          "cursor-default select-none relative py-2 rounded-sm",
                        )
                      }
                      value={member}
                    >
                      {({ selected }) => (
                        <>
                          <div className="flex justify-between">
                            <div className="flex">
                              <Image
                                src="/images/user.svg"
                                height="24"
                                width="24"
                                className="flex-shrink-0 rounded-full flex items-center"
                                alt="User icon"
                              />
                              <span
                                className={classNames(
                                  selected ? "font-semibold" : "font-normal",
                                  "ml-3 flex items-center",
                                )}
                              >
                                {formatAddress(member.memberAddress, 6, 6)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="flex items-center justify-end">
                                {floatedNumberWithCommas(
                                  member.memberDeposit || "0",
                                )}
                              </span>

                              <span className="ml-2 text-gray-lightManatee text-base w-16 flex items-end justify-end">
                                {`${member?.memberStake || "0.00"}%`}
                              </span>
                            </div>
                          </div>
                        </>
                      )}
                    </Listbox.Option>
                  ))
                ) : (
                  <div className="py-10 flex text-center text-gray-lightManatee text-base">
                    There are no addresses on this syndicate’s allowlist that
                    match your search. You can add this address to the
                    allowlist.
                  </div>
                )}
              </div>
            </Listbox.Options>
          </Transition>
        </div>
        <p className="text-red-semantic text-xs h-1 mt-1 mb-1">
          {error ? error : ""}
        </p>
      </Listbox>
    </div>
  );
};
