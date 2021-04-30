/**
 * button used to initiate deposits, approve allowances, and make withdrawals.
 */
interface ButtonProps {
  buttonText: string;
  amountError?: boolean;
  disableApprovalButton?: boolean;
  disableDepositButton?: boolean;
}

export const SyndicateActionButton = (props: ButtonProps) => {
  const {
    buttonText,
    amountError = "",
    disableApprovalButton,
    disableDepositButton,
  } = props;

  // this button will be disabled if
  // in the case of a deposit, the allowance has not been approved yet
  // or generally if the amount entered is invalid
  let disableButton = false;
  if (amountError || disableApprovalButton || disableDepositButton) {
    disableButton = true;
  }

  return (
    <button
      className={`flex w-full items-center justify-center font-medium rounded-md text-black bg-white focus:outline-none focus:ring py-4 ${
        disableButton ? "opacity-50 cursor-not-allowed" : ""
      }`}
      type="submit"
      disabled={disableButton}
    >
      {buttonText}
    </button>
  );
};
