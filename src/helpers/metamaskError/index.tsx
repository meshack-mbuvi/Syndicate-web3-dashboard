/**
 * This function returns an appropriate message based on the code and action
 * that was passed. These parameters are obtained from user interaction with
 *  metamask when confirming or rejecting transactions
 */
import { metamaskConstants } from "src/components/syndicates/shared/Constants";
const {
  metamaskRejectByUserMessage,
  metamaskInvalidParamsMessage,
  metamaskInternalErrorMessage,
  metamaskUnknownErrorMessage,
  metamaskInvalidAddressMessage,
} = metamaskConstants;

/**
 *  Error codes include:
 * 4001: The request was rejected by the user.
 * -32602: The parameters were invalid.
 * -32603: Internal error
 * https://docs.metamask.io/guide/ethereum-provider.html#errors
 * @param errorCode the error code from metamask.
 * @param action the action that triggered the error
 * @returns error message string.
 * */
export const getMetamaskError = (
  errorCode: number | string,
  action: string
) => {
  switch (errorCode) {
    case 4001:
      return `${action} ${metamaskRejectByUserMessage}`;

    case -32602:
      return `${metamaskInvalidParamsMessage}`;

    case -32603:
      return `${metamaskInternalErrorMessage}`;

    case "INVALID_ARGUMENT":
      return `${metamaskInvalidAddressMessage}`;

    default:
      return `${metamaskUnknownErrorMessage}`;
  }
};
