import { TextArea } from "@/components/inputs";
import Modal from "@/components/modal";
import { PendingStateModal } from "@/components/shared/transactionStates";
import ConfirmStateModal from "@/components/shared/transactionStates/confirm";
import FinalStateModal from "@/components/shared/transactionStates/final";
import { getMetamaskError } from "@/helpers";
import { showWalletModal } from "@/redux/actions";
import { getSyndicateByAddress } from "@/redux/actions/syndicates";
import { isZeroAddress } from "@/utils/validators";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { RootStateOrAny, useDispatch, useSelector } from "react-redux";
import {
  confirmingTransaction,
  confirmPreApproveAddressesText,
  managerApproveAddressesConstants,
  preApproveMoreAddress,
  rejectTransactionText,
  waitTransactionTobeConfirmedText,
} from "src/components/syndicates/shared/Constants";

interface Props {
  showPreApproveDepositor: boolean;
  setShowPreApproveDepositor: Function;
}

/**
 * This component displays a form with textarea to set approved addresses
 * @param props
 * @returns
 */

const PreApproveDepositor = (props: Props) => {
  const { showPreApproveDepositor, setShowPreApproveDepositor } = props;

  const {
    web3: { account, web3 },
  } = useSelector((state: RootStateOrAny) => state.web3Reducer);

  const { syndicateContractInstance } = useSelector(
    (state: RootStateOrAny) => state.syndicateInstanceReducer
  );

  const { syndicate } = useSelector(
    (state: RootStateOrAny) => state.syndicatesReducer
  );

  const [
    showWalletConfirmationModal,
    setShowWalletConfirmationModal,
  ] = useState(false);

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
  const [lpAddresses, setLpAddresses] = useState("");
  const [lpAddressesError, setLpAddressesError] = useState<string>("");
  const [showLPError, setShowLPError] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState(false);

  /**
   * Final state variables
   */
  const [finalStateButtonText, setFinalButtonText] = useState("Done");
  const [finalStateFeedback, setFinalStateFeedback] = useState(
    preApproveMoreAddress
  );
  const [finalStateHeaderText, setFinalStateHeaderText] = useState(
    "Addresses Successfully Pre-Approved"
  );

  const [finalStateIcon, setFinalStateIcon] = useState(
    "/images/checkCircle.svg"
  );
  const [showFinalState, setShowFinalState] = useState(false);

  const handleCloseFinalStateModal = async () => {
    setShowFinalState(false);
    setShowPreApproveDepositor(false);

    await dispatch(
      getSyndicateByAddress(syndicateAddress, syndicateContractInstance)
    );
  };

  /**
   * This method sets the approved addresses
   * It also validates the input value and set appropriate error message
   */
  const handleLpAddressesChange = (event) => {
    const { value } = event.target;

    const removeEnter = value.replace(/^\s+|\s+$/g, "");
    const removeSpace = removeEnter.replace(/\s/g, "");

    // convert comma separated string into array
    const splitArr = removeSpace.split(",");

    // get last element in array
    const lastElement = splitArr[splitArr.length - 1];

    // create new copy of split array
    let newSplitArr = [...splitArr];

    // check if empty string
    if (!lastElement) {
      newSplitArr.pop();
    }

    // validate addresses
    newSplitArr && newSplitArr.length
      ? newSplitArr.map((value: string) => {
          if (web3.utils.isAddress(value)) {
            setLpAddressesError("");
            setShowLPError(false);
          } else {
            setShowLPError(true);
            console.log({ showLPError });
            setLpAddressesError(`${value} is not a valid ERC20 address`);
          }
        })
      : setLpAddressesError("");

    // join the array to comma separated string
    setLpAddresses(splitArr.join());
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
   * send data to set distributions for a syndicate
   * @param {object} data contains amount, syndicateAddress and distribution
   * token address
   */
  const handleSubmit = async () => {
    if (!validSyndicate) {
      throw "This syndicate does not exist and therefore we can't update its details.";
    }

    if (!lpAddresses) {
      setLpAddressesError("Approved address is required");
      setShowLPError(true);
      return;
    }

    /**
     * If we are not connected and the form modal is open, user can trigger
     * creation of Syndicate. We therefore catch this here and request for
     * wallet connection.
     * Note: We need to find a way, like a customized alert to inform user this.
     */
    if (!syndicateContractInstance) {
      // Request wallet connect
      return dispatch(showWalletModal());
    }

    try {
      // convert comma separated string into array
      const splitArr = lpAddresses.split(",");

      // get last element in array
      const lastElement = splitArr[splitArr.length - 1];

      // create new copy of split array
      let newSplitArr = [...splitArr];

      // check if empty string
      if (!lastElement) {
        newSplitArr.pop();
      }

      setShowWalletConfirmationModal(true);

      await syndicateContractInstance.methods
        .allowAddresses(syndicateAddress, newSplitArr)
        .send({ from: account, gasLimit: 800000 })
        .on("transactionHash", () => {
          // close wallet confirmation modal
          setShowWalletConfirmationModal(false);
          setSubmitting(true);
        })
        .on("receipt", async () => {
          setSubmitting(false);

          setShowFinalState(true);
          setFinalStateHeaderText("Addresses Successfully Pre-Approved");
          setFinalStateFeedback(preApproveMoreAddress);
          setFinalStateIcon("/images/checkCircle.svg");
          setFinalButtonText("Done");
        })
        .on("error", (error) => {
          handleError(error);
        });
    } catch (error) {
      handleError(error);
    }
  };

  const {
    approveAddressesWarning,
    approveAddressesHeadingText,
    textAreaTitle,
    approvedAddressesLabel,
    separateWithCommas,
    buttonText,
  } = managerApproveAddressesConstants;

  return (
    <>
      <Modal
        {...{
          title: "Pre-Approve Depositors",
          show: showPreApproveDepositor,
          closeModal: () => setShowPreApproveDepositor(false),
          customWidth: "sm:w-2/3",
        }}>
        <div className="mt-5 sm:mt-6 flex justify-center">
          <div>
            <div className="text-gray-400 py-6">
              {approveAddressesHeadingText}
            </div>
            <div className="font-bold	">{approveAddressesWarning}</div>
            <div className="text-blue-light font-semibold	pt-10 pl-4">
              {textAreaTitle}
            </div>
            <div className="border-2 rounded-lg	bg-gray-99 mt-2 flex px-10 py-6">
              <div className="w-2/5 mt-6">
                <p>{approvedAddressesLabel}:</p>
                <p>{separateWithCommas}</p>
              </div>
              <TextArea
                {...{
                  name: "addresses",
                  value: lpAddresses,
                  onChange: handleLpAddressesChange,
                  error: lpAddressesError,
                }}
                defaultValue=""
                name="approvedAddresses"
                placeholder=""
              />
            </div>
            <div className="flex items-center	justify-center pt-6">
              {submitting ? (
                <div className="loader"></div>
              ) : (
                <button
                  className={`bg-blue-light text-white	py-2 px-10 rounded-full ${
                    showLPError ? "cursor-not-allowed" : null
                  }`}
                  onClick={handleSubmit}
                  disabled={showLPError}>
                  {buttonText}
                </button>
              )}
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
        }}>
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
      />
    </>
  );
};

export default PreApproveDepositor;
