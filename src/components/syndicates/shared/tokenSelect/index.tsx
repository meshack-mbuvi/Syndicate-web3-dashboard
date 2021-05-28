import { Fragment, useEffect, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const classNames = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

interface SelectProps {
  setTotalTokenDistributions: Function;
}

export const TokenSelect = (props: SelectProps) => {
  const { distributionTokensAllowanceDetails } = useSelector(
    (state: RootState) => state.tokenDetailsReducer
  );

  const [selected, setSelected] = useState<any>({});
  const { setTotalTokenDistributions } = props;

  /**
   * set initial value for token select drop-down.
   */
  useEffect(() => {
    if (distributionTokensAllowanceDetails.length) {
      setSelected(distributionTokensAllowanceDetails[0]);
    }
  }, [distributionTokensAllowanceDetails]);

  /**
   * set the total available distributions
   */
  useEffect(() => {
    if (selected) {
      const { tokenSymbol, tokenDistributions, tokenAddress } = selected;
      setTotalTokenDistributions(tokenSymbol, tokenDistributions, tokenAddress);
    }
  }, [selected]);

  return (
    <Listbox value={selected} onChange={setSelected}>
      {({ open }) => (
        <>
          <div className="relative w-5/12">
            <Listbox.Button className="relative w-full bg-gray-9 border border-gray-24 rounded-md shadow-sm pl-3 pr-10 py-3 text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-gray-24 focus:border-gray-24 sm:text-sm">
              <span className="flex items-center">
                <span className="ml-3 block truncate">
                  {selected ? selected.tokenSymbol : null}
                </span>
              </span>
              <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <SelectorIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options
                static
                className="absolute mt-1 w-full bg-white shadow-lg max-h-56 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
              >
                {distributionTokensAllowanceDetails.length &&
                  distributionTokensAllowanceDetails.map((token) => (
                    <Listbox.Option
                      key={token.tokenAddress}
                      className={({ active }) =>
                        classNames(
                          active ? "text-white bg-blue-cyan" : "text-gray-900",
                          "cursor-default select-none relative py-2 pl-3 pr-9"
                        )
                      }
                      value={token}
                    >
                      {({ selected, active }) => (
                        <>
                          <div className="flex items-center">
                            <span
                              className={classNames(
                                selected ? "font-semibold" : "font-normal",
                                "ml-3 block truncate"
                              )}
                            >
                              {token.tokenSymbol}
                            </span>
                          </div>

                          {selected ? (
                            <span
                              className={classNames(
                                active ? "text-white" : "text-indigo-600",
                                "absolute inset-y-0 right-0 flex items-center pr-4"
                              )}
                            >
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
};
