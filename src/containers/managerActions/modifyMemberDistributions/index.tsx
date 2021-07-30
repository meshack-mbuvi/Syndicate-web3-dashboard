import { InputWithAddon, TextInput } from "@/components/inputs";
import Modal from "@/components/modal";
import { Spinner } from "@/components/shared/spinner";
import { PendingStateModal } from "@/components/shared/transactionStates";
import ConfirmStateModal from "@/components/shared/transactionStates/confirm";
import FinalStateModal from "@/components/shared/transactionStates/final";
import {
  confirmingTransaction,
  memberAddressToolTip,
  ModifyMemberDistributionsConstants,
  rejectTransactionText,
  waitTransactionTobeConfirmedText,
} from "@/components/syndicates/shared/Constants";
import { getMetamaskError } from "@/helpers";
import { getSyndicateMemberInfo } from "@/helpers/syndicate";
import { showWalletModal } from "@/redux/actions";
import {
  setSelectedMemberAddress,
  setShowModifyMemberDistributions,
} from "@/redux/actions/manageActions";
import { updateMemberWithdrawalDetails } from "@/redux/actions/syndicateMemberDetails/memberWithdrawalsInfo";
import { RootState } from "@/redux/store";
import { divideIfNotByZero, getWeiAmount } from "@/utils/conversions";
import { isZeroAddress, Validate } from "@/utils/validators";
import { isEmpty } from "lodash";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "src/components/buttons";
import { MemberDistributionItem } from "./memberDistributionItem";

/**
 * This component displays a form with input fields used to modify a syndicate
 * cap table.
 * @param props
 * @returns
 */
const ModifyMemberDistributions = (): JSX.Element => {
  const {
    newDistributionClaimedAmountTooltip,
    confirmModifyMemberDistributionsText,
  } = ModifyMemberDistributionsConstants;

  const {
    syndicatesReducer: { syndicate },
    initializeContractsReducer: { syndicateContracts },
    web3Reducer: {
      web3: { account, web3 },
    },
    manageActionsReducer: {
      manageActions: { modifyMemberDistribution, memberAddress },
    },
    syndicateMemberDetailsReducer: {
      syndicateDistributionTokens,
      memberWithdrawalDetails,
    },
    manageMembersDetailsReducer: {
      syndicateManageMembers: { loading },
    },
  } = useSelector((state: RootState) => state);

  const dispatch = useDispatch();

  const [
    showWalletConfirmationModal,
    setShowWalletConfirmationModal,
  ] = useState(false);

  const [validSyndicate, setValidSyndicate] = useState(false);

  const router = useRouter();

  const { syndicateAddress } = router.query;

  const [depositorAddressError, setDepositAddressError] = useState("");

  const [newDistributionAmount, setNewDistributionAmount] = useState<
    string | number
  >(0);

  const [amountError, setAmountError] = useState<string>("");

  const [submitting, setSubmitting] = useState(false);
  const [memberClaimedDistributions, setMemberClaimedDistributions] = useState(
    null,
  );

  // state variables for modifyDistribution modal
  const [
    showModifydistributionModal,
    setShowModifydistributionModal,
  ] = useState(false);
  const [distributionSymbol, setDistributionSymbol] = useState("");
  const [
    {
      tokenAddress,
      tokenDecimals,
      memberDistributionsToDate,
      memberDistributionsWithdrawalsToDate,
      memberWithdrawalsToDistributionsPercentage,
    },
    setMemberClaimedDistribution,
  ] = useState({
    tokenAddress: "",
    tokenDecimals: "",
    memberDistributionsToDate: "",
    memberDistributionsWithdrawalsToDate: "",
    memberWithdrawalsToDistributionsPercentage: "",
  });

  useEffect(() => {
    if (
      memberAddress.trim() &&
      memberWithdrawalDetails &&
      web3.utils.isAddress(memberAddress)
    ) {
      setMemberClaimedDistributions(memberWithdrawalDetails[memberAddress]);
    }
  }, [memberWithdrawalDetails, memberAddress]);

  useEffect(() => {
    if (
      syndicateDistributionTokens?.length &&
      memberAddress.trim() &&
      web3.utils.isAddress(memberAddress)
    ) {
      dispatch(
        updateMemberWithdrawalDetails({
          syndicateAddress: syndicate.syndicateAddress,
          distributionTokens: syndicateDistributionTokens,
          memberAddresses: [memberAddress],
        }),
      );
    }
  }, [memberAddress, syndicateDistributionTokens, syndicate]);

  useEffect(() => {
    if (memberAddress && depositorAddressError == "") {
      getMemberDepositAmount();
    }
  }, [memberAddress]);

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

  const handleSetShowModifyMemberDistributions = () => {
    dispatch(setShowModifyMemberDistributions(false));
  };

  /**
   * This function retrieves all total deposits for the depositor address
   * @param depositorAddress
   * @returns
   */
  const getMemberDepositAmount = async () => {
    try {
      const { memberDeposits } = await getSyndicateMemberInfo(
        syndicateContracts.GetterLogicContract,
        syndicateAddress,
        memberAddress,
      );
      if (memberDeposits === "0") {
        setDepositAddressError(
          "Member address has zero deposits in this Syndicate",
        );
      }
    } catch (error) {
      setDepositAddressError(
        "Member address has zero deposits in this Syndicate",
      );
    }
  };

  /**
   * This method sets the member address which the depositor used to send
   * funds to the manager.
   */
  const handleMemberAddressChange = (event) => {
    const { value } = event.target;
    setDepositAddressError("");
    dispatch(setSelectedMemberAddress(value));

    if (!value.trim()) {
      setDepositAddressError("Member address is required");
    } else if (web3 && !web3.utils.isAddress(value)) {
      setDepositAddressError(
        "Member address should be a valid Ethereum address",
      );
    } else if (isZeroAddress(value)) {
      setDepositAddressError("Member address cannot be zero address");
    } else {
      setDepositAddressError("");
    }
  };

  /**
   * This method sets the amount of funds the depsitor send to the manager.
   * It also validates the input value and set appropriate error message
   */
  const newDistributionsAmountHandler = (event) => {
    event.preventDefault();
    const { value } = event.target;
    setNewDistributionAmount(value);

    const message = Validate(value);
    if (message) {
      setAmountError(`Distribution amount ${message}`);
    } else if (+value > +memberDistributionsToDate) {
      setAmountError(
        `Distribution amount cannot exceed total member distributions.`,
      );
    } else {
      setAmountError("");
    }
  };

  const handleError = (error) => {
    // capture metamask error
    setShowWalletConfirmationModal(false);
    setSubmitting(false);

    const { code } = error;
    const errorMessage = getMetamaskError(code, "Modify member distributions");
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
   * send data to set distributions for a syndicate
   * @param {object} data contains amount, syndicateAddress and distribution
   * token address
   */
  const onSubmit = async (event) => {
    event.preventDefault();

    if (!validSyndicate) {
      throw "This syndicate does not exist and therefore we can't update its details.";
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
      setShowWalletConfirmationModal(true);
      const amountInWei = getWeiAmount(
        newDistributionAmount.toString(),
        parseInt(tokenDecimals, 10),
        true,
      );

      await syndicateContracts.DistributionLogicContract.managerSetDistributionsClaimedForMembers(
        syndicateAddress,
        [memberAddress],
        [tokenAddress],
        [amountInWei],
        account,
        setShowWalletConfirmationModal,
        setSubmitting,
      );

      setSubmitting(false);

      setShowFinalState(true);
      setFinalStateHeaderText("Member distributions modified.");
      setFinalStateIcon("/images/checkCircle.svg");
      setFinalButtonText("Done");
      setSubmitting(false);
    } catch (error) {
      setSubmitting(false);

      handleError(error);
    }
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

    // close the modify distribution modal
    setShowModifydistributionModal(false);

    // trigger refetching of member distribution details
    dispatch(
      updateMemberWithdrawalDetails({
        syndicateAddress: syndicate.syndicateAddress,
        distributionTokens: syndicateDistributionTokens,
        memberAddresses: [memberAddress],
      }),
    );
  };
  /**
   * When `Modify` button is clicked, the following happens:
   *   - set symbol of the distribution item and save it to local variable.
   *   - activate the next modal from where we can modify member distributions.
   * @param tokenSymbol
   */
  const handleModifyButtonClick = (distributionSymbol: string): void => {
    setNewDistributionAmount(0);
    setShowModifydistributionModal(true);
    setDistributionSymbol(distributionSymbol);
    setMemberClaimedDistribution(
      memberClaimedDistributions[distributionSymbol],
    );
  };

  /**
   * This function:
   *  - closes the modal used to modify distributions claimed by member.
   *  - Re-enables the modal with member distribution details
   */
  const handleCloseModifyDistributionModal = () => {
    setShowModifydistributionModal(false);

    // Re-open member distribution details modal
    dispatch(setShowModifyMemberDistributions(true));
  };

  const newClaimedAmount =
    +memberDistributionsWithdrawalsToDate + +newDistributionAmount;
  const newMemberWithdrawalsToDistributionsPercentage = divideIfNotByZero(
    newClaimedAmount * 100,
    memberDistributionsToDate,
  ).toFixed(2);

  // disable/enable submit button
  const buttonDisabled =
    !(newDistributionAmount > 0) ||
    !newDistributionAmount ||
    amountError ||
    submitting
      ? true
      : false;

  return (
    <>
      <Modal
        {...{
          title: "Modify Member Distributions",
          show: modifyMemberDistribution && !showModifydistributionModal,
          closeModal: () => handleSetShowModifyMemberDistributions(),
          customWidth: "md:w-8/12 w-full",
        }}
      >
        <div className="mx-2 mb-8">
          <p className="text-gray-500 text-sm my-4">
            Manually change the claimed distribution amount of members from this
            syndicate.
          </p>
          <p className="mt-2 mb-8 font-bold">
            WARNING: This function is intended to help syndicates fix user
            errors or make one-off exceptions. This should NOT be used
            frequently, and when changes are made, we recommend messaging your
            syndicate’s members with additional context and detail on the change
            to prevent any confusion.
          </p>

          <div>
            <p className="mx-4 my-4 text-lg font-bold">
              Modify Claimed Amounts
            </p>

            {validSyndicate ? (
              <div className="">
                <div className="border w-full border-gray-93 bg-gray-99 rounded-xl rounded-b-none last:rounded-b-xl py-8">
                  <div className="space-y-2">
                    <TextInput
                      {...{
                        label: "Member Address:",
                        tooltip: memberAddressToolTip,
                        onChange: handleMemberAddressChange,
                        error: depositorAddressError,
                        full: true,
                      }}
                      value={memberAddress.toString()}
                      name="depositorAddress"
                    />
                  </div>
                </div>
                {!loading ? (
                  !isEmpty(memberClaimedDistributions) &&
                  !depositorAddressError && (
                    <div className="border w-full border-gray-93 bg-gray-99 space-y-2 border-t-0 rounded-b-xl px-4 py-4">
                      {Object.keys(memberClaimedDistributions).map(
                        (key, index) => (
                          <MemberDistributionItem
                            key={index}
                            {...{
                              ...memberClaimedDistributions[key],
                              symbol: key,
                              handleModifyButtonClick,
                            }}
                          />
                        ),
                      )}
                    </div>
                  )
                ) : (
                  <Spinner />
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-row justify-center">
                  <p className="text-green-500">
                    {
                      "There is no syndicate with given address. Make sure the syndicate address you are using is valid."
                    }
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>

      <Modal
        {...{
          show: showModifydistributionModal,
          closeModal: () => handleCloseModifyDistributionModal(),
          showBackButton: true,
          showCloseButton: false,
          customWidth: "md:w-8/12 w-full",
        }}
      >
        <div className="mx-2 mb-8">
          <form onSubmit={onSubmit}>
            <div>
              <p className="mx-8 -mt-4 mb-4 text-lg font-whyte">
                {`Modify ${distributionSymbol} Claimed Amounts`}
              </p>

              {validSyndicate ? (
                <div className="">
                  <div className="border w-full border-gray-93 bg-gray-99 rounded-xl rounded-b-none last:rounded-b-xl px-4 py-8">
                    <div className="space-y-2">
                      <TextInput
                        {...{
                          label: "Member Address:",
                          tooltip: memberAddressToolTip,
                          full: true,
                        }}
                        value={memberAddress.toString()}
                        name="depositorAddress"
                        disabled={true}
                      />
                    </div>
                  </div>

                  <div className="border w-full border-gray-93 bg-gray-99 space-y-2 border-t-0 rounded-b-xl px-4 py-4">
                    {/* current member claimed distribution */}
                    <div className="flex flex-row justify-between">
                      <div className={`flex w-2/5  pr-4 justify-end`}>
                        <span className="block py-2 text-black text-base font-whyte">
                          {`Current Claimed Amount:`}
                        </span>
                      </div>
                      <div
                        className={`flex justify-between w-3/5 pr-12s justify-ends font-whyte`}
                      >
                        <p className="py-2 text-gray-400 text-base font-whyte">
                          <span className="pr-1 text-black font-whyte">
                            {`${memberDistributionsWithdrawalsToDate} ${distributionSymbol} /`}
                          </span>
                          {`${memberDistributionsToDate} ${distributionSymbol} (${memberWithdrawalsToDistributionsPercentage}%)`}
                        </p>
                      </div>
                    </div>

                    <InputWithAddon
                      {...{
                        label: "Additional Claimed Amount:",
                        value: newDistributionAmount,
                        onChange: newDistributionsAmountHandler,
                        error: amountError,
                        tooltip: newDistributionClaimedAmountTooltip,
                        type: "number",
                        addOn: distributionSymbol,
                      }}
                    />

                    {/* New member claimed amount */}
                    <div className="flex flex-row justify-between">
                      <div className={`flex w-2/5  pr-4 justify-end`}>
                        <span className="block py-2 text-black text-base font-whyte">
                          {`New Claimed Amount:`}
                        </span>
                      </div>
                      <div
                        className={`flex justify-between w-3/5 pr-12s justify-ends font-whyte`}
                      >
                        <p className="py-2 text-gray-400 text-base font-whyte">
                          <span className="pr-1 text-black font-whyte">
                            {`${newClaimedAmount.toFixed(
                              2,
                            )} ${distributionSymbol} /`}
                          </span>
                          {`${memberDistributionsToDate} ${distributionSymbol} (${newMemberWithdrawalsToDistributionsPercentage}%)`}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex flex-row justify-center">
                    <p className="text-green-500">
                      {
                        "There is no syndicate with given address. Make sure the syndicate address you are using is valid."
                      }
                    </p>
                  </div>
                </div>
              )}

              {/* submit button */}
              {validSyndicate ? (
                <div className="flex my-4 w-full justify-center py-2">
                  <Button
                    type="submit"
                    customClasses={`rounded-full bg-blue w-auto px-10 py-2 text-lg ${
                      buttonDisabled ? "opacity-50" : ""
                    }`}
                    disabled={buttonDisabled}
                  >
                    Confirm
                  </Button>
                </div>
              ) : null}
            </div>
          </form>
        </div>
      </Modal>
      {/* Tell user to confirm transaction on their wallet */}
      <ConfirmStateModal show={showWalletConfirmationModal}>
        <div className="flex flex-col justify-centers m-auto mb-4">
          <p className="text-sm text-center mx-8 opacity-60">
            {confirmModifyMemberDistributionsText}
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
        headerText={finalStateHeaderText}
        address={syndicateAddress.toString()}
      />
    </>
  );
};

export default ModifyMemberDistributions;
