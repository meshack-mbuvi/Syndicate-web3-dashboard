/**
 * This function returns appropriate message based on the code and action
 * that was passed. These parameters are obtained from user interaction with
 *  metamask when confirming or rejecting transactions
 *
 * The specific error codes can be obtained from the link below:
 * https://docs.metamask.io/guide/ethereum-provider.html#errors
 * @param errorCode The code returned by metamask to which is used to identify the error.
 * @param action The action the user is performing. It can be creating a syndicate,
 *  depositing into a syndicate, etc
 * @returns
 */
export const getMetamaskError = (
  errorCode: number | string,
  action: string
) => {
  switch (errorCode) {
    case 4001:
      return `${action} request was rejected by the user. Please try again.`;

    case -32602:
      return "Invalid parameters provided. Please try again.";

    case -32603:
      return "Internal server error. Please try again";

    // This error is not from metamask, rather its from the function call
    case "INVALID_ARGUMENT":
      return "Input values error. Please verify that you are using valid values.";

    default:
      return "An unknown error occured on our end. Please try again.";
  }
};
