import React from "react";

/**
 * button used to initiate deposits, approve allowances, and make withdrawals.
 */
interface ButtonProps {
  buttonText: string;
  amountError?: boolean;
  disableApprovalButton?: boolean;
  disableDepositButton?: boolean;
  disableWithdrawButton?: boolean;
  action?: string;
  approved?: boolean;
  depositAmountChanged?: boolean;
}

export const SyndicateActionButton = (props: ButtonProps) => {
  const {
    buttonText,
    amountError = "",
    disableApprovalButton,
    disableDepositButton,
    disableWithdrawButton,
    action,
    approved,
    depositAmountChanged,
  } = props;

  // this button will be disabled if
  // in the case of a deposit, the allowance has not been approved yet
  // or generally if the amount entered is invalid
  let disableButton = false;
  if (
    amountError ||
    disableApprovalButton ||
    disableDepositButton ||
    disableWithdrawButton
  ) {
    disableButton = true;
  }

  // show check mark if button is used for approvals
  // only show check mark if amount has been approved.
  let showApprovalCheckmark = false;
  if (action === "approval") {
    if (approved && !depositAmountChanged) {
      showApprovalCheckmark = true;
    }
  }

  return (
    <button
      className={`flex w-full items-center justify-center font-medium rounded-md text-black bg-white focus:outline-none focus:ring py-4 ${
        disableButton ? "bg-gray-600 cursor-not-allowed" : ""
      }`}
      type="submit"
      disabled={disableButton}
    >
      {showApprovalCheckmark ? (
        <span>
          <img src="/images/checkmark.svg" className="h-4 w-4 mr-2" alt="approval check"/>
        </span>
      ) : null}
      <span className="text-lg">{buttonText}</span>
    </button>
  );
};
