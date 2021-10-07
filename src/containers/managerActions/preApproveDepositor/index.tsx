import { TextArea } from "@/components/inputs";
import Modal, { ModalStyle } from "@/components/modal";
import FileUpload from "@/components/shared/fileUploader";
import ConfirmStateModal from "@/components/shared/transactionStates/confirm";
import { showWalletModal } from "@/redux/actions";
import { setNewMemberAddresses } from "@/redux/actions/manageMembers";
import { RootState } from "@/redux/store";
import { onlyUnique } from "@/utils/conversions";
import countOccurrences from "@/utils/countOccurrence";
import {
  isZeroAddress,
  removeNewLinesAndWhitespace,
  removeSubstring,
} from "@/utils/validators";
import { useRouter } from "next/router";
import Papa from "papaparse";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  confirmPreApproveAddressesText,
  managerApproveAddressesConstants,
} from "src/components/syndicates/shared/Constants";

interface Props {
  showPreApproveDepositor: boolean;
  setShowPreApproveDepositor;
}

/**
 * This component displays a form with textarea to set approved addresses
 * @param props
 * @returns
 */

const PreApproveDepositor = (props: Props): JSX.Element => {
  const { showPreApproveDepositor, setShowPreApproveDepositor } = props;

  const {
    initializeContractsReducer: { syndicateContracts },
    syndicatesReducer: { syndicate },
    web3Reducer: {
      web3: { account, web3 },
    },
  } = useSelector((state: RootState) => state);

  const [showWalletConfirmationModal, setShowWalletConfirmationModal] =
    useState(false);

  const [validSyndicate, setValidSyndicate] = useState(false);

  const router = useRouter();
  const { syndicateAddress } = router.query;

  const dispatch = useDispatch();

  // no syndicate exists without a manager, so if no manager, then syndicate does not exist
  useEffect(() => {
    if (syndicate) {
      // Checking for address 0x0000000; the default value set by solidity
      if (isZeroAddress(syndicate.currentManager)) {
        // address is empty
        setValidSyndicate(false);
      } else {
        setValidSyndicate(true);
      }
    }
  }, [syndicate]);

  // array of addresses to be allowed by the Syndicate, of maximum size equal to the maximum number of LPs.",
  const [memberAddresses, setMemberAddresses] = useState("");
  const [lpAddressesError, setLpAddressesError] = useState<string>("");
  const [showMemberAddressError, setShowMemberAddressError] =
    useState<boolean>(false);
  const [selectedTextIndexes, setSelectedTextIndexes] = useState([]);

  const [membersArray, setMembersArray] = useState([]);
  const [addressFile, setAddressFile] = useState(null);

  /**
   * This method sets the approved addresses
   * It also validates the input value and set appropriate error message
   */
  const handleLpAddressesChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setUseCSV(false);
    const { value } = event.target;
    setMemberAddresses(value);
  };

  const handleError = () => {
    // capture metamask error
    setShowWalletConfirmationModal(false);
  };

  /**
   * get past events that match current address
   * @param {string} memberAddress (what is typed or pasted on the pre-approve field)
   * token address
   */
  const checkPreExistingApprovedAddress = async (memberAddress: string) => {
    try {
      const { memberAddressAllowed } =
        await syndicateContracts.GetterLogicContract.getMemberInfo(
          syndicateAddress,
          memberAddress,
        );
      return memberAddressAllowed;
    } catch (err) {
      return false;
    }
  };

  /**
   * send data to set distributions for a syndicate
   * @param {object} data contains amount, syndicateAddress and distribution
   * token address
   */
  const handleSubmit = async () => {
    if (!validSyndicate) {
      throw "This syndicate does not exist and therefore we can't update its details.";
    }

    if (!membersArray.length) {
      setLpAddressesError("Approved address is required");
      setShowMemberAddressError(true);
      return;
    }

    /**
     * If we are not connected and the form modal is open, user can trigger
     * creation of Syndicate. We therefore catch this here and request for
     * wallet connection.
     * Note: We need to find a way, like a customized alert to inform user this.
     */
    if (!syndicateContracts) {
      // Request wallet connect
      return dispatch(showWalletModal());
    }

    try {
      // perform validations outside the class functions
      if (
        !(syndicateAddress as string).trim() ||
        !account.trim() ||
        !membersArray.length
      ) {
        return;
      }
      setShowWalletConfirmationModal(true);

      await syndicateContracts.AllowlistLogicContract.managerAllowAddresses(
        syndicateAddress,
        membersArray,
        account,
        () => {
          // Call back passed after transaction goes through
          setShowWalletConfirmationModal(false);
          setShowPreApproveDepositor(false);
          dispatch(setNewMemberAddresses(membersArray, true));
        },
        () => {
          dispatch(setNewMemberAddresses(membersArray, false));
        },
      );
    } catch (error) {
      setMembersArray([]);
      dispatch(setNewMemberAddresses(membersArray, false));
      handleError();
    }
  };

  const [indexOfAddress, setIndexOfAddress] = useState(-1);
  const validateAddressArr = (arr: string[]) => {
    // // get last element in array
    arr && arr.length
      ? arr.map(async (value: string, index) => {
          setValidating(true);
          if (web3.utils.isAddress(value)) {
            setLpAddressesError("");
            setShowMemberAddressError(false);

            const isAlreadyPreApproved = await checkPreExistingApprovedAddress(
              value,
            );

            // handle existing addresses
            if (isAlreadyPreApproved) {
              setShowMemberAddressError(true);
              setMembersArray([]);
              setLpAddressesError(`${value} has already been pre-approved.`);
            }

            // handle duplicates
            if (countOccurrences(arr, value) > 1) {
              setShowMemberAddressError(true);
              setMembersArray([]);
              setLpAddressesError(
                `${value} has already been added (duplicate).`,
              );
              setIndexOfAddress(index);
            }
            if (
              web3.utils.toChecksumAddress(value) === syndicate.managerCurrent
            ) {
              setShowMemberAddressError(true);
              setMembersArray([]);
              setLpAddressesError(
                `${value} must not be a manager of this Syndicate.`,
              );
              setIndexOfAddress(index);
            }
          } else {
            setShowMemberAddressError(true);
            setMembersArray([]);
            setLpAddressesError(`${value} is not a valid ERC20 address`);
            setIndexOfAddress(index);
          }
          setValidating(false);
        })
      : () => {
          setLpAddressesError("");
          setIndexOfAddress(-1);
        };
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    setUseCSV(false);

    let removeNewLines = memberAddresses;
    if (event.code === "Comma") {
      removeNewLines = removeNewLinesAndWhitespace(memberAddresses);
      const lpAddressesArr = removeNewLines.replace(",,", ",").split(",");
      setMemberAddresses(lpAddressesArr.join(",\n"));
      event.preventDefault();
    }

    // remove white spaces and newlines and append a comma to the end before
    // processing the addresses
    if (event.code === "Enter") {
      const removeNewLines = removeNewLinesAndWhitespace(memberAddresses) + ",";
      const lpAddressesArr = removeNewLines.replace(",,", ",").split(",");
      setMemberAddresses(lpAddressesArr.join(",\n"));
      event.preventDefault();
    }

    // we want to separate by , instead of space
    if (event.code === "Space") {
      const lpAddressesArr = memberAddresses.replace(",,", ",").split(" ");
      setMemberAddresses(lpAddressesArr.join(",\n"));
      event.preventDefault();
    }
  };

  const handleOnPaste = (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    setUseCSV(false);
    const pastedAddresses = event.clipboardData.getData("text");
    const removeInvalidCharacters =
      removeNewLinesAndWhitespace(pastedAddresses);
    const newSplitArr = removeInvalidCharacters.split(",");
    setMemberAddresses((prev) => {
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
    validateAddressArr(membersArray);
    event.preventDefault();
  };

  const handleOnSelectText = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setUseCSV(false);

    const { selectionStart, selectionEnd } = event.target;
    setSelectedTextIndexes([selectionStart, selectionEnd]);
  };

  const closeModal = () => {
    setShowPreApproveDepositor(false);
  };

  useEffect(() => {
    const arr = removeNewLinesAndWhitespace(memberAddresses).split(",");

    // get last element in array
    const lastElement = arr[arr.length - 1];

    // create new copy of split array
    const newSplitArr = [...arr];

    // check if empty string
    if (!lastElement) {
      newSplitArr.pop();
    }
    setMembersArray(newSplitArr);
    validateAddressArr(newSplitArr);
  }, [memberAddresses]);

  const {
    approveAddressesHeadingText,
    allowlistTextAreaLabel,
    allowlistBulktext,
  } = managerApproveAddressesConstants;

  const [importing, setImporting] = useState(false);
  const [validating, setValidating] = useState(false);
  const handleUpload = (event) => {
    setImporting(true);
    const fileUploaded = event.target.files[0];
    setAddressFile(fileUploaded);
    importCSV(fileUploaded);
  };

  const [useCSV, setUseCSV] = useState(false);
  const [CSVIsEmpty, setCSVIsEmpty] = useState("");
  const [xAddressNotAdded, setXAddressNotAdded] = useState(0);

  const importCSV = (file) => {
    setUseCSV(true);
    if (file) {
      Papa.parse(file, {
        complete: async (result: any) => {
          let addresses: string[] = [];
          let addressesNotAdded = 0;
          for (const item of result.data) {
            if (item[0] === "") continue;
            const isAlreadyPreApproved = await checkPreExistingApprovedAddress(
              item[0],
            );

            if (!isAlreadyPreApproved && web3.utils.isAddress(item[0])) {
              addresses.push(item[0]);
            } else {
              addressesNotAdded += 1;
            }
          }

          setXAddressNotAdded(addressesNotAdded);

          addresses = addresses.filter(onlyUnique);
          if (result.data.length == 0 || addresses.length == 0) {
            setCSVIsEmpty("This file doesn't contain any addresses.");
          } else if (result.data.length && !addresses.length) {
            setCSVIsEmpty(
              "Addresses contained in the file are already pre-approved.",
            );
          } else {
            setCSVIsEmpty("");
          }
          setImporting(false);

          validateAddressArr(addresses);
          setMembersArray(addresses);
        },
      });
    }
  };

  const deleteFile = () => {
    setAddressFile(null);
    setMembersArray([]);
    setLpAddressesError("");
    setCSVIsEmpty("");
    setUseCSV(false);
    setXAddressNotAdded(0);
  };

  const isSubmittable =
    membersArray.length && !importing && !validating && !showMemberAddressError;
  return (
    <>
      <Modal
        {...{
          title: "Add Members",
          show: showPreApproveDepositor,
          customWidth: "w-2/5",
          modalStyle: ModalStyle.DARK,
          titleMarginClassName: "mb-4 mt-2",
          showCloseButton: false,
          titleAlignment: "left",
          outsideOnClick: true,
          closeModal: () => setShowPreApproveDepositor(false),
        }}
      >
        <div className="flex justify-center">
          <div>
            <div className="text-gray-400 mb-6">
              {approveAddressesHeadingText}
            </div>
            <div className=" flex flex-col border-t border-gray-24 w-full">
              <div className="mt-6 mb-2">{allowlistTextAreaLabel}</div>
              <TextArea
                {...{
                  name: "addresses",
                  value: memberAddresses,
                  onChange: handleLpAddressesChange,
                  onPaste: handleOnPaste,
                  onKeyUp: handleKeyUp,
                  onSelect: handleOnSelectText,
                  error: useCSV ? "" : lpAddressesError,
                  classoverride:
                    "bg-transparent text-white border-inactive resize-none",
                }}
                name="approvedAddresses"
                placeholder="Separate them with either a comma, space, or line break"
              />
              <div
                className={`rounded border-dashed border border-gray-700 text-gray-400 py-4 px-5 mt-8 mb-4 flex align-center ${
                  addressFile ? "justify-between" : "justify-center"
                }`}
              >
                <FileUpload
                  file={addressFile}
                  importing={importing}
                  deleteFile={deleteFile}
                  handleUpload={handleUpload}
                  title="Import CSV file"
                  fileType=".csv"
                />
              </div>
              {(lpAddressesError || CSVIsEmpty || xAddressNotAdded > 0) &&
              useCSV ? (
                <p className="text-red-500 text-xs break-word -mt-3">
                  {xAddressNotAdded > 0
                    ? `${xAddressNotAdded} ${
                        xAddressNotAdded == 1 ? "address" : "addresses"
                      } cannot be added because they are either duplicates, invalid address(es) or are already in the allowlist.`
                    : "" || CSVIsEmpty || lpAddressesError}{" "}
                  {indexOfAddress > -1 && lpAddressesError
                    ? `(Row ${indexOfAddress + 1}) on the CSV file. ` +
                      xAddressNotAdded
                    : ""}
                </p>
              ) : null}
              {/* xAddressNotAdded */}
              <div className="rounded-lg bg-blue-navy bg-opacity-10 text-blue-navy py-4 px-5 my-8 leading-4 text-sm">
                {allowlistBulktext}
              </div>
            </div>
            <div className="flex items-center justify-end gap-4">
              <button className="text-gray-400 h-14" onClick={closeModal}>
                Cancel
              </button>
              <button
                className={`${
                  isSubmittable
                    ? "bg-white text-black"
                    : "bg-gray-700 text-gray-400"
                } h-14 py-2 px-10 rounded-lg ${
                  showMemberAddressError ? "cursor-not-allowed" : null
                }`}
                onClick={handleSubmit}
                disabled={showMemberAddressError || importing || validating}
              >
                {addressFile
                  ? "Import CSV File"
                  : isSubmittable
                  ? `Add ${membersArray.length} ${
                      membersArray.length > 1 ? "Addresses" : "Address"
                    }`
                  : "Add Addresses"}
              </button>
            </div>
          </div>
        </div>
      </Modal>
      {/* Tell user to confirm transaction on their wallet */}
      <ConfirmStateModal
        show={showWalletConfirmationModal}
        spinnerHeight="h-16"
        spinnerWidth="w-16"
        modalStyle={ModalStyle.DARK}
        width="w-2/5"
      >
        <div className="flex justify-centers m-auto mb-4">
          <p className="text-sm text-center mx-8 opacity-60">
            {confirmPreApproveAddressesText}
          </p>
        </div>
      </ConfirmStateModal>
    </>
  );
};

export default PreApproveDepositor;
