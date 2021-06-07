import { InputWithAddon, TextInput } from "@/components/inputs";
import Modal from "@/components/modal";
import { PendingStateModal } from "@/components/shared/transactionStates";
import ConfirmStateModal from "@/components/shared/transactionStates/confirm";
import FinalStateModal from "@/components/shared/transactionStates/final";
import {
  confirmingTransaction,
  confirmModifySyndicateCapTableText,
  depositorAddressToolTip,
  ModifySyndicateCapTableConstants,
  rejectTransactionText,
  waitTransactionTobeConfirmedText,
} from "@/components/syndicates/shared/Constants";
import { getMetamaskError } from "@/helpers";
import { showWalletModal } from "@/redux/actions";
import {
  getSyndicateByAddress,
  getTokenDecimals,
} from "@/redux/actions/syndicates";
import { RootState } from "@/redux/store";
import { divideIfNotByZero, getWeiAmount } from "@/utils/conversions";
import { TokenMappings } from "@/utils/tokenMappings";
import { isZeroAddress, Validate } from "@/utils/validators";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "src/components/buttons";

interface Props {
  showModifyCapTable: boolean;
  setShowModifyCapTable: Function;
}

/**
 * This component displays a form with input fields used to modify a syndicate
 * cap table.
 * @param props
 * @returns
 */
const ModifySyndicateCapTable = (props: Props) => {
  const { showModifyCapTable, setShowModifyCapTable } = props;
  const {
    currentDepositAmountTooltip,
    newDepositAmountTooltip,
  } = ModifySyndicateCapTableConstants;

  const {
    web3: { account, web3 },
  } = useSelector((state: RootState) => state.web3Reducer);

  const { syndicateContractInstance } = useSelector(
    (state: RootState) => state.syndicateInstanceReducer
  );

  const { syndicate } = useSelector(
    (state: RootState) => state.syndicatesReducer
  );

  const dispatch = useDispatch();

  const [
    showWalletConfirmationModal,
    setShowWalletConfirmationModal,
  ] = useState(false);

  const [validSyndicate, setValidSyndicate] = useState(false);

  const router = useRouter();

  const { syndicateAddress } = router.query;

  const [depositorAddress, setDepositorAddress] = useState("");
  const [depositorAddressError, setDepositAddressError] = useState("");

  const [amount, setAmount] = useState<string | number>(0);

  const [amountError, setAmountError] = useState<string>("");

  const [currentDepositAmount, setcurrentDepositAmount] = useState(0);
  const [syndicateError] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [currentERC20, setCurrentERC20] = useState<string>("DAI");
  const [currentOwnership, setCurrentOwnership] = useState(0);
  const [newOwnership, setNewOwnership] = useState(0);
  const [tokenDecimal, setTokenDecimal] = useState(18);
  /**
   * When a depositor address is set, find its current syndicate ownership
   */
  useEffect(() => {
    calculateCurrentOwnership();
  }, [depositorAddress, currentDepositAmount]);

  // calculate new ownership for the new/existing member
  useEffect(() => {
    if (syndicate) {
      calculateNewOnwershipOfSyndicate();
    }
  }, [amount]);

  // retrieve tokenDecimals
  useEffect(() => {
    if (syndicate) {
      getTokenDecimals(syndicate.depositERC20Address).then((tokenDecimal) => {
        setTokenDecimal(tokenDecimal);
      });
    }
  }, [syndicate]);

  // set token symbol based on deposit token address
  // we'll manually map the token symbol for now.
  // we'll also set the token decimals of the deposit/Withdrawal ERC20 token here
  useEffect(() => {
    if (syndicate) {
      // set token symbol based on token address
      const tokenAddress = syndicate.depositERC20Address;
      const mappedTokenAddress = Object.keys(TokenMappings).find(
        (key) => key.toLowerCase() == tokenAddress.toLowerCase()
      );
      if (mappedTokenAddress) {
        setCurrentERC20(TokenMappings[mappedTokenAddress]);
      }
    }
  }, [syndicate]);

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

  useEffect(() => {
    if (
      web3 &&
      web3.utils.isAddress(depositorAddress) &&
      !isZeroAddress(depositorAddress)
    ) {
      getCurrentDepositAmount(depositorAddress);
    }
  }, [depositorAddress]);

  let validated = false;

  if (depositorAddressError || amountError || !depositorAddress || !amount) {
    validated = false;
  } else {
    validated = true;
  }

  /**
   * This function retrieves all total deposits for the depositor address
   * @param depositorAddress
   * @returns
   */
  const getCurrentDepositAmount = async (depositorAddress: string) => {
    const memberInfo = await syndicateContractInstance.methods
      .getMemberInfo(syndicateAddress, depositorAddress)
      .call();

    const lpDeposits = getWeiAmount(
      memberInfo[0],
      syndicate.tokenDecimals,
      false
    );
    setcurrentDepositAmount(lpDeposits.toString());
    return lpDeposits;
  };

  /**
   * This method sets the deposit address which the depositor used to send
   * funds to the manager.
   */
  const handleDepositAddressChange = (event) => {
    const { value } = event.target;
    setDepositorAddress(value);

    if (!value.trim()) {
      setDepositAddressError("Deposit address is required");
    } else if (web3 && !web3.utils.isAddress(value)) {
      setDepositAddressError("Deposit address should be a valid ERC20 address");
    } else if (isZeroAddress(value)) {
      setDepositAddressError("Deposit address cannot be zero address");
    } else {
      setDepositAddressError("");
    }
  };

  /**
   * This method sets the amount of funds the depsitor send to the manager.
   * It also validates the input value and set appropriate error message
   */
  const handleAmountChange = (event) => {
    event.preventDefault();
    const { value } = event.target;

    setAmount(value);

    const message = Validate(value);
    if (message) {
      setAmountError(`New deposit amount ${message}`);
    } else {
      setAmountError("");
    }
  };

  const handleError = (error) => {
    // capture metamask error
    setShowWalletConfirmationModal(false);
    setSubmitting(false);

    const { code } = error;
    const errorMessage = getMetamaskError(code, "Member deposit modified.");
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
    if (!syndicateContractInstance) {
      // Request wallet connect

      return dispatch(showWalletModal());
    }

    try {
      setShowWalletConfirmationModal(true);
      const amountInWei = getWeiAmount(amount.toString(), tokenDecimal, true);
      // These values should be passed as arrays
      const depositorAddresses = [depositorAddress];
      const depositorAmounts = [amountInWei];

      await syndicateContractInstance.methods
        .managerSetDepositForMembers(
          syndicateAddress,
          depositorAddresses,
          depositorAmounts
        )
        .send({ from: account, gasLimit: 800000 })
        .on("transactionHash", () => {
          setShowWalletConfirmationModal(false);
          setSubmitting(true);
        })
        .on("receipt", (receipt) => {
          console.log({ receipt });
          setSubmitting(false);

          setShowFinalState(true);
          setFinalStateHeaderText("Member deposit modified.");
          setFinalStateIcon("/images/checkCircle.svg");
          setFinalButtonText("Done");
          setSubmitting(false);
        })
        .on("error", (error) => {
          console.log({ error });
          handleError(error);
        });
    } catch (error) {
      console.log({ error });
      handleError(error);
    }
  };

  /**
   * Get lp deposits
   * Calculate current onwership
   */
  const calculateCurrentOwnership = () => {
    const currentOwnership =
      divideIfNotByZero(+currentDepositAmount, +syndicate.depositTotal) * 100;
    setCurrentOwnership(+currentOwnership.toFixed(2));
  };

  // should be called whenever amount changes
  // Setting deposit for the member will either reduce or increase total deposits
  const calculateNewOnwershipOfSyndicate = () => {
    const newSyndicateDeposits =
      +syndicate.depositTotal + +amount - +currentDepositAmount;

    // new member deposit will be overriden with amount set
    const percentOwnership =
      divideIfNotByZero(+amount, newSyndicateDeposits) * 100;

    setNewOwnership(+percentOwnership.toFixed(2));
  };

  //calculate ownership change on new deposit
  const ownershipChange = +(newOwnership - currentOwnership).toFixed(2);

  /**
   * Final state variables
   */
  const [finalStateButtonText, setFinalButtonText] = useState("");
  const [finalStateHeaderText, setFinalStateHeaderText] = useState("");
  const [finalStateIcon, setFinalStateIcon] = useState("");
  const [showFinalState, setShowFinalState] = useState(false);

  const handleCloseFinalStateModal = async () => {
    setShowFinalState(false);
    setShowModifyCapTable(false);

    await dispatch(
      getSyndicateByAddress(syndicateAddress, syndicateContractInstance)
    );
  };

  return (
    <>
      <Modal
        {...{
          title: "Modify Syndicate Cap Table",
          show: showModifyCapTable,
          closeModal: () => setShowModifyCapTable(false),
          customWidth: "md:w-2/3 w-full",
        }}>
        <div className="mx-2 mb-8">
          <p className="text-gray-500 text-sm">
            Manually change the cap table and percentage ownerships for this
            syndicate by overwriting the deposit amount for a specified member.
          </p>
          <p className="my-2 font-bold">
            WARNING: This function is intended to help syndicates fix user
            errors or make one-off exceptions. This should NOT be used
            frequently, and when changes are made, we recommend messaging your
            syndicate’s members with additional context and detail on the change
            to prevent any confusion.
          </p>

          <form onSubmit={onSubmit}>
            <p className="text-blue-light mx-4 my-4 text-xl">
              Overwrite Member Amount
            </p>
            <div className="border w-full border-gray-93 bg-gray-99 rounded-xl p-4 py-8">
              {validSyndicate ? (
                <div className="space-y-2">
                  <TextInput
                    {...{
                      label: "Member Address:",
                      tooltip: depositorAddressToolTip,
                      onChange: handleDepositAddressChange,
                      error: depositorAddressError,
                    }}
                    value={depositorAddress.toString()}
                    name="depositorAddress"
                  />

                  <InputWithAddon
                    {...{
                      label: "Current Deposit Amount:",
                      value: currentDepositAmount,
                      tooltip: currentDepositAmountTooltip,
                      addOn: currentERC20,
                      name: "currentDeposit",
                      disabled: true,
                    }}
                  />

                  <InputWithAddon
                    {...{
                      label: "New Deposit Amount:",
                      value: amount,
                      onChange: handleAmountChange,
                      defaultValue: 0,
                      error: amountError,
                      tooltip: newDepositAmountTooltip,
                      type: "number",
                      addOn: currentERC20,
                      name: "amount",
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

            <p className="text-gray-500 mx-4 my-4 mt-10 text-xl">
              Ownership Change
            </p>
            <div className="bg-gray-99 border border-gray-93 mt-4 py-8 rounded-xl p-4">
              {submitting ? (
                <div className="space-y-4 text-center loader">Loading</div>
              ) : syndicateError ? (
                <div className="space-y-2">
                  <div className="flex flex-row justify-center">
                    <p className="text-red-500">{syndicateError}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex flex-row justify-center py-1">
                    <label
                      htmlFor="syndicateAddress"
                      className="block text-black text-sm font-medium w-7/12 flex justify-end">
                      Current Ownership of Syndicate:
                    </label>
                    <span
                      className={`flex flex-grow rounded-md text-gray-500 px-4 text-sm font-ibm`}>
                      {currentOwnership}%
                    </span>
                  </div>

                  <div className="flex flex-row justify-center py-2">
                    <label
                      htmlFor="syndicateAddress"
                      className="block text-black text-sm font-medium w-7/12 flex justify-end">
                      New Ownership of Syndicate:
                    </label>
                    <span
                      className={`flex flex-grow rounded-md text-gray-500  px-4 text-sm font-ibm w-5/12 flex justify-between`}>
                      {newOwnership}%{" "}
                      {`(${ownershipChange > 0 ? "+" : ""}${ownershipChange})%`}
                    </span>
                  </div>

                  <div className="flex flex-row justify-center my-4">
                    <label
                      htmlFor="syndicateAddress"
                      className="w-7/12 flex justify-end block text-black text-sm font-medium">
                      Ownership Change for All Other Depositors:
                    </label>
                    <span
                      className={`flex flex-grow rounded-md px-4 text-sm font-ibm w-5/12 flex justify-between`}>
                      {`${ownershipChange > 0 ? "-" : "+"}${Math.abs(
                        ownershipChange
                      )}%`}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* submit button */}
            {validSyndicate ? (
              <div className="flex my-4 w-full justify-center py-2">
                {submitting ? (
                  <div className="loader"></div>
                ) : (
                  <Button
                    type="submit"
                    customClasses={`rounded-full bg-blue-light w-auto px-10 py-2 text-lg ${
                      validated && !submitting ? "" : "opacity-50"
                    }`}
                    disabled={validated && !submitting ? false : true}>
                    Confirm
                  </Button>
                )}
              </div>
            ) : null}
          </form>
        </div>
      </Modal>

      {/* Tell user to confirm transaction on their wallet */}
      <ConfirmStateModal show={showWalletConfirmationModal}>
        <div className="flex flex-col justify-centers m-auto mb-4">
          <p className="text-sm text-center mx-8 opacity-60">
            {confirmModifySyndicateCapTableText}
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
        address={syndicateAddress.toString()}
      />
    </>
  );
};

export default ModifySyndicateCapTable;
