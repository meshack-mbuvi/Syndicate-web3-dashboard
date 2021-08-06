/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { TextArea } from "@/components/inputs";
import SwitchButton from "@/components/inputs/switchButton";
import { useCreateSyndicateContext } from "@/context/CreateSyndicateContext";
import {
  setAllowRequestToAllowlist,
  setIsAllowlistEnabled,
  setMemberAddresses,
} from "@/redux/actions/createSyndicate/allowlist";
import { RootState } from "@/redux/store";
import { classNames } from "@/utils/classNames";
import countOccurrences from "@/utils/countOccurrence";
import {
  removeNewLinesAndWhitespace,
  removeSubstring,
} from "@/utils/validators";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const Allowlist: React.FC = () => {
  const [selectedTextIndexes, setSelectedTextIndexes] = useState([]);
  const [
    allowListAddressesError,
    setAllowListAddressesError,
  ] = useState<string>("");

  const { setContinueDisabled, continueDisabled } = useCreateSyndicateContext();

  const dispatch = useDispatch();

  const {
    allowlistReducer: {
      createSyndicate: {
        allowlist: {
          isAllowlistEnabled,
          allowRequestToAllowlist,
          memberAddresses,
        },
      },
    },
    web3Reducer: {
      web3: { web3, account },
    },
  } = useSelector((state: RootState) => state);

  useEffect(() => {
    if (allowListAddressesError && !continueDisabled) {
      setContinueDisabled(true);
    }
    if ((!allowListAddressesError && continueDisabled) || !isAllowlistEnabled) {
      setContinueDisabled(false);
    }
  }, [allowListAddressesError, continueDisabled, isAllowlistEnabled]);

  const [allowListAddresses, setAllowListAddresses] = useState(
    memberAddresses.join(",\n"),
  );

  useEffect(() => {
    // handle addresses validation
    validateAddressArr(
      removeNewLinesAndWhitespace(allowListAddresses).split(","),
    );
  }, [allowListAddresses]);

  useEffect(() => {
    // Dispatch valid member addresses to the store
    const membersStored = memberAddresses?.join(",\n");

    if (
      allowListAddresses &&
      !allowListAddressesError &&
      membersStored !== allowListAddresses
    ) {
      dispatch(
        setMemberAddresses(
          removeNewLinesAndWhitespace(allowListAddresses).split(","),
        ),
      );
    } else if (
      (allowListAddresses && allowListAddressesError && membersStored) ||
      (!allowListAddresses && membersStored)
    ) {
      dispatch(setMemberAddresses([]));
    }
  }, [allowListAddresses, memberAddresses]);

  const validateAddressArr = (arr: string[]) => {
    // get last element in array
    const lastElement = arr[arr.length - 1];

    // create new copy of split array
    const newSplitArr = [...arr];

    // check if empty string
    if (!lastElement) {
      newSplitArr.pop();
    }

    newSplitArr && newSplitArr.length
      ? newSplitArr.map(async (value: string) => {
          if (web3.utils.isAddress(value)) {
            setAllowListAddressesError("");

            // check if address added is the connected account (manager)
            if (
              web3.utils.toChecksumAddress(value) ===
              web3.utils.toChecksumAddress(account)
            ) {
              setAllowListAddressesError(
                `You cannot add your own address (manager) to the Allowlist`,
              );
            }

            // handle duplicates
            if (countOccurrences(newSplitArr, value) > 1) {
              setAllowListAddressesError(
                `${value} has already been added(duplicate).`,
              );
            }
          } else {
            setContinueDisabled(true);
            setAllowListAddressesError(`${value} is not a valid ERC20 address`);
          }
        })
      : setAllowListAddressesError("");
  };

  /**
   * This method sets the approved addresses
   * It also validates the input value and set appropriate error message
   */
  const handleAllowListAddressesChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const { value } = event.target;
    setAllowListAddresses(value);
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.code === "Comma") {
      const removeNewLines = removeNewLinesAndWhitespace(allowListAddresses);
      const allowListAddressesArr = removeNewLines.split(",");
      setAllowListAddresses(allowListAddressesArr.join(",\n"));
      event.preventDefault();
    }
  };

  const handleOnPaste = (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pastedAddresses = event.clipboardData.getData("text");
    const removeInvalidCharacters = removeNewLinesAndWhitespace(
      pastedAddresses,
    );
    const newSplitArr = removeInvalidCharacters.split(",");
    setAllowListAddresses((prev) => {
      const selection = prev.substring(
        selectedTextIndexes[0],
        selectedTextIndexes[1],
      );
      const remainingStr = removeNewLinesAndWhitespace(
        // remove selected text
        removeSubstring(prev, selection),
      );
      const newStr = remainingStr + newSplitArr.join();
      return newStr.split(",").join(",\n");
    });
    validateAddressArr(
      removeNewLinesAndWhitespace(allowListAddresses).split(","),
    );
    event.preventDefault();
  };

  const handleOnSelectText = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const { selectionStart, selectionEnd } = event.target;
    setSelectedTextIndexes([selectionStart, selectionEnd]);
  };

  // setMemberAddresses([]); TODO: use this action to set member addresses to redux store

  return (
    <div className="flex flex-col w-full">
      <div className="mb-10 text-2xl leading-8">
        Who should be able to deposit?
      </div>

      <div className="w-full">
        <div
          className={classNames(
            isAllowlistEnabled ? "border-inactive" : "border-blue",
            `relative rounded-lg border px-6 py-8 shadow-sm flex items-center space-x-3 ${
              isAllowlistEnabled && "hover:border-blue-50"
            } mb-4 cursor-pointer`,
          )}
          onClick={() => dispatch(setIsAllowlistEnabled(false))}
        >
          <div
            className={classNames(
              isAllowlistEnabled && "opacity-60",
              "lex-shrink-0",
            )}
          >
            <img
              className="inline mr-4 h-5"
              src="/images/lockOpen.svg"
              alt="syndicate-protocal"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p
              className={classNames(
                isAllowlistEnabled ? "text-gray-inactive" : "text-gray-white",
                "text-base leading-6",
              )}
            >
              Allow all accredited investors with the link to invest
            </p>
          </div>
        </div>
      </div>

      <div className="w-full">
        <div
          className={classNames(
            !isAllowlistEnabled ? "border-inactive" : "border-blue",
            `relative rounded-lg border px-6 py-5 shadow-sm flex items-center space-x-3 ${
              !isAllowlistEnabled && "hover:border-blue-50"
            } mb-4 cursor-pointer`,
          )}
          onClick={() => dispatch(setIsAllowlistEnabled(true))}
        >
          <div
            className={classNames(
              !isAllowlistEnabled && "opacity-60",
              "flex-shrink-0",
            )}
          >
            <img
              className="inline mr-4 h-5"
              src="/images/list.svg"
              alt="syndicate-protocal"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p
              className={classNames(
                "text-base leading-6",
                !isAllowlistEnabled ? "text-gray-inactive" : "text-white",
              )}
            >
              Use an allowlist to pre-approve each depositor
            </p>
            <p
              className={classNames(
                "text-sm leading-6 uppercase tracking-wider",
                !isAllowlistEnabled ? "text-blue-200" : "text-blue",
              )}
            >
              Recommended
            </p>
          </div>
        </div>
      </div>

      {isAllowlistEnabled && (
        <>
          <div className="my-2.5 pt-10">
            <label className="text-base" htmlFor="allowlist">
              Allowlist (comma separated)
            </label>
            <TextArea
              {...{
                name: "allowListAddresses",
                value: allowListAddresses,
                onChange: handleAllowListAddressesChange,
                onPaste: handleOnPaste,
                onKeyUp: handleKeyUp,
                onSelect: handleOnSelectText,
                error: allowListAddressesError,
                // defaultValue: memberAddresses?.join(",\n"),
              }}
              placeholder="Enter investor wallet addresses here, separated by commas"
              classoverride="bg-black text-white border-inactive mt-1"
              rows={7}
            />
          </div>

          <div className="font-whyte text-gray-3 leading-6">
            <p className="mb-4">
              You’ll be able to modify this allowlist at any time after creating
              your syndicate, so don’t worry if you don’t have these addresses
              right now.
            </p>
            <p className="mb-4">
              To minimize gas fees, add multiple investors at once.
            </p>
          </div>

          <div className="py-7">
            <SwitchButton
              label="Allow accredited investors to request to be allowlisted"
              enabled={allowRequestToAllowlist}
              setEnabled={(checked) =>
                dispatch(setAllowRequestToAllowlist(checked))
              }
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Allowlist;
