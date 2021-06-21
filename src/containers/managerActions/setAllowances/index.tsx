import Button from "@/components/buttons";
import { TextInput } from "@/components/inputs";
import Modal from "@/components/modal";
import {
  constants,
  metamaskConstants,
  walletConfirmConstants,
} from "@/components/syndicates/shared/Constants";
import { managerActionTexts } from "@/components/syndicates/shared/Constants/managerActions";
import { SyndicateActionLoader } from "@/components/syndicates/shared/syndicateActionLoader";
import { getMetamaskError } from "@/helpers/metamaskError";
import { getWeiAmount } from "@/utils/conversions";
import { floatedNumberWithCommas } from "@/utils/formattedNumbers";
import { Validate } from "@/utils/validators";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import {
  storeDepositTokenAllowance,
  storeDistributionTokensDetails,
} from "src/redux/actions/tokenAllowances";

interface Props {
  hideManagerSetAllowances: Function;
  showManagerSetAllowances: boolean;
  depositTokenContract?: any;
  depositTokenDecimals?: number;
  syndicateContractInstance: any;
  web3?: any;
  depositTokenAllowanceDetails?: any;
  distributionTokensAllowanceDetails?: any;
  syndicate?: any;
}
const ManagerSetAllowance = (props: Props) => {
  const {
    hideManagerSetAllowances,
    showManagerSetAllowances,
    depositTokenContract,
    syndicateContractInstance,
    depositTokenDecimals,
    web3: { account },
    depositTokenAllowanceDetails,
    distributionTokensAllowanceDetails,
    syndicate,
  } = props;

  const dispatch = useDispatch();
  const router = useRouter();
  const { syndicateAddress } = router.query;

  const [allowanceAmount, setAllowanceAmount] = useState<string>("0");
  const [allowanceAmountError, setAllowanceAmountError] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [metamaskError, setMetamaskError] = useState<string>("");
  const [metamaskConfirmPending, setMetamaskConfirmPending] = useState<boolean>(
    false
  );
  const [
    allowanceApprovalSuccess,
    setAllowanceApprovalSuccess,
  ] = useState<boolean>(false);

  // get static texts to render on loader and error components
  const {
    loaderApprovalHeaderText,
    dismissButtonText,
    approvalSuccessTitleText,
    approvalSuccessSubtext,
  } = constants;
  const {
    walletPendingConfirmPendingTitleText,
    walletPendingConfirmPendingMessage,
  } = walletConfirmConstants;
  const { metamaskErrorMessageTitleText } = metamaskConstants;

  if (syndicate) {
    var { depositMaxTotal, depositsEnabled, distributionsEnabled } = syndicate;
  }

  // handle allowance value from the input field.
  const handleAmountChange = (event) => {
    event.preventDefault();
    const { value } = event.target;

    setAllowanceAmount(value);

    const message = Validate(value);
    if (message) {
      setAllowanceAmountError(`Allowance amount ${message}`);
    } else {
      setAllowanceAmountError("");
    }
  };

  // handle metamask approval error
  const handleApprovalError = (error: any) => {
    const { code } = error;
    const errorMessage = getMetamaskError(code, "Allowance approval");
    setMetamaskConfirmPending(false);
    setMetamaskError(errorMessage);
    setSubmitting(false);
    setMetamaskConfirmPending(false);
    setAllowanceApprovalSuccess(false);
  };

  const handleAllowanceApproval = async (index) => {
    setMetamaskConfirmPending(true);
    // new allowance amount will be equal to the sum of the currenct allowance
    // and the new allowance amount entered into the input field.
    if (depositsEnabled) {
      var currentTokenAllowance =
        depositTokenAllowanceDetails[index]["tokenAllowance"];
    } else if (distributionsEnabled) {
      currentTokenAllowance =
        distributionTokensAllowanceDetails[index]["tokenAllowance"];
    }

    const newAllowanceAmountToApprove =
      +allowanceAmount + +currentTokenAllowance;

    // set correct wei amount to approve
    const amountToApprove = getWeiAmount(
      newAllowanceAmountToApprove.toString(),
      depositTokenDecimals,
      true
    );

    try {
      await depositTokenContract.methods
        .approve(syndicateContractInstance._address, amountToApprove)
        .send({ from: account, gasLimit: 800000 })
        .on("transactionHash", () => {
          // user clicked on confirm
          // show loading state
          setSubmitting(true);
          setMetamaskConfirmPending(false);
        })
        .on("receipt", async (receipt) => {
          // approval transaction successful
          const { Approval } = receipt.events;
          const { returnValues } = Approval;
          const { value } = returnValues;
          const managerApprovedAllowance = getWeiAmount(
            value,
            depositTokenDecimals,
            false
          );

          setSubmitting(false);
          if (allowanceApprovalSuccess) {
            setAllowanceApprovalSuccess(false);
          } else {
            setAllowanceApprovalSuccess(true);
          }

          // clear the allowance input field.
          setAllowanceAmount("0");

          // dispatch new allowance details to the store

          if (depositsEnabled) {
            // check whether new allowance matches total max. deposits
            const sufficientAllowanceSet =
              +managerApprovedAllowance >= +depositMaxTotal;

            const {
              tokenSymbol,
              tokenAddress,
            } = depositTokenAllowanceDetails[0];

            dispatch(
              storeDepositTokenAllowance([
                {
                  tokenAddress,
                  tokenAllowance: managerApprovedAllowance,
                  tokenDeposits: depositMaxTotal,
                  tokenSymbol,
                  sufficientAllowanceSet,
                },
              ])
            );
          } else if (distributionsEnabled) {
            // dispatch new distribution token allowance details
            const { tokenDistributions } = distributionTokensAllowanceDetails[
              index
            ];
            // check if new allowance set is sufficient.
            const sufficientAllowanceSet =
              +managerApprovedAllowance >= +tokenDistributions;

            // update token details
            const distributionTokensAllowanceDetailsCopy = [
              ...distributionTokensAllowanceDetails,
            ];
            distributionTokensAllowanceDetailsCopy[index][
              "tokenAllowance"
            ] = managerApprovedAllowance;
            distributionTokensAllowanceDetailsCopy[index][
              "sufficientAllowanceSet"
            ] = sufficientAllowanceSet;

            dispatch(
              storeDistributionTokensDetails(
                distributionTokensAllowanceDetailsCopy
              )
            );
          }
        })
        .on("error", (error) => {
          // user clicked reject.
          handleApprovalError(error);
        });
    } catch (error) {
      // error occured before wallet prompt.
      handleApprovalError(error);
    }
  };

  const handleSubmit = (event, index) => {
    event.preventDefault();
    handleAllowanceApproval(index);
  };

  // distribution/deposits texts based on whether the syndicate is open or not.
  const { distributionAmountLabel, depositAmountLabel } = managerActionTexts;
  let availableAmountLabel = distributionAmountLabel;
  if (depositsEnabled) {
    availableAmountLabel = depositAmountLabel;
  }

  // set informational text based on the status of the syndicate.
  const {
    depositAllowanceInsufficientText,
    distributionAllowanceInsufficientText,
  } = managerActionTexts;

  let informationText;
  if (depositsEnabled) {
    informationText = depositAllowanceInsufficientText;
  } else if (distributionsEnabled) {
    informationText = distributionAllowanceInsufficientText;
  }

  // method to close the syndicate action loader
  const closeSyndicateActionLoader = () => {
    setSubmitting(false);
    setMetamaskConfirmPending(false);
    setMetamaskError("");
    setAllowanceApprovalSuccess(false);
    hideManagerSetAllowances();
  };

  // styling for close button
  const retryButtonClasses =
    "rounded-full bg-blue text-white mt-4 w-auto px-10 py-2 text-lg font-light";

  // close allowances modal
  const closeAllowancesModal = () => {
    // modal should not be closable if we're in a loading state
    if (submitting || metamaskConfirmPending) {
      return;
    } else {
      setSubmitting(false);
      setMetamaskConfirmPending(false);
      setMetamaskError("");
      setAllowanceApprovalSuccess(false);
      hideManagerSetAllowances();
    }
  };

  // set state for when to show close button on the modal or not
  // when the modal is in a loading state, it cannot be closed.
  // Therefore, we need to hide the close button
  let showCloseButton = true;
  if (submitting || metamaskConfirmPending) {
    showCloseButton = false;
  } else {
    showCloseButton = true;
  }

  // set token values to map
  // This can either be the deposit token or distributions tokens
  // depending on whether the syndicate is open or not
  const [tokenAllowanceDetails, setTokenAllowanceDetails] = useState<any>([]);
  useEffect(() => {
    if (distributionTokensAllowanceDetails.length && distributionsEnabled) {
      setTokenAllowanceDetails(distributionTokensAllowanceDetails);
    } else if (depositTokenAllowanceDetails.length && depositsEnabled) {
      setTokenAllowanceDetails(depositTokenAllowanceDetails);
    }
  }, [depositTokenAllowanceDetails, distributionTokensAllowanceDetails]);

  // set correct token address
  let etherscanAddress = syndicateAddress;
  if (depositsEnabled && depositTokenAllowanceDetails.length) {
    const { tokenAddress } = depositTokenAllowanceDetails[0];
    etherscanAddress = tokenAddress;
  }

  // loader states
  let showLoader = false;
  if (
    submitting ||
    metamaskConfirmPending ||
    metamaskError ||
    allowanceApprovalSuccess
  ) {
    showLoader = true;
  }

  return (
    <Modal
      {...{
        title: distributionTokensAllowanceDetails
          ? "Set New Allowances"
          : "Set New Allowance",
        show: showManagerSetAllowances,
        closeModal: closeAllowancesModal,
        showCloseButton,
        customWidth: `${showLoader ? `sm:w-1/3` : `sm:w-2/3`}`,
        loading: showLoader,
        titleFontSize: "text-3xl",
      }}>
      {submitting ? (
        <SyndicateActionLoader
          contractAddress={etherscanAddress}
          headerText={loaderApprovalHeaderText}
        />
      ) : metamaskConfirmPending ? (
        <SyndicateActionLoader
          headerText={walletPendingConfirmPendingTitleText}
          subText={walletPendingConfirmPendingMessage}
          pending={true}
        />
      ) : metamaskError ? (
        <SyndicateActionLoader
          contractAddress={etherscanAddress}
          headerText={metamaskErrorMessageTitleText}
          subText={metamaskError}
          error={true}
          showRetryButton={true}
          buttonText={dismissButtonText}
          retryButtonClasses={retryButtonClasses}
          closeLoader={closeSyndicateActionLoader}
        />
      ) : allowanceApprovalSuccess ? (
        <SyndicateActionLoader
          contractAddress={etherscanAddress}
          headerText={approvalSuccessTitleText}
          subText={approvalSuccessSubtext}
          showRetryButton={true}
          success={true}
          retryButtonClasses={retryButtonClasses}
          buttonText={dismissButtonText}
          closeLoader={closeSyndicateActionLoader}
        />
      ) : (
        <div className="mx-4 mb-8">
          <p className="text-gray-500 text-sm text-center font-light mb-6">
            {informationText}
          </p>

          {tokenAllowanceDetails.length &&
            tokenAllowanceDetails.map((value, index) => {
              // max value to check allowance against.
              // this will be assigned to either max. total deposits
              // or total token distribution.
              let totalsValue;
              if (depositsEnabled) {
                const { tokenDeposits } = value;
                // check if total deposits has been set to unlimited number
                if (
                  +tokenDeposits >=
                  115792089237316195423570985008687907853269984665640564039457
                ) {
                  totalsValue = "Unlimited";
                } else {
                  totalsValue = tokenDeposits;
                }
              } else if (distributionsEnabled) {
                totalsValue = value.tokenDistributions;
              }
              const { tokenAllowance, tokenSymbol } = value;

              const tokenTotalsValue =
                totalsValue === "Unlimited"
                  ? "Unlimited"
                  : `${floatedNumberWithCommas(totalsValue)} ${tokenSymbol}`;

              const currentAllowanceSet = `${floatedNumberWithCommas(
                tokenAllowance
              )} ${tokenSymbol} / ${tokenTotalsValue}`;

              const newAllowanceAmountValue =
                +allowanceAmount + +tokenAllowance;

              const newAllowanceAmount = `${floatedNumberWithCommas(
                newAllowanceAmountValue
              )} ${tokenSymbol} / ${tokenTotalsValue}`;

              return (
                <form
                  onSubmit={(event) => handleSubmit(event, index)}
                  key={index}>
                  {distributionsEnabled ? (
                    <p className="text-black mx-4 my-4 mt-10 text-lg font-medium leading-5">
                      {tokenSymbol} Distribution
                    </p>
                  ) : null}
                  <div className="bg-gray-99 rounded-xl border border-gray-200">
                    <div className="space-y-4">
                      <div className="border-b-1 border-gray-200 pt-8 pb-4 px-4">
                        <TextInput
                          {...{
                            label: availableAmountLabel,
                          }}
                          value={tokenTotalsValue}
                          name="availableAmount"
                          disabled
                        />
                        <TextInput
                          {...{
                            label: "Current Allowance Set:",
                            value: currentAllowanceSet,
                          }}
                          disabled
                          name="currentAllowanceSet"
                        />
                      </div>

                      <div className="pt-4 pb-6 px-4 sm:px-10">
                        <TextInput
                          {...{
                            label: "Additional Allowance:",
                            value: allowanceAmount,
                            onChange: handleAmountChange,
                            defaultValue: 0,
                            error: allowanceAmountError,
                          }}
                          name="allowance-amount"
                          placeholder="0"
                        />
                        <TextInput
                          {...{
                            label: "New Allowance:",
                            value: newAllowanceAmount,
                          }}
                          disabled
                          name="availableAllowance"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center items-center mt-8">
                    <Button
                      type="submit"
                      customClasses={`${
                        distributionsEnabled ? "rounded-md" : "rounded-full"
                      } bg-blue w-auto px-10 py-2 text-lg font-light ${
                        allowanceAmountError ||
                        submitting ||
                        +allowanceAmount === 0 ||
                        !allowanceAmount
                          ? "opacity-50"
                          : ""
                      }`}
                      disabled={
                        allowanceAmountError ||
                        submitting ||
                        +allowanceAmount === 0 ||
                        !allowanceAmount
                          ? true
                          : false
                      }>
                      {distributionsEnabled
                        ? `Approve`
                        : `Approve ${floatedNumberWithCommas(
                            allowanceAmount ? allowanceAmount : 0
                          )} ${tokenSymbol}`}
                    </Button>
                  </div>
                </form>
              );
            })}
        </div>
      )}
    </Modal>
  );
};

const mapStateToProps = ({
  web3Reducer: { web3 },
  syndicatesReducer: { syndicate },
  tokenDetailsReducer: {
    depositTokenAllowanceDetails,
    distributionTokensAllowanceDetails,
  },
}) => {
  return {
    web3,
    depositTokenAllowanceDetails,
    distributionTokensAllowanceDetails,
    syndicate,
  };
};

ManagerSetAllowance.propTypes = {
  web3: PropTypes.any,
  depositTokenAllowanceDetails: PropTypes.array,
  distributionTokensAllowanceDetails: PropTypes.array,
};

export default connect(mapStateToProps)(ManagerSetAllowance);
