import {
  FinalStateModal,
  PendingStateModal,
  ConfirmStateModal,
} from "@/components/shared/transactionStates";
import {
  confirmingTransaction,
  waitTransactionTobeConfirmedText,
  confirmCreateSyndicateSubText,
} from "@/components/syndicates/shared/Constants";
import { getMetamaskError } from "@/helpers";
import React, { FC, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "next/router";
import { formatAddress } from "src/utils/formatAddress";

const ManagerPending: FC = () => {
  const [submitting, setSubmitting] = useState(false);

  /**
   * Final state variables
   */
  const [finalStateButtonText, setFinalButtonText] = useState("");
  const [finalStateHeaderText, setFinalStateHeaderText] = useState("");
  const [finalStateIcon, setFinalStateIcon] = useState("");
  const [showFinalState, setShowFinalState] = useState(false);

  const [showWalletConfirmationModal, setShowWalletConfirmationModal] =
    useState(false);

  const router = useRouter();
  const dispatch = useDispatch();

  const { syndicateAddress } = router.query;

  const {
    initializeContractsReducer: {
      syndicateContracts: { ManagerLogicContract },
    },
    web3Reducer: { web3: web3Instance },
  } = useSelector((state: RootState) => state);

  const { account } = web3Instance;

  const handleCloseFinalStateModal = async () => {
    setShowFinalState(false);
  };

  const handleError = (error) => {
    // capture metamask error
    setShowWalletConfirmationModal(false);

    const { code } = error;

    const errorMessage = getMetamaskError(code, "Manager Fee Address");
    setFinalButtonText("Dismiss");
    setFinalStateIcon("/images/roundedXicon.svg");

    if (code == 4001) {
      setFinalStateHeaderText("Transaction Rejected");
    } else {
      setFinalStateHeaderText(errorMessage);
    }
    setShowFinalState(true);
    setSubmitting(false);
  };

  const handleSuccess = (message) => {
    setFinalButtonText("Dismiss");
    setFinalStateIcon("/images/checkCircle.svg");
    setFinalStateHeaderText(message);
    setShowFinalState(true);
    router.replace(`/syndicates/${syndicateAddress}/manage`);
  };

  const handleManagerPendingConfirm = async () => {
    try {
      await ManagerLogicContract.managerPendingConfirm(
        syndicateAddress,
        account,
        setShowWalletConfirmationModal,
        setSubmitting,
        (value) => dispatch(setSubmitting(value)),
      );

      handleSuccess("Pending Manager Transfer Successful");
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <div className="w-full mt-4 mb-2">
        <div className="w-full rounded-2xl bg-gray-6 border-t-1 border-gray-6 py-6 px-6">
          <div className="py-2">
            <div className="flex justify-start items-center">
              <img
                src="/images/transfer-icon.svg"
                className="w-5"
                alt="transfer icon"
              />
              <div className="ml-2 text-sm font-whyte-bold tracking-wide">
                PENDING MANAGER TRANSFER
              </div>
            </div>

            <div className="mt-6">
              <p className="pb-6 font-whyte text-base text-gray-500">
                The wallet you’re connected with ({formatAddress(account, 4, 4)}
                ) has been assigned as the new manager address of this syndicate
                by its current manager.
              </p>
              <p className="pb-6 font-whyte text-base text-gray-500">
                Claiming this syndicate will make you its manager. Any existing
                assets will be transfered separately by the current manager.
              </p>
            </div>
            <button
              className="w-24 h-12 bg-white text-black rounded-md font-whyte"
              onClick={handleManagerPendingConfirm}
            >
              Claim
            </button>
          </div>
        </div>
      </div>

      {/* Tell user to confirm transaction on their wallet */}
      <ConfirmStateModal show={showWalletConfirmationModal}>
        <div className="flex flex-col justify-center m-auto mb-4">
          <p className="text-sm text-center mx-8 opacity-60">
            {confirmCreateSyndicateSubText}
          </p>
        </div>
      </ConfirmStateModal>
      {/* Pending state modal */}
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

      {/* show success modal */}
      <FinalStateModal
        show={showFinalState}
        handleCloseModal={async () => await handleCloseFinalStateModal()}
        icon={finalStateIcon}
        buttonText={finalStateButtonText}
        headerText={finalStateHeaderText}
        address={syndicateAddress ? syndicateAddress.toString() : ""} // first render is empty object
      />
    </>
  );
};

export default ManagerPending;
