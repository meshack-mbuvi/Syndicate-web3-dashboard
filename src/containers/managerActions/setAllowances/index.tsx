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
import { RootState } from "@/redux/store";
import { getWeiAmount } from "@/utils/conversions";
import { floatedNumberWithCommas } from "@/utils/formattedNumbers";
import { Validate } from "@/utils/validators";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  storeDepositTokenAllowance,
  storeDistributionTokensDetails,
} from "src/redux/actions/tokenAllowances";
import ERC20ABI from "src/utils/abi/erc20";
import { isUnlimited } from "src/utils/conversions";

interface Props {
  hideManagerSetAllowances: Function;
  showManagerSetAllowances: boolean;
  depositTokenContract?: any;
  depositTokenDecimals?: number;
}
const ManagerSetAllowance = (props: Props) => {
  const { hideManagerSetAllowances, showManagerSetAllowances } = props;

  const {
    initializeContractsReducer: { syndicateContracts },
    tokenDetailsReducer: {
      depositTokenAllowanceDetails,
      distributionTokensAllowanceDetails,
    },
    syndicatesReducer: { syndicate },
    web3Reducer: {
      web3: { account, web3 },
    },
  } = useSelector((state: RootState) => state);

  const BN = web3.utils.BN;

  const dispatch = useDispatch();
  const router = useRouter();
  const { syndicateAddress } = router.query;

  const [allowanceAmounts, setAllowanceAmounts] = useState<string[]>([]);
  const [allowanceAmountErrors, setAllowanceAmountErrors] = useState<string[]>(
    [],
  );
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [metamaskError, setMetamaskError] = useState<string>("");
  const [metamaskConfirmPending, setMetamaskConfirmPending] = useState<boolean>(
    false,
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
  const depositTotalMax = syndicate?.depositTotalMax;
  const depositsEnabled = syndicate?.depositsEnabled;
  const distributing = syndicate?.distributing;

  // handle allowance value from the input field.
  const handleAmountChange = (event, index) => {
    event.preventDefault();
    const { value } = event.target;

    // add amounts and possible errors to approve to state arrays
    const amountsToApprove = [...allowanceAmounts];
    const amountErrors = [...allowanceAmountErrors];

    amountsToApprove[index] = value;
    setAllowanceAmounts(amountsToApprove);

    const message = Validate(value);
    if (message) {
      amountErrors[index] = `Allowance amount ${message}`;
      setAllowanceAmountErrors(amountErrors);
    } else {
      amountErrors[index] = "";
      setAllowanceAmountErrors(amountErrors);
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
    if (!syndicateContracts.DepositLogicContract) return;

    setMetamaskConfirmPending(true);

    // we're setting/updating allowances for a token from the redux store
    // fetch details of that token using the token address.
    const inputTokenAddress = tokenAllowanceDetails[index]["tokenAddress"];
    let currentTokenIndex = 0;
    let currentToken;
    if (depositsEnabled) {
      // there is only one deposit token.
      currentToken = depositTokenAllowanceDetails[0];
    } else if (distributing) {
      currentToken = distributionTokensAllowanceDetails.find((token, index) => {
        // get the index of the current token
        // we'll use this to update values for this specific token in the redux store
        currentTokenIndex = index;
        return token.tokenAddress === inputTokenAddress;
      });
    }
    // set up token details
    const currentTokenDecimals = currentToken.tokenDecimals;
    const currentTokenAddress = currentToken.tokenAddress;
    const currentTokenAllowance = getWeiAmount(
      currentToken.tokenAllowance,
      currentTokenDecimals,
      true,
    );
    const additionalAllowanceAmount = getWeiAmount(
      allowanceAmounts[index],
      currentTokenDecimals,
      true,
    );

    // set up token contract based on distributions or deposits
    const currentTokenContract = new web3.eth.Contract(
      ERC20ABI,
      currentTokenAddress,
    );

    // get new allowance amount to set.
    const newAllowanceAmountToApprove = new BN(additionalAllowanceAmount).add(
      new BN(currentTokenAllowance.toString()),
    );

    try {
      // Determine contract to set allowance on depending on whether syndicate
      // is open or closed to deposits.
      let tokenContractAddress =
        syndicateContracts.DepositLogicContract._address;
      if (syndicate.distributing) {
        tokenContractAddress =
          syndicateContracts.DistributionLogicContract._address;
      }

      await currentTokenContract.methods
        .approve(tokenContractAddress, newAllowanceAmountToApprove)
        .send({ from: account })
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
          const value = returnValues[2];
          const managerApprovedAllowance = getWeiAmount(
            value,
            currentTokenDecimals,
            false,
          );

          setSubmitting(false);
          if (allowanceApprovalSuccess) {
            setAllowanceApprovalSuccess(false);
          } else {
            setAllowanceApprovalSuccess(true);
          }

          // clear the allowance input field.
          const amountsApproved = [...allowanceAmounts];
          amountsApproved[index] = "0";
          setAllowanceAmounts(amountsApproved);

          // dispatch new allowance details to the store

          if (depositsEnabled) {
            // check whether new allowance matches total max. deposits
            const sufficientAllowanceSet =
              +managerApprovedAllowance >= +depositTotalMax;

            const { tokenSymbol, tokenAddress, tokenDecimals } =
              depositTokenAllowanceDetails[0];

            dispatch(
              storeDepositTokenAllowance([
                {
                  tokenAddress,
                  tokenAllowance: managerApprovedAllowance,
                  tokenDeposits: depositTotalMax,
                  tokenSymbol,
                  tokenDecimals,
                  sufficientAllowanceSet,
                },
              ]),
            );
          } else if (distributing) {
            // dispatch new distribution token allowance details
            const { tokenDistributions } =
              distributionTokensAllowanceDetails[index];
            // check if new allowance set is sufficient.
            const sufficientAllowanceSet =
              +managerApprovedAllowance >= +tokenDistributions;

            // update token details
            const distributionTokensAllowanceDetailsCopy = [
              ...distributionTokensAllowanceDetails,
            ];
            distributionTokensAllowanceDetailsCopy[currentTokenIndex][
              "tokenAllowance"
            ] = managerApprovedAllowance;
            distributionTokensAllowanceDetailsCopy[currentTokenIndex][
              "sufficientAllowanceSet"
            ] = sufficientAllowanceSet;

            dispatch(
              storeDistributionTokensDetails(
                distributionTokensAllowanceDetailsCopy,
              ),
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
  } else if (distributing) {
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
    if (distributionTokensAllowanceDetails.length && distributing) {
      // check which distribution token does not have sufficient allowance
      const insufficientAllowanceTokens = distributionTokensAllowanceDetails.filter(
        (token) => !token.sufficientAllowanceSet,
      );
      setTokenAllowanceDetails(insufficientAllowanceTokens);
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
      }}
    >
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
                if (tokenDeposits && isUnlimited(tokenDeposits)) {
                  totalsValue = "Unlimited";
                } else {
                  totalsValue = tokenDeposits;
                }
              } else if (distributing) {
                totalsValue = value.tokenDistributions;
              }
              const { tokenAllowance, tokenSymbol, tokenDecimals } = value;

              const tokenTotalsValue =
                totalsValue === "Unlimited"
                  ? "Unlimited"
                  : `${floatedNumberWithCommas(totalsValue)} ${tokenSymbol}`;

              const currentAllowanceSet = `${floatedNumberWithCommas(
                tokenAllowance,
              )} ${tokenSymbol} / ${tokenTotalsValue}`;

              const newAllowanceAmountValue =
                +allowanceAmounts[index] + +tokenAllowance;

              const newAllowanceAmount = `${floatedNumberWithCommas(
                newAllowanceAmountValue,
              )} ${tokenSymbol} / ${tokenTotalsValue}`;

              // get correct additional allowance to pre-fill on the allowance input field.
              // This deals with the issue of users having to calculate allowance values to add.
              let prefillAllowanceAmountValue = "0";
              if (totalsValue !== "Unlimited") {
                const weiTotalsValue = getWeiAmount(
                  totalsValue,
                  tokenDecimals,
                  true,
                );
                const currentAllowanceValue = getWeiAmount(
                  tokenAllowance,
                  tokenDecimals,
                  true,
                );
                const additionalAllowanceValue = new BN(weiTotalsValue)
                  .sub(new BN(currentAllowanceValue))
                  .toString();

                prefillAllowanceAmountValue = getWeiAmount(
                  additionalAllowanceValue,
                  tokenDecimals,
                  false,
                );
              }

              return (
                <form
                  onSubmit={(event) => handleSubmit(event, index)}
                  key={index}
                >
                  {distributing ? (
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
                            value: allowanceAmounts[index],
                            onChange: (e) => handleAmountChange(e, index),
                            error: allowanceAmountErrors[index],
                            focus: true,
                          }}
                          name="allowance-amount"
                          type="number"
                          placeholder={prefillAllowanceAmountValue}
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
                        distributing ? "rounded-md" : "rounded-full"
                      } bg-blue w-auto px-10 py-2 text-lg font-light ${
                        allowanceAmountErrors[index] ||
                        submitting ||
                        +allowanceAmounts[index] === 0 ||
                        !allowanceAmounts[index]
                          ? "opacity-50"
                          : ""
                      }`}
                      disabled={
                        allowanceAmountErrors[index] ||
                        submitting ||
                        +allowanceAmounts[index] === 0 ||
                        !allowanceAmounts[index]
                          ? true
                          : false
                      }
                    >
                      {distributing
                        ? `Approve`
                        : `Approve ${floatedNumberWithCommas(
                            allowanceAmounts[index]
                              ? allowanceAmounts[index]
                              : 0,
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

export default ManagerSetAllowance;
