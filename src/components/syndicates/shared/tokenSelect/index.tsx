import { RootState } from "@/redux/store";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import React, { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSyndicateDistributionTokens } from "src/redux/actions/syndicateMemberDetails";
import { updateMemberWithdrawalDetails } from "src/redux/actions/syndicateMemberDetails/memberWithdrawalsInfo";
import { useRouter } from "next/router";
import { amplitudeLogger, Flow } from "@/components/amplitude";
import { CHANGE_DISTRIBUTION_TOKEN } from "@/components/amplitude/eventNames";

const classNames = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

export const TokenSelect = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { syndicateAddress } = router.query;

  const {
    syndicateMemberDetailsReducer: { syndicateDistributionTokens },
  } = useSelector((state: RootState) => state);

  const [selected, setSelected] = useState<any>("");

  // set initial value for token select drop-down.
  useEffect(() => {
    if (syndicateDistributionTokens) {
      for (let i = 0; i < syndicateDistributionTokens.length; i++) {
        // set token to selected token if the token was previously set as selected.
        // no need to dispatch here since we're already using store values.
        if (syndicateDistributionTokens[i].selected) {
          setSelected(syndicateDistributionTokens[i]);
          return;
        }
      }
      // set selected to the first token if there is no token
      // that has been selected previously.
      // new token details object will be dispatched to the redux store.
      const syndicateDistributionTokensCopy = [...syndicateDistributionTokens];
      syndicateDistributionTokensCopy[0].selected = true;

      dispatch(setSyndicateDistributionTokens(syndicateDistributionTokensCopy));
      setSelected(syndicateDistributionTokens[0]);
    }
  }, [syndicateDistributionTokens, selected]);

  /**
   * set the total available distributions
   */
  useEffect(() => {
    if (selected) {
      const { tokenDistributions, tokenAddress, tokenDecimals } = selected;

      // not checking if these values are defined before dispatching
      // actions will cause the component to reset them when unmounted.
      if (tokenAddress) {
        const currentTokenAvailableDistributions = tokenDistributions;
        const currentDistributionTokenDecimals = tokenDecimals;
        const currentDistributionTokenAddress = tokenAddress;

        // this updates member distributions to date, withdrawals to date,
        // and withdrawals/deposits percentage
        updateMemberDistributionDetails(
          currentTokenAvailableDistributions,
          currentDistributionTokenDecimals,
          currentDistributionTokenAddress
        );
      }
    }
  }, [selected]);

  // method to update member withdrawal details.
  const updateMemberDistributionDetails = (
    currentTokenAvailableDistributions: string,
    currentDistributionTokenDecimals: number,
    currentDistributionTokenAddress: string
  ) => {
    dispatch(
      updateMemberWithdrawalDetails({
        syndicateAddress,
        currentTokenAvailableDistributions,
        currentDistributionTokenDecimals,
        currentDistributionTokenAddress,
      })
    );
  };

  const handleChange = (selectedDistributionToken) => {
    // dispatch selected token
    const selectedTokenAddress = selectedDistributionToken.tokenAddress;
    const syndicateDistributionTokensCopy = [...syndicateDistributionTokens];

    for (let i = 0; i < syndicateDistributionTokensCopy.length; i++) {
      if (
        selectedTokenAddress === syndicateDistributionTokensCopy[i].tokenAddress
      ) {
        syndicateDistributionTokensCopy[i].selected = true;
      } else {
        syndicateDistributionTokensCopy[i].selected = false;
      }
    }

    dispatch(setSyndicateDistributionTokens(syndicateDistributionTokensCopy));
    setSelected(selectedDistributionToken);

    // Amplitude logger: Change Distribution Token
    amplitudeLogger(CHANGE_DISTRIBUTION_TOKEN, {
      flow: Flow.MBR_DEP,
      data: {
        tokenSymbol: selectedDistributionToken.tokenSymbol
      }
    });
  };

  return (
    <Listbox value={selected} onChange={handleChange}>
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
                {syndicateDistributionTokens &&
                  syndicateDistributionTokens.map((token) => (
                    <Listbox.Option
                      key={token.tokenAddress}
                      className={({ active }) =>
                        classNames(
                          active ? "text-white bg-blue" : "text-gray-900",
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
                                active ? "text-white" : "text-blue",
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
