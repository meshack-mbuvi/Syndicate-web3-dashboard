import Papa from 'papaparse';
import { TextArea } from "@/components/inputs";
import Modal , { ModalStyle } from "@/components/modal";
import ConfirmStateModal from "@/components/shared/transactionStates/confirm";
import { getMetamaskError } from "@/helpers";
import { showWalletModal } from "@/redux/actions";
import { setNewMemberAddresses } from "@/redux/actions/manageMembers"
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
  confirmPreApproveAddressesText,
  managerApproveAddressesConstants,
  preApproveMoreAddress,
} from "src/components/syndicates/shared/Constants";
import FileUpload from "@/components/shared/fileUploader";

interface Props {
  showPreApproveDepositor: boolean;
  setShowPreApproveDepositor;
  setAddingMember,
}

/**
 * This component displays a form with textarea to set approved addresses
 * @param props
 * @returns
 */

const PreApproveDepositor = (props: Props): JSX.Element => {
  const { showPreApproveDepositor, setShowPreApproveDepositor, setAddingMember } = props;

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
  const [membersArray, setMembersArray] = useState([]);
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
    setAddingMember(false);

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
   *  @param {string[]} members 
   * @param {boolean memberAllowed}
   * @returns 
   */
  const addNewMemberAddress = (members:string[], memberAllowed?: boolean) => {
    const newMembers = members.map((address: string) => {
      return {
        memberAddress: address,
        memberDeposit: "0",
        memberClaimedDistribution: "0",
        allowlistEnabled: true,
        memberAddressAllowed: memberAllowed,
        memberStake: "0.0"
      };
    });
    dispatch(setNewMemberAddresses(newMembers));
  }

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
      addNewMemberAddress(membersArray, false);
      await syndicateContracts.AllowlistLogicContract.managerAllowAddresses(
        syndicateAddress,
        membersArray,
        account,
        () => {
          // Call back passed after transaction goes through
          setShowWalletConfirmationModal(false);
          setShowPreApproveDepositor(false)
          setAddingMember(true)
        },
      );

      addNewMemberAddress(membersArray, true);
      setAddingMember(false);
    } catch (error) {
      setMembersArray([])
      addNewMemberAddress([],false);
      handleError(error);
      setAddingMember(false);
    }
  };
  
  const validateAddressArr = (arr:string[]) => {
    // // get last element in array

    arr && arr.length
      ? arr.map(async (value: string) => {
          setValidating(true)
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
            }
          } else {
            setShowMemberAddressError(true);
            setMembersArray([]);
            setLpAddressesError(`${value} is not a valid ERC20 address`);
          }
          setValidating(false)
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

  const closeModal = () =>{
    setShowPreApproveDepositor(false);
    addNewMemberAddress([]);
  }

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
    setMembersArray(newSplitArr);
    validateAddressArr(newSplitArr);
}, [memberAddresses])

  const {
    approveAddressesHeadingText,
    allowlistTextAreaLabel,
    allowlistBulktext,
  } = managerApproveAddressesConstants;

  const [importing, setImporting] = useState(false)
  const [validating, setValidating] = useState(false)
  const handleUpload = (event) => {
    setImporting(true);
    const fileUploaded = event.target.files[0];
    setAddressFile(fileUploaded);
    importCSV(fileUploaded);
  };

  const importCSV = (file) => {
    if(file){
    Papa.parse(file, {
      complete: (result:any) => {
        const addresses: string[]= []
        for(const item of result.data){
          if(item.address ===  "" || item.Address === "") continue;
          if(!item.address && !item.Address){
            setLpAddressesError("Address column is required");
            setShowMemberAddressError(true);
            setMembersArray([]);
            setImporting(false);
            return
          }
          addresses.push(item.address || item.Address);
        }
        setImporting(false);
        validateAddressArr(addresses);
        setMembersArray(addresses);
      },
      header: true
    });
  }
  }

  const deleteFile = () => {
    setAddressFile(null)
    setMembersArray([])
    setLpAddressesError("")
  }

  const isSubmittable = membersArray.length && !importing && !validating && !showMemberAddressError;
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
          titleAlignment: "left"
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
              <div className={`rounded border-dashed border border-gray-700 text-gray-400 py-4 px-5 my-8 flex align-center ${addressFile ? "justify-between":"justify-center"}`}>
                <FileUpload 
                  file={addressFile}
                  importing={importing}
                  deleteFile={deleteFile}
                  handleUpload={handleUpload}
                  title="Import CSV file"
                  fileType=".csv"
                />
              </div>
              <div className="rounded-lg bg-blue-navy bg-opacity-10 text-blue-navy py-4 px-5 my-8 leading-4 text-sm">
                  {allowlistBulktext}
              </div>
            </div>
            <div className="flex items-center justify-end gap-4">
            <button
                className="text-gray-400 h-14"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className={`${isSubmittable ?
                  "bg-white text-black" : "bg-gray-700 text-gray-400"} h-14 py-2 px-10 rounded-lg ${
                  showMemberAddressError ? "cursor-not-allowed" : null
                }`}
                onClick={handleSubmit}
                disabled={showMemberAddressError || importing || validating}
              >
                {addressFile ? "Import CSV File" :isSubmittable? `Add ${membersArray.length} Addresses`: "Add Addresses"} 
              </button>
            </div>
          </div>
        </div>
      </Modal>
      {/* Tell user to confirm transaction on their wallet */}
      <ConfirmStateModal
        show={showWalletConfirmationModal}
        spinnerHeight="h-16" spinnerWidth="w-16"
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
