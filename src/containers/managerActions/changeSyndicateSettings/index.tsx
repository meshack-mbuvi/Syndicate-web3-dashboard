import { TextInput } from "@/components/inputs";
import Modal from "@/components/modal";
import { PendingStateModal } from "@/components/shared/transactionStates";
import { ConfirmStateModal } from "@/components/shared/transactionStates/confirm";
import { FinalStateModal } from "@/components/shared/transactionStates/final";
import {
  confirmingTransaction,
  confirmSetManagerFeeAddressText,
  depositorAddressToolTip,
  rejectTransactionText,
  waitTransactionTobeConfirmedText,
} from "@/components/syndicates/shared/Constants";
import { getMetamaskError } from "@/helpers";
import { getSyndicateByAddress } from "@/redux/actions/syndicates";
import { RootState } from "@/redux/store";
import { isZeroAddress } from "@/utils/validators";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "src/components/buttons";

interface Props {
  showChangeSettings: boolean;
  setShowChangeSettings: Function;
}

const ChangeSyndicateSettings = (props: Props) => {
  const { showChangeSettings, setShowChangeSettings } = props;
  const [managerFeeAddress, setManagerFeeAddress] = useState("");
  const [managerFeeAddressError, setManagerFeeAddressError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // set metamask loading state
  const [
    showWalletConfirmationModal,
    setShowWalletConfirmationModal,
  ] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();

  const { syndicateAddress } = router.query;

  const { web3: web3Instance } = useSelector(
    (state: RootState) => state.web3Reducer
  );

  const { syndicateContractInstance } = useSelector(
    (state: RootState) => state.syndicateInstanceReducer
  );

  const handleManagerFeesAddress = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.preventDefault();
    const { value } = event.target;
    setManagerFeeAddress(value);
    if (!value.trim()) {
      setManagerFeeAddressError("Manager Fee Address token is required");
    } else if (!web3Instance?.web3.utils.isAddress(value)) {
      setManagerFeeAddressError(
        "Manager Fee Address should be a valid ERC20 address"
      );
    } else if (isZeroAddress(value)) {
      setManagerFeeAddressError(
        "Manager Fee Address should not be a zero address"
      );
    } else {
      setManagerFeeAddressError("");
    }
  };

  const handleError = (error) => {
    // capture metamask error
    setShowWalletConfirmationModal(false);
    setSubmitting(false);

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
  };

  /**
   * Final state variables
   */
  const [finalStateButtonText, setFinalButtonText] = useState("");
  const [finalStateHeaderText, setFinalStateHeaderText] = useState("");
  const [finalStateIcon, setFinalStateIcon] = useState("");
  const [showFinalState, setShowFinalState] = useState(false);

  const handleCloseFinalStateModal = async () => {
    setShowFinalState(false);
    setShowChangeSettings(false);

    await dispatch(
      getSyndicateByAddress(syndicateAddress, syndicateContractInstance)
    );
  };

  const handleSubmit = async (event) => {
    console.log("tests");

    event.preventDefault();

    setManagerFeeAddressError("");
    setShowWalletConfirmationModal(true);

    await syndicateContractInstance.methods
      .managerSetManagerFeeAddress(syndicateAddress, managerFeeAddress)
      .send({ from: web3Instance.account, gasLimit: 800000 })
      .on("transactionHash", () => {
        setShowWalletConfirmationModal(false);
        setSubmitting(true);
      })
      .on("receipt", async () => {
        setShowFinalState(true);
        setFinalStateHeaderText("Manager Fee Address is set.");
        setFinalStateIcon("/images/checkCircle.svg");
        setFinalButtonText("Done");
        setSubmitting(false);
      })
      .on("error", (error) => {
        handleError(error);
      });
  };

  return (
    <>
      <Modal
        {...{
          title: "Change Syndicate Settings",
          show: showChangeSettings,
          closeModal: () => setShowChangeSettings(false),
          customWidth: "md:w-1/2 w-full",
        }}>
        <div className="mx-2 mb-8">
          <form onSubmit={handleSubmit}>
            <div className="border w-full border-gray-93 bg-gray-99 rounded-xl p-4 py-8">
              <TextInput
                {...{
                  label: "Fee Recipient Address:",
                  tooltip: depositorAddressToolTip,
                  error: managerFeeAddressError,
                }}
                value={managerFeeAddress}
                name="depositorAddress"
                onChange={handleManagerFeesAddress}
              />
            </div>

            {/* submit button */}

            <div className="flex my-4 w-full justify-center py-2">
              <Button
                type="submit"
                customClasses={`rounded-full bg-blue-light w-auto px-10 py-2 text-lg ${
                  managerFeeAddress ? "" : "opacity-50"
                }`}
                disabled={managerFeeAddress ? false : true}>
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Tell user to confirm transaction on their wallet */}
      <ConfirmStateModal show={showWalletConfirmationModal}>
        <div className="flex flex-col justify-centers m-auto mb-4">
          <p className="text-sm text-center mx-8 opacity-60">
            {confirmSetManagerFeeAddressText}
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
        headerText={finalStateHeaderText}
      />
    </>
  );
};

export default ChangeSyndicateSettings;
