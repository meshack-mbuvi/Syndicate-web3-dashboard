import { Toggle, EditableInput } from "@/components/inputs";
import Modal from "@/components/modal";
import {
  FinalStateModal,
  PendingStateModal,
  ConfirmStateModal,
} from "@/components/shared/transactionStates";
import {
  confirmingTransaction,
  waitTransactionTobeConfirmedText,
  confirmCreateSyndicateSubText,
  MAX_INTEGER,
} from "@/components/syndicates/shared/Constants";
import { getMetamaskError } from "@/helpers";
import { RootState } from "@/redux/store";
import { isWholeNumber, Validate, ValidatePercent } from "@/utils/validators";
import { useRouter } from "next/router";
import React, { FC, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateSyndicateSettingsDetails } from "@/redux/actions/syndicates";
import { getWeiAmount } from "src/utils/conversions";

interface Props {
  showChangeSettings: boolean;
  setShowChangeSettings: Function;
}

const ChangeSyndicateSettings: FC<Props> = (props: Props) => {
  const { showChangeSettings, setShowChangeSettings } = props;
  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();

  /**
   * Final state variables
   */
  const [finalStateButtonText, setFinalButtonText] = useState("");
  const [finalStateHeaderText, setFinalStateHeaderText] = useState("");
  const [finalStateIcon, setFinalStateIcon] = useState("");
  const [showFinalState, setShowFinalState] = useState(false);

  const [
    showWalletConfirmationModal,
    setShowWalletConfirmationModal,
  ] = useState(false);

  const { syndicateAddress } = router.query;

  const {
    initializeContractsReducer: {
      syndicateContracts: {
        ManagerLogicContract,
        DepositLogicContract,
        AllowlistLogicContract,
      },
    },
    web3Reducer: { web3: web3Instance },
  } = useSelector((state: RootState) => state);

  const { web3, account } = web3Instance;

  const { syndicate } = useSelector(
    (state: RootState) => state.syndicatesReducer,
  );

  const {
    allowlistEnabled,
    depositMemberMin,
    depositMemberMax,
    depositTotalMax,
    numMembersMax,
    managerManagementFeeBasisPoints,
    managerDistributionShareBasisPoints,
    // managerCurrent,
    depositERC20TokenSymbol,
    managerFeeAddress,
    tokenDecimals,
  } = syndicate;

  const [toggle, setToggle] = useState<boolean>(allowlistEnabled);
  const [showInputIndex, setShowInputIndex] = useState<number>();

  // ensures that percent input is 100.00
  const handlePercent = (value) => {
    const maxValue = 100;
    const minValue = 0;
    if (value > maxValue) {
      return parseFloat(maxValue.toString()).toFixed(2);
    } else if (value < 0) {
      return parseFloat(minValue.toString()).toFixed(2);
    }
    return value.indexOf(".") >= 0
      ? value.substr(0, value.indexOf(".")) +
          value.substr(value.indexOf("."), 3)
      : value;
  };

  // enforces 2 decimal places
  const handleDecimalPlaces = (value) => {
    return value.indexOf(".") >= 0
      ? value.substr(0, value.indexOf(".")) +
          value.substr(value.indexOf("."), 3)
      : value;
  };

  // prevent symbols including dot
  const handleNoSymbols = (value) => {
    return value.replace(/[^0-9]/g, "");
  };

  const handleCloseFinalStateModal = async () => {
    setShowFinalState(false);
    setShowInputIndex(null);
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
  };

  const handleSuccess = (data, message) => {
    setFinalButtonText("Dismiss");
    setFinalStateIcon("/images/checkCircle.svg");
    setFinalStateHeaderText(message);
    setShowFinalState(true);

    // update redux store
    const newSyndicateData = Object.assign(syndicate, data);
    dispatch(updateSyndicateSettingsDetails(newSyndicateData));
  };

  // Enable Allowlist
  const handleAllowlistSubmission = async (toggle: boolean) => {
    try {
      await AllowlistLogicContract.managerSetAllowlistEnabled(
        syndicateAddress,
        toggle,
        account,
        setShowWalletConfirmationModal,
        setSubmitting,
        (value) => dispatch(setSubmitting(value)),
      );

      handleSuccess({ allowlistEnabled: toggle }, "Allow list updated");
    } catch (error) {
      handleError(error);
    }
  };

  // Min. Deposit Amount per Member
  const handleManagerSetDepositMemberMin = async (depositMemberMin: string) => {
    try {
      const depositMemberMinimum = depositMemberMin
        ? getWeiAmount(depositMemberMin, tokenDecimals, true)
        : getWeiAmount("0", tokenDecimals, true);

      await DepositLogicContract.managerSetDepositMemberMin(
        syndicateAddress,
        depositMemberMinimum,
        account,
        setShowWalletConfirmationModal,
        setSubmitting,
        (value) => dispatch(setSubmitting(value)),
      );

      handleSuccess(
        { depositMemberMin },
        "Min. Deposit amount per Member updated",
      );
    } catch (error) {
      handleError(error);
    }
  };

  // Max. Deposit Amount per Member
  const handleManagerSetDepositMemberMax = async (depositMemberMax: string) => {
    try {
      const depositMemberMaximum = depositMemberMax
        ? getWeiAmount(depositMemberMax, tokenDecimals, true)
        : MAX_INTEGER;

      await DepositLogicContract.managerSetDepositMemberMax(
        syndicateAddress,
        depositMemberMaximum,
        account,
        setShowWalletConfirmationModal,
        setSubmitting,
        (value) => dispatch(setSubmitting(value)),
      );

      handleSuccess(
        { depositMemberMax },
        "Max. Deposit amount per Member updated",
      );
    } catch (error) {
      handleError(error);
    }
  };

  // Max. Total Deposit Amount
  const handleManagerSetDepositTotalMax = async (depositTotalMax: string) => {
    try {
      const depositTotalMaximum = depositTotalMax
        ? getWeiAmount(depositTotalMax, tokenDecimals, true)
        : MAX_INTEGER;

      await DepositLogicContract.managerSetDepositTotalMax(
        syndicateAddress,
        depositTotalMaximum,
        account,
        setShowWalletConfirmationModal,
        setSubmitting,
        (value) => dispatch(setSubmitting(value)),
      );

      handleSuccess({ depositTotalMax }, "Max. Total Deposit Amount updated");
    } catch (error) {
      handleError(error);
    }
  };

  // Max. Total Members
  const handleManagerSetNumMembersMax = async (numMembersMax: number) => {
    try {
      await ManagerLogicContract.managerSetNumMembersMax(
        syndicateAddress,
        numMembersMax,
        account,
        setShowWalletConfirmationModal,
        setSubmitting,
        (value) => dispatch(setSubmitting(value)),
      );

      handleSuccess({ numMembersMax }, "Total members updated");
    } catch (error) {
      handleError(error);
    }
  };

  // Management Fee
  const handleManagerSetManagerFees = async (value: number) => {
    try {
      await ManagerLogicContract.managerSetManagerFees(
        syndicateAddress,
        managerManagementFeeBasisPoints * 100,
        value * 100,
        account,
        setShowWalletConfirmationModal,
        setSubmitting,
        (value) => dispatch(setSubmitting(value)),
      );
      handleSuccess(
        { managerDistributionShareBasisPoints: value },
        "Management Fee updated",
      );
    } catch (error) {
      handleError(error);
    }
  };

  // Performance Fee
  const handleManagerSetPerformanceFee = async (value: number) => {
    try {
      await ManagerLogicContract.managerSetManagerFees(
        syndicateAddress,
        value * 100,
        managerDistributionShareBasisPoints * 100,
        account,
        setShowWalletConfirmationModal,
        setSubmitting,
        (value) => dispatch(setSubmitting(value)),
      );
      handleSuccess(
        { managerManagementFeeBasisPoints: value },
        "Performance updated",
      );
    } catch (error) {
      handleError(error);
    }
  };

  // Fee Recipient Address
  const handleManagerSetManagerFeeAddress = async (
    managerFeeAddress: number,
  ) => {
    try {
      await ManagerLogicContract.managerSetManagerFeeAddress(
        syndicateAddress,
        managerFeeAddress,
        account,
        setShowWalletConfirmationModal,
        setSubmitting,
        (value) => dispatch(setSubmitting(value)),
      );

      handleSuccess({ managerFeeAddress }, "Fee Recipient Address updated");
    } catch (error) {
      handleError(error);
    }
  };

  // Syndicate manager
  // const handleManagerSetManagerSetManagerPending = async (
  //   managerPendingAddress: number,
  // ) => {
  //   try {
  //     await ManagerLogicContract.managerSetManagerPending(
  //       syndicateAddress,
  //       managerPendingAddress,
  //       account,
  //       setShowWalletConfirmationModal,
  //       setSubmitting,
  //       (value) => dispatch(setSubmitting(value)),
  //     );

  //     handleSuccess(
  //       { managerPendingAddress: syndicateAddress },
  //       "Syndicate Manager updated, awaiting confirmation",
  //     );
  //   } catch (error) {
  //     handleError(error);
  //   }
  // };

  const changeSettingsOptions = [
    {
      label: "Min. Deposit Amount per Member:",
      defaults: { depositMemberMin },
      currency: true,
      display: syndicate.open,
      type: "number",
      step: "0.01",
      handleChange: handleDecimalPlaces,
      handler: handleManagerSetDepositMemberMin,
      validations: {
        required: "Min. Deposit Amount per Member is required",
        validate: (value) => {
          const message = Validate(value);
          if (message) {
            return message;
          }
          if (parseFloat(value) > parseFloat(depositMemberMax)) {
            return "Amount should not be greater than Max. Deposit Amount per Member";
          }
        },
      },
    },
    {
      label: "Max. Deposit Amount per Member:",
      defaults: { depositMemberMax },
      currency: true,
      display: syndicate.open,
      type: "number",
      step: "0.01",
      handleChange: handleDecimalPlaces,
      handler: handleManagerSetDepositMemberMax,
      validations: {
        required: "Max. Deposit Amount per Member is required",
        minLength: {
          value: 1,
          message: "Max Deposit has to be at least one",
        },
        validate: (value) => {
          const message = Validate(value);
          if (message) {
            return message;
          } else if (parseFloat(value) < parseFloat(depositMemberMin)) {
            return "Amount should not be less than Min. Deposit Amount per Member";
          } else if (parseFloat(value) > parseFloat(depositTotalMax)) {
            return "Amount should not be greater than Max. Total Deposit Amount";
          }
        },
      },
    },
    {
      label: "Max. Total Deposit Amount:",
      defaults: { depositTotalMax },
      currency: true,
      type: "number",
      step: "0.01",
      display: syndicate.open,
      handleChange: handleDecimalPlaces,
      handler: handleManagerSetDepositTotalMax,
      validations: {
        required: "Max. Total Deposit Amount is required",
        minLength: {
          value: 0,
          message:
            "Max. Total Deposit Amount must be equal to or greater than 0",
        },
        validate: (value) => {
          const message = Validate(value);

          if (message) {
            return message;
          } else if (parseFloat(value) < parseFloat(depositMemberMax)) {
            return "Amount should be greater than Max. Deposit Amount per Member";
          } else {
            return null;
          }
        },
      },
    },
    {
      label: "Max. Total Members:",
      defaults: { numMembersMax },
      handler: handleManagerSetNumMembersMax,
      type: "number",
      display: syndicate.open,
      handleChange: handleNoSymbols,
      validations: {
        required: "Max. Total Members is required",
        minLength: {
          value: 1,
          message: "Max. Total Members should be at lease 1",
        },
        validate: (value) => {
          if (!isWholeNumber(value)) {
            return "Max. Total Members must be a whole number";
          }
        },
      },
    },
    {
      label: "Distribution Share to Syndicate Lead:",
      defaults: { managerDistributionShareBasisPoints },
      percent: true,
      display: syndicate.open,
      type: "number",
      step: "0.01",
      value: "",
      placeholder: "",
      handleChange: handlePercent,
      handler: handleManagerSetManagerFees,
      validations: {
        required: "Distribution Share to Syndicate Lead is required",
        validate: (value) => {
          const invalidPercentage = ValidatePercent(value);
          if (invalidPercentage) return invalidPercentage;
          if (parseFloat(value) > 99.5)
            return "Maximum distribution share is 99.5%";
        },
      },
    },
    {
      label: "Performance Fee:",
      defaults: { managerManagementFeeBasisPoints },
      percent: true,
      display: syndicate.open,
      type: "number",
      step: "0.01",
      value: "",
      placeholder: "",
      handleChange: handlePercent,
      handler: handleManagerSetPerformanceFee,
      validations: {
        required: "Performance Fee is required",
        validate: (value) => {
          const message = Validate(value);
          const invalidPercentage = ValidatePercent(value);
          if (message) return message;
          if (invalidPercentage) return invalidPercentage;
        },
      },
    },
    {
      label: "Fee Recipient Address:",
      defaults: { managerFeeAddress },
      address: true,
      handler: handleManagerSetManagerFeeAddress,
      validations: {
        required: "Fee Recipient Address is required",
        validate: (value: string) => {
          if (!web3.utils.isAddress(value)) {
            return "Fee Recipient Address should be a valid Ethereum address";
          }
          if (value === managerFeeAddress)
            return "The provided address already manages the Syndicate";
        },
      },
    },
    // {
    //   label: "Syndicate Manager:",
    //   defaults: { managerCurrent },
    //   handler: handleManagerSetManagerSetManagerPending,
    //   address: true,
    //   validations: {
    //     required: "this is a required",
    //     validate: (value: string) => {
    //       if (!web3.utils.isAddress(value)) {
    //         return "Manager should be a valid ERC20 address";
    //       }
    //     },
    //   },
    // },
  ];

  return (
    <>
      <Modal
        {...{
          title: "Change Syndicate Settings",
          show: showChangeSettings,
          closeModal: () => setShowChangeSettings(false),
          customWidth: "md:w-3/5 w-full",
        }}
      >
        <div className="mx-2 mb-8">
          <div className="text-gray-400 py-6 text-center mb-6">
            Because each individual piece of data is stored on-chain, you are
            only able to edit one field at a time. Each triggering a separate
            wallet transaction.
          </div>

          <div className="border w-full border-gray-93 bg-gray-99 rounded-xl p-4 py-8">
            {/* enable allowlist toggle */}
            {syndicate.open && (
              <div className="my-6">
                <Toggle
                  {...{
                    enabled: toggle,
                    toggleEnabled: () => {
                      setToggle(!toggle);
                      handleAllowlistSubmission(!toggle);
                    },
                    tooltip: "",
                    label: "Enable Allowlist:",
                  }}
                />
              </div>
            )}

            {changeSettingsOptions.map(
              (
                {
                  label,
                  defaults,
                  currency,
                  percent,
                  validations,
                  handler,
                  address,
                  type,
                  step,
                  placeholder,
                  handleChange,
                  display,
                },
                index,
              ) => {
                return (
                  <div key={index}>
                    <EditableInput
                      handleShowInputIndex={async () =>
                        setShowInputIndex(index)
                      }
                      address={address}
                      type={type}
                      handler={handler}
                      index={index}
                      showInputIndex={showInputIndex}
                      label={label}
                      defaults={defaults}
                      currency={currency}
                      percent={percent}
                      validations={validations}
                      depositERC20TokenSymbol={depositERC20TokenSymbol}
                      step={step}
                      placeholder={placeholder}
                      handleChange={handleChange}
                      display={display}
                    />
                  </div>
                );
              },
            )}
          </div>
        </div>
      </Modal>

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
        address={syndicateAddress.toString()}
      />
    </>
  );
};

export default ChangeSyndicateSettings;