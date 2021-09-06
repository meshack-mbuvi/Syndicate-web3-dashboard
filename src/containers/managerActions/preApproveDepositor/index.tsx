import { TextArea } from "@/components/inputs";
import Modal , { ModalStyle } from "@/components/modal";
import { PendingStateModal } from "@/components/shared/transactionStates";
import ConfirmStateModal from "@/components/shared/transactionStates/confirm";
import FinalStateModal from "@/components/shared/transactionStates/final";
import { getMetamaskError } from "@/helpers";
import { showWalletModal } from "@/redux/actions";
import { RootState } from "@/redux/store";
import countOccurrences from "@/utils/countOccurrence";
import {
  isZeroAddress,
  removeNewLinesAndWhitespace,
  removeSubstring,
} from "@/utils/validators";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  confirmingTransaction,
  confirmPreApproveAddressesText,
  managerApproveAddressesConstants,
  preApproveMoreAddress,
  rejectTransactionText,
  waitTransactionTobeConfirmedText,
} from "src/components/syndicates/shared/Constants";
import { Spinner } from "@/components/shared/spinner";

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

  const [validSyndicate, setValideSyndicate] = useState(false);

  const router = useRouter();
  const { syndicateAddress } = router.query;

  const dispatch = useDispatch();

  // no syndicate exists without a manager, so if no manager, then syndicate does not exist
  useEffect(() => {
    if (syndicate) {
      // Checking for address 0x0000000; the default value set by solidity
      if (isZeroAddress(syndicate.currentManager)) {
        // address is empty
        setValideSyndicate(false);
      } else {
        setValideSyndicate(true);
      }
    }
  }, [syndicate]);

  // array of addresses to be allowed by the Syndicate, of maximum size equal to the maximum number of LPs.",
  const [memberAddresses, setMemberAddresses] = useState("");
  const [lpAddressesError, setLpAddressesError] = useState<string>("");
  const [showMemberAddressError, setShowMemberAddressError] =
    useState<boolean>(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedTextIndexes, setSelectedTextIndexes] = useState([]);

  /**
   * Final state variables
   */
  const [finalStateButtonText, setFinalButtonText] = useState("Done");
  const [finalStateFeedback, setFinalStateFeedback] = useState(
    preApproveMoreAddress,
  );
  const [finalStateHeaderText, setFinalStateHeaderText] = useState(
    "Addresses Successfully Pre-Approved",
  );

  const [finalStateIcon, setFinalStateIcon] = useState(
    "/images/checkCircle.svg",
  );
  const [showFinalState, setShowFinalState] = useState(false);
  const [membersArray, setMembers] = useState([]);
  const [addressFile, setAddressFile] = useState(null);

  const handleCloseFinalStateModal = async () => {
    setShowFinalState(false);
    setShowPreApproveDepositor(false);
  };

  /**
   * This method sets the approved addresses
   * It also validates the input value and set appropriate error message
   */
  const handleLpAddressesChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const { value } = event.target;
    setMemberAddresses(value);
  };

  const handleError = (error) => {
    // capture metamask error
    setShowWalletConfirmationModal(false);
    setSubmitting(false);

    const { code } = error;
    const errorMessage = getMetamaskError(code, "Member deposit modified.");
    setFinalButtonText("Dismiss");
    setFinalStateIcon("/images/roundedXicon.svg");
    setFinalStateFeedback("");

    if (code == 4001) {
      setFinalStateHeaderText("Transaction Rejected");
    } else {
      setFinalStateHeaderText(errorMessage);
    }
    setShowFinalState(true);
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

    if (!memberAddresses) {
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
          setSubmitting(true);
        },
      );

      setShowFinalState(true);
      setFinalStateHeaderText("Addresses Successfully Pre-Approved");
      setFinalStateFeedback(preApproveMoreAddress);
      setFinalStateIcon("/images/checkCircle.svg");
      setFinalButtonText("Done");
    } catch (error) {
      handleError(error);
    }
  };

  const validateAddressArr = (arr:string[]) => {
    // // get last element in array

    arr && arr.length
      ? arr.map(async (value: string) => {
          if (web3.utils.isAddress(value)) {
            setLpAddressesError("");
            setShowMemberAddressError(false);

            const isAlreadyPreApproved = await checkPreExistingApprovedAddress(
              value,
            );

            // handle existing addresses
            if (isAlreadyPreApproved) {
              setShowMemberAddressError(true);
              setLpAddressesError(`${value} has already been pre-approved.`);
            }

            // handle duplicates
            if (countOccurrences(arr, value) > 1) {
              setShowMemberAddressError(true);
              setLpAddressesError(
                `${value} has already been added (duplicate).`,
              );
            }
          } else {
            setShowMemberAddressError(true);
            setLpAddressesError(`${value} is not a valid ERC20 address`);
          }
        })
      : setLpAddressesError("");
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.code === "Comma") {
      const removeNewLines = removeNewLinesAndWhitespace(memberAddresses);
      const lpAddressesArr = removeNewLines.split(",");
      setMemberAddresses(lpAddressesArr.join(",\n"));
      event.preventDefault();
    }
  };
  const handleOnPaste = (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
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
    const { selectionStart, selectionEnd } = event.target;
    setSelectedTextIndexes([selectionStart, selectionEnd]);
  };

  useEffect(() => {
    const arr = removeNewLinesAndWhitespace(memberAddresses).split(",")
    // get last element in array
    const lastElement = arr[arr.length - 1];

    // create new copy of split array
    const newSplitArr = [...arr];

    // check if empty string
    if (!lastElement) {
    newSplitArr.pop();
    }
    setMembers(newSplitArr)
    validateAddressArr(newSplitArr);
}, [memberAddresses])

  const {
    approveAddressesWarning,
    approveAddressesHeadingText,
    textAreaTitle,
    allowlistTextAreaLabel,
    allowlistBulktext,
    approvedAddressesLabel,
    separateWithCommas,
  } = managerApproveAddressesConstants;

  const hiddenFileInput = React.useRef(null);
  const handleUpload = (event) => {
    const fileUploaded = event.target.files[0];
    setAddressFile(fileUploaded)
  };

//   to add lg and md w
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
        }}
      >
        <div className="flex justify-center">
          <div>
            <div className="text-gray-400 mb-6">
              {approveAddressesHeadingText}
            </div>
            <div className="border-t border-gray-24 w-full">
              <div className="mt-6 mb-2">
                {allowlistTextAreaLabel}
              </div>
              <TextArea
                {...{
                  name: "addresses",
                  value: memberAddresses,
                  onChange: handleLpAddressesChange,
                  onPaste: handleOnPaste,
                  onKeyUp: handleKeyUp,
                  onSelect: handleOnSelectText,
                  error: lpAddressesError,
                  classoverride: "bg-gray-4 text-white border-inactive",
                }}
                name="approvedAddresses"
                placeholder="Separate them with either a comma, space, or line break"
              />
              <div className={`rounded border-dashed border border-gray-700 text-gray-400 py-4 px-5 my-8 flex align-center ${addressFile? "justify-between":"justify-center"}`}>
                {addressFile? 
                <>
                <div><img src="/images/file-icon-white.svg" alt="File icon"/><span className="ml-2.5 text-white">{addressFile.name}</span></div>
                <span className="cursor-pointer hover:opacity-70"><img src="/images/close-circle.svg" alt="Close Icon" /></span>
                </>:
                <>
                <input type="file" className="hidden" onChange={handleUpload} ref={hiddenFileInput}/>
                <button className="cursor-pointer hover:opacity-70 flex" onClick={() => hiddenFileInput.current.click()} >
                    <img src="/images/file-upload.svg" alt="Import CSV File" /> <span className="leading-4 ml-2.5">Import CSV file</span>
                </button>
                </>
                }
              </div>
              <div className="rounded-lg bg-blue-navy bg-opacity-10 text-blue-navy py-4 px-5 my-8 leading-4 text-sm">
                  {allowlistBulktext}
              </div>
            </div>
            <div className="flex items-center justify-end gap-4">
            <button
                className={`text-gray-400 h-14 ${
                  showMemberAddressError ? "cursor-not-allowed" : null
                }`}
                onClick={() => setShowPreApproveDepositor(false)}
                disabled={showMemberAddressError}
              >
                Cancel
              </button>
              <button
                className={`${membersArray.length? "bg-white text-black":"bg-gray-700 text-gray-400"} h-14 py-2 px-10 rounded-lg ${
                  showMemberAddressError ? "cursor-not-allowed" : null
                }`}
                onClick={handleSubmit}
                disabled={showMemberAddressError}
              >
                {membersArray.length? `Add ${membersArray.length} Addresses`: "Add Addresses"}
              </button>
            </div>
          </div>
        </div>
      </Modal>
      {/* Tell user to confirm transaction on their wallet */}
      <ConfirmStateModal show={showWalletConfirmationModal}>
        <div className="flex flex-col justify-centers m-auto mb-4">
          <p className="text-sm text-center mx-8 opacity-60">
            {confirmPreApproveAddressesText}
          </p>
          <p className="text-sm text-center mx-8 mt-2 opacity-60">
            {rejectTransactionText}
          </p>
        </div>
      </ConfirmStateModal>
      {/* Loading modal */}
      <PendingStateModal
        {...{
          show: submitting,
        }}
      >
        <div className="modal-header mb-4 font-medium text-center leading-8 text-2xl">
          {confirmingTransaction}
        </div>
        <div className="flex flex-col justify-center m-auto mb-4">
          <p className="text-sm text-center mx-8 opacity-60">
            {waitTransactionTobeConfirmedText}
          </p>
        </div>
      </PendingStateModal>
      <FinalStateModal
        show={showFinalState}
        handleCloseModal={async () => await handleCloseFinalStateModal()}
        icon={finalStateIcon}
        buttonText={finalStateButtonText}
        feedbackText={finalStateFeedback}
        headerText={finalStateHeaderText}
        address={syndicateAddress.toString()}
      />
    </>
  );
};

export default PreApproveDepositor;
