import { InputWithAddon, TextInput } from "@/components/inputs";
import Modal from "@/components/modal";
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
import { RootState } from "@/redux/store";
import { getWeiAmount } from "@/utils/conversions";
import { TokenMappings } from "@/utils/tokenMappings";
import { isZeroAddress, Validate } from "@/utils/validators";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "src/components/buttons";

/**
 * This component displays a form with input fields used to modify a syndicate
 * cap table.
 * @param props
 * @returns
 */
const ModifyMemberDistributions = (): JSX.Element => {
  const {
    currentDistributionClaimedAmountTooltip,
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
  } = useSelector((state: RootState) => state);

  const dispatch = useDispatch();

  const [
    showWalletConfirmationModal,
    setShowWalletConfirmationModal,
  ] = useState(false);

  const [validSyndicate, setValidSyndicate] = useState(false);

  const router = useRouter();

  const { syndicateAddress } = router.query;

  const [
    currentClaimedDistributions,
    setCurrentClaimedDistributions,
  ] = useState("0");

  const [memberDeposits, setMemberDeposits] = useState("");

  const [depositorAddressError, setDepositAddressError] = useState("");

  const [newDistributionAmount, setNewDistributionAmount] = useState<
    string | number
  >(0);

  const [distributionERC20Address, setDistributionERC20Address] = useState(
    syndicate?.depositERC20Address,
  );

  const [amountError, setAmountError] = useState<string>("");

  const [submitting, setSubmitting] = useState(false);
  const [currentERC20, setCurrentERC20] = useState<string>("DAI");

  // set token symbol based on deposit token address
  // we'll manually map the token symbol for now.
  // we'll also set the token decimals of the deposit/Withdrawal ERC20 token here
  useEffect(() => {
    if (syndicate) {
      // set token symbol based on token address
      const tokenAddress = syndicate.depositERC20Address;
      const mappedTokenAddress = Object.keys(TokenMappings).find(
        (key) => key.toLowerCase() == tokenAddress.toLowerCase(),
      );
      if (mappedTokenAddress) {
        setCurrentERC20(TokenMappings[mappedTokenAddress]);
      }
      getDistributionERC20Address();
    }
  }, [syndicate]);

  useEffect(() => {
    if (memberAddress && depositorAddressError == "") {
      getCurrentClaimedAmount();
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

  let validated = false;
  if (depositorAddressError || !memberAddress) {
    validated = false;
  } else {
    validated = true;
  }

  const handleSetShowModifyMemberDistributions = () => {
    dispatch(setShowModifyMemberDistributions(false));
  };

  /**
   * This function retrieves all total deposits for the depositor address
   * @param depositorAddress
   * @returns
   */
  const getCurrentClaimedAmount = async () => {
    try {
      const {
        memberDeposits,
        memberTotalWithdrawals,
      } = await getSyndicateMemberInfo(
        syndicateContracts.GetterLogicContract,
        syndicateAddress,
        memberAddress,
      );
      setMemberDeposits(memberDeposits);
      if (memberDeposits === "0") {
        setDepositAddressError(
          "Member address has zero deposits in this Syndicate",
        );
      }

      setCurrentClaimedDistributions(memberTotalWithdrawals);
      return memberTotalWithdrawals;
    } catch (error) {
      setCurrentClaimedDistributions("0");
      setDepositAddressError(
        "Member address has zero deposits in this Syndicate",
      );
    }
  };

  /**
   * This helper function retrieves all distributionERC20Addresses. The addresses
   * are obtained from setterDistribution event filtered by
   * syndicateAddress which is the address of this syndicate.
   */
  const getDistributionERC20Address = async () => {
    const events = await syndicateContracts.DistributionLogicContract.getDistributionEvents(
      "DistributionAdded",
      { syndicateAddress },
    );

    // if no events, take the default depositERC20Address to be the
    // distribution address
    // otherwise, get one address from the events
    if (!events.length) {
      setDistributionERC20Address(syndicate.depositERC20Address);
    } else {
      let distributionERC20Addresses = [];
      events.forEach((event) => {
        const { distributionERC20Address } = event.returnValues;
        distributionERC20Addresses.push(distributionERC20Address);
      });

      // Remove address duplicates
      distributionERC20Addresses = Array.from(
        new Set(distributionERC20Addresses),
      );
      // we might have many distributions, and we need to find a way to select
      // enable the manager select whichever address they want to edit ditributions for.
      setDistributionERC20Address(distributionERC20Addresses[0]);
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
      setDepositAddressError("Member address should be a valid ERC20 address");
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
        18,
        true,
      );

      await syndicateContracts.DistributionLogicContract.managerSetDistributionsClaimedForMembers(
        syndicateAddress,
        [memberAddress],
        [distributionERC20Address],
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
    handleSetShowModifyMemberDistributions();
  };

  const lpInvested = memberDeposits === "0" && memberAddress ? false : true;

  return (
    <>
      <Modal
        {...{
          title: "Modify Member Distributions",
          show: modifyMemberDistribution,
          closeModal: () => handleSetShowModifyMemberDistributions(),
          customWidth: "md:w-8/12 w-full",
        }}
      >
        <div className="mx-2 mb-8">
          <p className="text-gray-500 text-sm my-4">
            Manually change the claimed distribution amount of members from this
            syndicate.
          </p>
          <p className="my-2 font-bold">
            WARNING: This function is intended to help syndicates fix user
            errors or make one-off exceptions. This should NOT be used
            frequently, and when changes are made, we recommend messaging your
            syndicate’s members with additional context and detail on the change
            to prevent any confusion.
          </p>

          <form onSubmit={onSubmit}>
            <p className="text-blue mx-4 my-4 text-base">
              Overwrite Claimed Amount
            </p>
            <div className="border w-full border-gray-93 bg-gray-99 rounded-xl p-4 py-8">
              {validSyndicate ? (
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

                  <InputWithAddon
                    {...{
                      label: "Current Claimed Amount:",
                      value: currentClaimedDistributions,
                      defaultValue: 0,
                      tooltip: currentDistributionClaimedAmountTooltip,
                      type: "number",
                      addOn: currentERC20,
                    }}
                    disabled
                  />

                  <InputWithAddon
                    {...{
                      label: "New Claimed Amount:",
                      value: newDistributionAmount,
                      onChange: newDistributionsAmountHandler,
                      error: amountError,
                      tooltip: newDistributionClaimedAmountTooltip,
                      type: "number",
                      addOn: currentERC20,
                    }}
                  />
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

            {/* submit button */}
            {validSyndicate ? (
              <div className="flex my-4 w-full justify-center py-2">
                <Button
                  type="submit"
                  customClasses={`rounded-full bg-blue w-auto px-10 py-2 text-lg ${
                    validated && !submitting && lpInvested ? "" : "opacity-50"
                  }`}
                  disabled={
                    validated && !submitting && lpInvested ? false : true
                  }
                >
                  Confirm
                </Button>
              </div>
            ) : null}
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
