import { TextInput } from "@/components/inputs";
import Modal from "@/components/modal";
import {
  FinalStateModal,
  PendingStateModal,
} from "@/components/shared/transactionStates";
import ConfirmStateModal from "@/components/shared/transactionStates/confirm";
import {
  confirmingTransaction,
  confirmSetManagerFeeAddressText,
  constants,
  metamaskConstants,
  rejectTransactionText,
  waitTransactionTobeConfirmedText,
  walletConfirmConstants,
} from "@/components/syndicates/shared/Constants";
import { managerActionTexts } from "@/components/syndicates/shared/Constants/managerActions";
import { SyndicateActionLoader } from "@/components/syndicates/shared/syndicateActionLoader";
import { checkAccountAllowance } from "@/helpers/approveAllowance";
import { getTotalDistributions } from "@/helpers/distributions";
import { getMetamaskError } from "@/helpers/metamaskError";
import {
  getSyndicateByAddress,
  updateSyndicateManagerFeeAddress,
} from "@/redux/actions/syndicates";
import { storeDistributionTokensDetails } from "@/redux/actions/tokenAllowances";
import { RootState } from "@/redux/store";
import ERC20ABI from "@/utils/abi/erc20";
import { getWeiAmount } from "@/utils/conversions";
import { ERC20TokenDetails } from "@/utils/ERC20Methods";
import { formatAddress } from "@/utils/formatAddress";
import { floatedNumberWithCommas } from "@/utils/numberWithCommas";
import { TokenMappings } from "@/utils/tokenMappings";
import { isZeroAddress, Validate } from "@/utils/validators";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "src/components/buttons";

interface Props {
  showDistributeToken: boolean;
  setShowDistributeToken: Function;
}

/**
 * This component displays a form with input fields used to set a syndicate
 * distributions. The component also has some details about the current ownership
 * percentages for the syndicate protocol and syndicate lead
 * @param props
 * @returns
 */
const DistributeToken = (props: Props) => {
  const { showDistributeToken, setShowDistributeToken } = props;

  const {
    syndicateInstanceReducer: { syndicateContractInstance },
    syndicatesReducer: { syndicate },
    tokenDetailsReducer: { distributionTokensAllowanceDetails },
    web3Reducer: {
      web3: { account, web3 },
    },
  } = useSelector((state: RootState) => state);

  const dispatch = useDispatch();

  const router = useRouter();
  const { syndicateAddress } = router.query;
  const [submitting, setSubmitting] = useState(false);
  const [savingMemberAddress, setSavingMemberAddress] = useState(false);

  const ERC20TokenDefaults = {
    tokenAddress: "",
    tokenNonFormattedAddress: "",
    tokenAllowance: "0",
    tokenDistribution: "0",
    tokenAllowanceAmount: "0",
    tokenAddressError: "",
    tokenAllowanceError: "",
    tokenAllowanceApproved: false,
    tokenDecimals: "18",
    tokenSymbol: "",
    profitShareToSyndicateLead: "0",
    profitShareToSyndicateProtocol: "0",
    availableToWithdraw: "0",
    tokenId: 0,
  };

  // input fields for distribute token form
  const [ERC20TokenFields, setERC20TokenFields] = useState<any>([
    ERC20TokenDefaults,
  ]);

  const [enableDistributeButton, setEnableDistributeButton] = useState<boolean>(
    false
  );
  const [
    metamaskDistributionError,
    setMetamaskDistributionError,
  ] = useState<string>("");
  const [successfulDistribution, setSuccessfulDistribution] = useState<boolean>(
    false
  );

  /**
   * This method process the setDistribution event that is emitted as
   * distributions are set
   * @param eventValues
   */
  const processSetDistributionEvent = async (eventValues) => {
    const { distributionERC20Address, syndicateAddress } = eventValues;

    ERC20TokenFields.forEach(async (tokenField, currentIndex) => {
      const {
        tokenDecimals,
        tokenNonFormattedAddress,
        tokenAllowance,
        tokenSymbol,
      } = tokenField;

      if (distributionERC20Address === tokenNonFormattedAddress) {
        // get current distributions.
        const totalCurrentDistributions = await getTotalDistributions(
          syndicateContractInstance,
          syndicateAddress,
          tokenNonFormattedAddress
        );
        updateERC20TokenValue(
          "tokenDistribution",
          currentIndex,
          totalCurrentDistributions
        );

        const convertedTokenDistributions = getWeiAmount(
          totalCurrentDistributions,
          tokenDecimals,
          false
        );

        const distributionTokensAllowanceDetailsCopy = [
          ...distributionTokensAllowanceDetails,
        ];

        if (distributionTokensAllowanceDetails.length) {
          // check if token has a distribution set already
          for (
            let i = 0;
            i < distributionTokensAllowanceDetailsCopy.length;
            i++
          ) {
            const { tokenAddress } = distributionTokensAllowanceDetailsCopy[i];
            if (tokenAddress === tokenNonFormattedAddress) {
              distributionTokensAllowanceDetailsCopy[i][
                "tokenDistributions"
              ] = convertedTokenDistributions;
              distributionTokensAllowanceDetailsCopy[i][
                "tokenAllowance"
              ] = tokenAllowance;
              distributionTokensAllowanceDetailsCopy[i][
                "sufficientAllowanceSet"
              ] = true;

              // dispatch action to store to update distribution token details
              dispatch(
                storeDistributionTokensDetails(
                  distributionTokensAllowanceDetailsCopy
                )
              );
              return;
            }
          }
        } else {
          //store new details if the token doesn't have previous allowance
          const tokenDetails = [
            {
              tokenAddress: tokenNonFormattedAddress,
              tokenDistributions: convertedTokenDistributions,
              tokenAllowance,
              sufficientAllowanceSet: true,
              tokenSymbol,
            },
          ];
          // dispatch action to store to update distribution token details
          dispatch(storeDistributionTokensDetails(tokenDetails));
        }
      }
    });
  };

  /**Method to handle metamask error states
   * @param error error object received from metamask
   */
  const handleDistributionError = (error: any) => {
    const { code } = error;
    const errorMessage = getMetamaskError(code, "Distribution");
    const { insufficientBalanceErrorText } = managerActionTexts;
    const accountBalanceText = insufficientBalanceErrorText;
    const finalErrorMessage = `${errorMessage} ${accountBalanceText} `;

    if (code === 4001 || code === -32602 || code === -32603) {
      setMetamaskDistributionError(errorMessage);
    } else {
      setMetamaskDistributionError(finalErrorMessage);
    }

    setSubmitting(false);
    setSuccessfulDistribution(false);
  };

  /**
   * Submit all distribution tokens set.
   * Note: Distributions cannot be set if managerFeeAddress for this syndicate
   * is not set. So, we check whether the managerFeeAddress is set before
   * continuing.
   * @param event
   */
  const onSubmit = async (event) => {
    event.preventDefault();

    setManagerFeeAddressError("");

    // Do not continue if managerFeeAddress is not set.
    if (isZeroAddress(syndicate.managerFeeAddress)) {
      setManagerFeeAddressError(
        "Manager fee recipient Address is not set yet. Please set it before proceeding."
      );
      return;
    }

    const tokenAddresses = [];
    const tokenDistributionAmounts = [];

    ERC20TokenFields.forEach((ERC20TokenField) => {
      const {
        tokenNonFormattedAddress,
        tokenAllowance,
        tokenDecimals,
      } = ERC20TokenField;

      // get correct wei amount to send to the contract.
      const distributionAmount = getWeiAmount(
        tokenAllowance,
        tokenDecimals,
        true
      );

      tokenAddresses.push(tokenNonFormattedAddress);
      tokenDistributionAmounts.push(distributionAmount);
    });

    setMetamaskConfirmationPending(true);
    try {
      await syndicateContractInstance.methods
        .managerSetDistributions(
          syndicateAddress,
          tokenAddresses,
          tokenDistributionAmounts
        )
        .send({ from: account, gasLimit: 800000 })
        .on("transactionHash", () => {
          // user has confirmed the transaction so we should start loader state.
          // show loading modal
          setMetamaskConfirmationPending(false);
          setSubmitting(true);
        })
        .on("receipt", async (receipt) => {
          // transaction was succesful
          setSuccessfulDistribution(true);
          setSubmitting(false);
          setMetamaskDistributionError("");
          // process result
          if (receipt) {
            // For a single distribution token, an single event in
            // emitted, and thus managerSetterDistribution will be an
            // object whereas for multiple distribution tokens, multiple
            // events are emitted and therefore managerSetterDistribution // will be an array
            const { managerSetterDistribution } = receipt.events;
            if (Array.isArray(managerSetterDistribution)) {
              managerSetterDistribution.forEach((distributionEvent) => {
                // multiple events will be emitted for distributions set for
                // new tokenAddresses
                processSetDistributionEvent(distributionEvent);
              });
            } else {
              processSetDistributionEvent(managerSetterDistribution);
            }
          }

          // dispatch new syndicate details
          dispatch(
            getSyndicateByAddress(syndicateAddress, syndicateContractInstance)
          );
        })
        .on("error", (error) => {
          // transaction was rejected on Metamask.
          handleDistributionError(error);
        });
    } catch (error) {
      handleDistributionError(error);
    }
  };

  // add input fields for a new ERC20 distribution
  const addERC20Fields = () => {
    // add a unique id to each default token state.
    const tokenId = ERC20TokenFields.length + 1;
    setERC20TokenFields([
      ...ERC20TokenFields,
      { ...ERC20TokenDefaults, tokenId },
    ]);
  };

  /** This method checks the allowance that's been already set on a given token
   * @param tokenAddress the token contract address
   * @param tokenDecimals number of decimal places for the token
   * @returns string allowance amount in wei
   */
  const checkCurrentTokenAllowance = async (
    tokenAddress: string,
    tokenDecimals: string
  ) => {
    const tokenAllowance = await checkAccountAllowance(
      tokenAddress,
      account,
      syndicateContractInstance._address
    );

    const currentTokenAllowance = getWeiAmount(
      tokenAllowance.toString(),
      +tokenDecimals,
      false
    );

    return currentTokenAllowance;
  };

  /**
   * This method handles fetching of distribution token decimals
   * @param distributionERC20Address the address of the distribution token
   * @index the index of the token in the ERC20TokenFields state
   * @returns number of decimal places
   */
  const getDistributionTokenDecimals = async (
    index: number,
    distributionERC20Address: string
  ) => {
    // get token decimals
    const tokenDetails = new ERC20TokenDetails(distributionERC20Address);
    const tokenDecimals = await tokenDetails.getTokenDecimals();
    updateERC20TokenValue("tokenDecimals", index, tokenDecimals);
    return tokenDecimals;
  };

  /**
   * This method handles fetching of distribution token symbols
   * @param distributionERC20Address the address of the distribution token
   * @index the index of the token in the ERC20TokenFields state
   * @returns token symbol from token mappings
   */
  const getDistributionTokenSymbol = (
    index: number,
    distributionERC20Address: string
  ) => {
    // set token symbol based on token address
    const tokenAddress = distributionERC20Address;
    const mappedTokenAddress = Object.keys(TokenMappings).find(
      (key) =>
        web3.utils.toChecksumAddress(key) ==
        web3.utils.toChecksumAddress(tokenAddress)
    );
    if (mappedTokenAddress) {
      updateERC20TokenValue(
        "tokenSymbol",
        index,
        TokenMappings[mappedTokenAddress]
      );
    } else {
      updateERC20TokenValue("tokenSymbol", index, "unknown");
    }
  };

  //update state with details of a specific distribution token
  const updateERC20TokenValue = (
    name: string,
    index: number,
    value: string | boolean
  ) => {
    let tokenFieldsCopy = [...ERC20TokenFields];
    tokenFieldsCopy[index][name] = value;
    setERC20TokenFields(tokenFieldsCopy);
  };

  // set token values back to defaults when an error is encountered.
  const resetTokenValues = (index: number) => {
    updateERC20TokenValue("tokenAllowanceApproved", index, false);
    updateERC20TokenValue("tokenDecimals", index, "18");
    updateERC20TokenValue("tokenAllowance", index, "0");
    updateERC20TokenValue("profitShareToSyndicateProtocol", index, "0");
    updateERC20TokenValue("profitShareToSyndicateLead", index, "0");
    updateERC20TokenValue("availableToWithdraw", index, "0");
    updateERC20TokenValue("tokenSymbol", index, "");
    updateERC20TokenValue("tokenNonFormattedAddress", index, "");
    updateERC20TokenValue("tokenAddress", index, "");
  };

  /**
   * This method sets the amount of token to be distributed to the members.
   * It also validates the input value and set appropriate error message
   */
  const handleAmountChange = async (event, index) => {
    event.preventDefault();
    const { value, name } = event.target;

    updateERC20TokenValue(name, index, value);

    const message = Validate(value);
    if (message) {
      updateERC20TokenValue(
        "tokenAllowanceError",
        index,
        `Distribution amount ${message}`
      );
      updateERC20TokenValue("profitShareToSyndicateProtocol", index, "0");
      updateERC20TokenValue("profitShareToSyndicateLead", index, "0");
      updateERC20TokenValue("availableToWithdraw", index, "0");
    } else {
      updateERC20TokenValue("tokenAllowanceError", index, "");
      // get previous allowance set for token.
      // if the amount entered matches this, indicate that the allowance
      // has already been approved.
      const { tokenNonFormattedAddress, tokenDecimals } = ERC20TokenFields[
        index
      ];
      if (tokenNonFormattedAddress) {
        const currentTokenAllowance = await checkCurrentTokenAllowance(
          tokenNonFormattedAddress,
          tokenDecimals
        );

        // check if the value in the input field is the same as the current token allowance
        if (+currentTokenAllowance === +value) {
          updateERC20TokenValue("tokenAllowanceApproved", index, true);
        } else {
          updateERC20TokenValue("tokenAllowanceApproved", index, false);
        }
      }

      // get profit share values
      const {
        profitShareToSyndicateProtocol,
        profitShareToSyndicateLead,
      } = syndicate;
      const tokenProfitShareToSyndicateProtocol =
        (+value * +profitShareToSyndicateProtocol) / 100;
      const tokenProfitShareToSyndicateLead =
        (+value * +profitShareToSyndicateLead) / 100;

      // token amount available for withdrawal is the value entered less
      // profit share to syndicate and to the lead.
      const tokenWithdrawalAmountAvailable =
        +value -
        (tokenProfitShareToSyndicateLead + tokenProfitShareToSyndicateProtocol);

      updateERC20TokenValue(
        "profitShareToSyndicateProtocol",
        index,
        tokenProfitShareToSyndicateProtocol.toString()
      );
      updateERC20TokenValue(
        "profitShareToSyndicateLead",
        index,
        tokenProfitShareToSyndicateLead.toString()
      );
      updateERC20TokenValue(
        "availableToWithdraw",
        index,
        tokenWithdrawalAmountAvailable.toString()
      );
    }
  };

  /**
   * This method sets the distribution token address from which members can
   * withdraw their investments.
   * It also validates the input value and sets the appropriate error message.
   */
  const handleTokenAddressChange = async (event, index) => {
    const { value } = event.target;

    const formattedAddress = formatAddress(value, 10, 10);

    if (!value.trim()) {
      updateERC20TokenValue(
        "tokenAddressError",
        index,
        "Token address is required"
      );
      resetTokenValues(index);
    } else if (web3 && !web3.utils.isAddress(value)) {
      updateERC20TokenValue(
        "tokenAddressError",
        index,
        "Enter a valid address"
      );
      updateERC20TokenValue("tokenAddress", index, "");
      resetTokenValues(index);
    } else {
      updateERC20TokenValue("tokenAddressError", index, "");
      // set token decimals and symbol for the distribution token
      const distributionERC20Address = value;
      getDistributionTokenDecimals(index, distributionERC20Address);
      getDistributionTokenSymbol(index, distributionERC20Address);
      updateERC20TokenValue("tokenAddress", index, formattedAddress);
      updateERC20TokenValue("tokenNonFormattedAddress", index, value);

      // get previous allowance set for the current token
      // if the amount entered matches this, indicate that the allowance
      // has already been approved.
      const { tokenDecimals, tokenAllowance } = ERC20TokenFields[index];

      if (tokenAllowance) {
        const currentTokenAllowance = await checkCurrentTokenAllowance(
          value,
          tokenDecimals
        );

        // check if the value in the input field is the same as the current token allowance
        if (+currentTokenAllowance === +tokenAllowance && +tokenAllowance > 0) {
          updateERC20TokenValue("tokenAllowanceApproved", index, true);
        } else {
          updateERC20TokenValue("tokenAllowanceApproved", index, false);
        }
      }
    }
  };

  const [
    metamaskConfirmationPending,
    setMetamaskConfirmationPending,
  ] = useState<boolean>(false);

  const [metamaskApprovalError, setMetamaskApprovalError] = useState<string>(
    ""
  );
  const [
    submittingAllowanceApproval,
    setSubmittingAllowanceApproval,
  ] = useState<boolean>(false);

  /** Method to handle allowance approval error
   * @param error object containing error details
   * @index an option param that's the current token index
   */
  const handleAllowanceError = (error: any, index: number = null) => {
    const { code } = error;
    const errorMessage = getMetamaskError(code, "Allowance approval");
    setMetamaskApprovalError(errorMessage);
    if (index) {
      updateERC20TokenValue("tokenAllowanceAmount", index, "0");
    }
    setSubmittingAllowanceApproval(false);
    setMetamaskConfirmationPending(false);
  };

  /** This method handle allowance approvals for a given token
   * The allowance has to be set before the manager can set distributions.
   */
  const handleTokenAllowanceApproval = async (event, index) => {
    event.preventDefault();
    const allowanceAmount = ERC20TokenFields[index].tokenAllowance;

    const tokenDetails = ERC20TokenFields[index];
    const { tokenNonFormattedAddress, tokenDecimals } = tokenDetails;

    // set up token contract.
    const tokenContract = new web3.eth.Contract(
      ERC20ABI,
      tokenNonFormattedAddress
    );

    // set metamask loading state
    setMetamaskConfirmationPending(true);

    // set correct wei amount to approve
    const amountToApprove = getWeiAmount(allowanceAmount, tokenDecimals, true);

    // set up allowance
    try {
      await tokenContract.methods
        .approve(syndicateContractInstance._address, amountToApprove)
        .send({ from: account, gasLimit: 800000 })
        .on("transactionHash", () => {
          // user clicked on confirm
          // show loading state
          setSubmittingAllowanceApproval(true);
          setMetamaskConfirmationPending(false);
        })
        .on("receipt", async (receipt) => {
          setSubmittingAllowanceApproval(false);

          // approval transaction successful
          // sometimes the event is empty
          const { Approval } = receipt.events;

          if (Approval) {
            const { returnValues } = Approval;
            const { wad } = returnValues;
            const managerApprovedAllowance = getWeiAmount(
              wad,
              tokenDecimals,
              false
            );

            updateERC20TokenValue("tokenAllowanceApproved", index, true);
            updateERC20TokenValue(
              "tokenAllowanceAmount",
              index,
              `${managerApprovedAllowance}`
            );

            // get current distributions.
            const totalCurrentDistributions = await getTotalDistributions(
              syndicateContractInstance,
              syndicateAddress,
              tokenNonFormattedAddress
            );

            const convertedTokenDistributions = getWeiAmount(
              totalCurrentDistributions,
              tokenDecimals,
              false
            );
            if (distributionTokensAllowanceDetails.length) {
              const sufficientAllowanceSet =
                +managerApprovedAllowance >= +totalCurrentDistributions;
              // dispatch action to store to update distribution token details
              const distributionTokensAllowanceDetailsCopy = [
                ...distributionTokensAllowanceDetails,
              ];

              // check if token has a distribution set already
              for (
                let i = 0;
                i < distributionTokensAllowanceDetailsCopy.length;
                i++
              ) {
                const { tokenAddress } = distributionTokensAllowanceDetailsCopy[
                  i
                ];
                if (tokenAddress === tokenNonFormattedAddress) {
                  distributionTokensAllowanceDetailsCopy[i][
                    "tokenDistributions"
                  ] = convertedTokenDistributions;
                  distributionTokensAllowanceDetailsCopy[i][
                    "tokenAllowance"
                  ] = managerApprovedAllowance;
                  distributionTokensAllowanceDetailsCopy[i][
                    "sufficientAllowanceSet"
                  ] = sufficientAllowanceSet;
                }
              }

              dispatch(
                storeDistributionTokensDetails(
                  distributionTokensAllowanceDetailsCopy
                )
              );
            }
          }
        })
        .on("error", (error) => {
          // user clicked reject.
          handleAllowanceError(error, index);
        });
    } catch (error) {
      // error occured before wallet prompt.
      handleAllowanceError(error);
    }
  };

  // texts for metamask confirmation pending
  const {
    walletPendingConfirmPendingTitleText,
    walletPendingConfirmPendingMessage,
  } = walletConfirmConstants;

  // texts error states
  const {
    dismissButtonText,
    loaderApprovalHeaderText,
    loaderDistributionHeaderText,
  } = constants;

  // texts for metamask states
  const { metamaskErrorMessageTitleText } = metamaskConstants;

  // method to close loader
  const closeSyndicateActionLoader = () => {
    setMetamaskConfirmationPending(false);
    setMetamaskApprovalError("");
    setSubmittingAllowanceApproval(false);
    setMetamaskDistributionError("");
    setSuccessfulDistribution(false);
  };

  // props for the loader component
  let contractAddress = syndicateAddress;
  let error = false;
  let showRetryButton = false;
  let pending = true;
  let buttonText = dismissButtonText;
  let headerText = walletPendingConfirmPendingTitleText;
  let subText = walletPendingConfirmPendingMessage;

  // metamask error state for allowance approval
  if (metamaskApprovalError) {
    contractAddress = syndicate?.depositERC20ContractAddress;
    headerText = metamaskErrorMessageTitleText;
    subText = metamaskApprovalError;
    error = true;
    showRetryButton = true;
    pending = false;
  }

  // loader states when contract interactions are in progress.
  if (submittingAllowanceApproval) {
    headerText = loaderApprovalHeaderText;
    subText = null;
    pending = false;
  }

  if (submitting) {
    headerText = loaderDistributionHeaderText;
    subText = null;
    pending = false;
  }

  if (successfulDistribution || metamaskDistributionError) {
    contractAddress = syndicateAddress;
  }

  // metamask error/success states for setting distributions
  if (metamaskDistributionError) {
    headerText = metamaskErrorMessageTitleText;
    subText = metamaskDistributionError;
    error = true;
    showRetryButton = true;
    pending = false;
  }

  let success = false;
  const {
    successfulDistributionTitleText,
    successfulDistributionText,
  } = managerActionTexts;

  if (successfulDistribution) {
    headerText = successfulDistributionTitleText;
    subText = successfulDistributionText;
    error = false;
    success = true;
    showRetryButton = true;
    pending = false;
  }

  // get instances where a loader needs to be rendered.
  let showLoader = false;
  if (
    metamaskConfirmationPending ||
    submittingAllowanceApproval ||
    metamaskApprovalError ||
    successfulDistribution ||
    metamaskDistributionError ||
    submitting
  ) {
    showLoader = true;
  }

  // close button will not be shown if the modal is in a loading state
  let showCloseButton = true;
  let cannotCloseModalStates =
    metamaskConfirmationPending || submittingAllowanceApproval || submitting;
  if (cannotCloseModalStates) {
    showCloseButton = false;
  }
  // method to close distribution modal
  const closeDistributionModal = () => {
    if (cannotCloseModalStates) {
      return;
    } else {
      setShowDistributeToken(false);
    }
  };

  // set scenarios where the distribute button should be enabled
  // we'll loop over all current distribution tokens and check the approval
  // as well as error status.
  useEffect(() => {
    for (let i = 0; i < ERC20TokenFields.length; i++) {
      const {
        tokenAllowanceApproved,
        tokenAddressError,
        tokenAllowanceError,
      } = ERC20TokenFields[i];
      if (!tokenAllowanceApproved || tokenAddressError || tokenAllowanceError) {
        setEnableDistributeButton(false);
        return;
      }
      setEnableDistributeButton(true);
    }
  }, [ERC20TokenFields]);

  // styling for close button
  const retryButtonClasses =
    "rounded-full bg-blue-light text-white mt-4 w-auto px-10 py-2 text-lg font-light";

  const {
    managerSyndicateAddressTooltipText,
    setDistributionsSubText,
    setDistributionsTitleText,
    managerChooseDistributionTokenText,
    syndicateMustBeClosedText,
    distributionDetailsTitleText,
  } = managerActionTexts;

  const [managerFeeAddressError, setManagerFeeAddressError] = useState("");
  const [managerFeeAddress, setManagerFeeAddress] = useState(
    syndicate?.managerFeeAddress
  );

  /**
   * validates manager fee address updating error states and the manager fee
   * address value
   * @param event
   */
  const handleManagerFeeAddressChange = (event) => {
    event.preventDefault();
    setManagerFeeAddressError("");

    const { value } = event.target;
    setManagerFeeAddress(value);

    if (!value.trim()) {
      setManagerFeeAddressError(
        "A manager fee address cannot be an empty value"
      );
    } else if (isZeroAddress(value)) {
      setManagerFeeAddressError(
        "A manager Fee address must not be a zero address"
      );
    } else if (!(web3 && web3.utils.isAddress(value))) {
      setManagerFeeAddressError(
        "A manager Fee address must be a valid ethereum address."
      );
    }
  };

  const handleError = (error) => {
    // capture metamask error
    setShowWalletConfirmationModal(false);
    setSavingMemberAddress(false);

    const { code } = error;

    const errorMessage = getMetamaskError(code, "Manager Fee Address");
    setFinalButtonText("Dismiss");
    setFinalStateIcon("/images/roundedXicon.svg");

    if (code == 4001) {
      setFinalStateHeaderText("Transaction Rejected");
    } else if (code == undefined) {
      setFinalStateHeaderText(
        "The manager fee address should be different from the current manager address attached to this syndicate"
      );
    } else {
      setFinalStateHeaderText(errorMessage);
    }
    setShowFinalState(true);
  };

  /**
   * Final state variables
   */
  const [finalStateButtonText, setFinalButtonText] = useState("");
  const [finalStateHeaderText, setFinalStateHeaderText] = useState("");
  const [finalStateIcon, setFinalStateIcon] = useState("");
  const [showFinalState, setShowFinalState] = useState(false);

  // set metamask loading state
  const [
    showWalletConfirmationModal,
    setShowWalletConfirmationModal,
  ] = useState(false);

  const handleCloseFinalStateModal = async () => {
    setShowFinalState(false);
  };

  const handleSubmitManagerFeeAddress = async (event) => {
    event.preventDefault();

    setManagerFeeAddressError("");
    setShowWalletConfirmationModal(true);

    try {
      await syndicateContractInstance.methods
        .managerSetManagerFeeAddress(syndicateAddress, managerFeeAddress)
        .send({ from: account, gasLimit: 800000 })
        .on("transactionHash", () => {
          setShowWalletConfirmationModal(false);
          setSavingMemberAddress(true);
        })
        .on("receipt", async () => {
          dispatch(updateSyndicateManagerFeeAddress(managerFeeAddress));
          setSavingMemberAddress(false);
          setManagerFeeAddressAlreadySet(true);
        })
        .on("error", (error) => {
          console.log({ error });
          handleError(error);
        });
    } catch (error) {
      handleError(error);
    }
  };

  /**
   * This variable controls whether to show a form for a manager to set his/her
   * fee recipient address
   */
  const [
    managerFeeAddressAlreadySet,
    setManagerFeeAddressAlreadySet,
  ] = useState(false);

  /**
   * Checks whether managerFeeAddress is set for a given syndicate.
   * By default the managerFeeAddress is address(0) which means the manager has
   * not set his/her fee recipient address. Distributions cannot be enabled
   * before managerFeeAddress is set.
   * @returns
   */
  const isManagerFeeAddressSet = () => {
    if (!syndicate) return;
    if (isZeroAddress(syndicate.managerFeeAddress)) {
      setManagerFeeAddressAlreadySet(false);
    } else {
      setManagerFeeAddressAlreadySet(true);
    }
  };

  useEffect(() => {
    isManagerFeeAddressSet();
    return () => {
      setManagerFeeAddressAlreadySet(false);
    };
  }, [syndicate]);
  return (
    <>
      <Modal
        {...{
          title: "Distribute Tokens to Members",
          show: showDistributeToken,
          closeModal: closeDistributionModal,
          customWidth: `${showLoader ? `sm:w-1/3` : `sm:w-2/3`}`,
          titleFontSize: "text-3xl",
          loading: showLoader,
          showCloseButton,
        }}>
        {showLoader ? (
          <SyndicateActionLoader
            {...{
              contractAddress,
              buttonText,
              headerText,
              subText,
              error,
              pending,
              success,
              closeLoader: closeSyndicateActionLoader,
              showRetryButton,
              retryButtonClasses,
            }}
          />
        ) : (
          <div className="mx-4 mb-8">
            <p className="text-gray-500 text-base leading-5 font-light mb-6">
              {managerChooseDistributionTokenText}
            </p>
            <p className="my-2 font-semibold leading-5 mb-10">
              {setDistributionsSubText}
            </p>

            <div>
              <p className="text-blue-light mx-4 my-4 text-lg font-medium leading-5">
                {setDistributionsTitleText}
              </p>
              <div className="bg-gray-99 border border-gray-200 rounded-xl">
                {!syndicate?.depositsEnabled ? (
                  <div>
                    {/* syndicate address */}
                    <div className="border-b-1 border-gray-200 pt-4 pb-2 px-8">
                      <TextInput
                        {...{
                          label: "Syndicate Wallet Address:",
                          tooltip: managerSyndicateAddressTooltipText,
                        }}
                        value={syndicateAddress.toString()}
                        name="syndicateAddress"
                        disabled
                      />
                    </div>

                    {/* Tokensto Distribute */}
                    {ERC20TokenFields.map((value, index) => {
                      const {
                        tokenAllowanceApproved,
                        tokenAllowanceError,
                        tokenAddressError,
                        tokenAllowance,
                        tokenAddress,
                      } = value;

                      // disable the approval button if there is an amount or address error
                      // button will also be disabled
                      const disableApprovalButton = Boolean(
                        tokenAllowanceError ||
                          tokenAddressError ||
                          !tokenAddress ||
                          !tokenAllowance ||
                          tokenAllowanceApproved
                      );

                      return (
                        <form
                          className="mt-0"
                          key={index}
                          onSubmit={(event) =>
                            handleTokenAllowanceApproval(event, index)
                          }>
                          <div
                            className="flex justify-center flex-col xl:flex-row py-4 px-8 border-b-1 border-gray-200"
                            key={index}>
                            <TextInput
                              {...{
                                label: "Token Address",
                                value: tokenAddress,
                                onChange: (event) =>
                                  handleTokenAddressChange(event, index),
                                error: tokenAddressError,
                                column: true,
                              }}
                              name="tokenAddress"
                              placeholder="0x..."
                            />

                            {/* amount */}
                            <TextInput
                              {...{
                                label: "Distribution Amount",
                                value: tokenAllowance,
                                onChange: (event) =>
                                  handleAmountChange(event, index),
                                defaultValue: 0,
                                error: tokenAllowanceError,
                                column: true,
                              }}
                              name="tokenAllowance"
                              placeholder="0"
                            />
                            <div
                              className={`flex ${
                                disableApprovalButton
                                  ? `items-start`
                                  : `items-end`
                              }`}>
                              <Button
                                type="submit"
                                customClasses={`rounded-md bg-blue-light border-2 border-blue-light w-full mr-4 xl:mr-0 xl:w-33 mt-2 px-6 py-1 h-9 text-sm font-light mb-3 ${
                                  disableApprovalButton
                                    ? `opacity-50 xl:mt-9 mb-0 `
                                    : ``
                                }`}
                                disabled={disableApprovalButton}
                                approved={tokenAllowanceApproved}>
                                {tokenAllowanceApproved
                                  ? `Approved`
                                  : `Approve`}
                              </Button>
                            </div>
                          </div>
                        </form>
                      );
                    })}
                    <div className="flex justify-center items-center py-6">
                      <p
                        className="text-sm text-blue-light font-light cursor-pointer w-fit-content"
                        onClick={() => addERC20Fields()}>
                        <img
                          className="inline w-6 mr-1"
                          src="/images/plusSign.svg"
                        />
                        Choose another token
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex flex-row justify-center">
                      <p className="text-green-500">
                        {syndicateMustBeClosedText}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <p className="text-gray-500 mx-4 my-4 mt-10 text-lg font-medium leading-5">
                {distributionDetailsTitleText}
              </p>
              <div className="bg-gray-99 border border-gray-200 mt-4 pb-8 rounded-xl">
                {managerFeeAddressAlreadySet ? (
                  <div className="border-b-1 mb-6 border-gray-200 pt-4 pb-2 px-4">
                    <TextInput
                      {...{
                        label: "Manager Fee Address:",
                        tooltip:
                          "The manager fee address should be different from the current manager address attached to this syndicate.",
                      }}
                      value={
                        managerFeeAddress ||
                        syndicate.managerFeeAddress.toString()
                      }
                      name="managerFeeAddress"
                      disabled
                    />
                  </div>
                ) : (
                  <form
                    className="w-full border-b-1 my-6"
                    onSubmit={handleSubmitManagerFeeAddress}>
                    <div className="flex justify-between flex-col px-8 border-gray-200">
                      {/* Manager fee address */}
                      <p className="text-sm">Manager Fee Address</p>
                      <div className="w-full flex-grow flex justify-between my-2">
                        {/* input field */}
                        <div className="flex flex-grow flex-col">
                          <input
                            type="text"
                            name="managerFeeAddress"
                            className={`text-black border-gray-85 text-sm font-whyte focus:ring-indigo-500 focus:border-indigo-500 rounded-md
                        mr-4 mb-3`}
                            step="1"
                            placeholder="0x..."
                            onChange={handleManagerFeeAddressChange}
                            value={
                              isZeroAddress(managerFeeAddress)
                                ? ""
                                : managerFeeAddress
                            }
                          />
                        </div>
                        <Button
                          type="submit"
                          customClasses={`rounded-md bg-blue-light border-2 border-blue-light w-full mr-4 xl:mr-0 xl:w-33 px-6 text-sm font-light mb-3 ${
                            (managerFeeAddressError && !managerFeeAddress) ||
                            !managerFeeAddress ||
                            managerFeeAddress === syndicate?.managerFeeAddress
                              ? "opacity-40"
                              : ""
                          }`}
                          approved={managerFeeAddressAlreadySet}
                          disabled={
                            (managerFeeAddressError && !managerFeeAddress) ||
                            !managerFeeAddress
                              ? true
                              : false
                          }>
                          {managerFeeAddress === syndicate &&
                          syndicate?.managerFeeAddress &&
                          managerFeeAddressAlreadySet
                            ? `Confirmed`
                            : "Confirm"}
                        </Button>
                      </div>
                      <p className="text-red-500 text-xs mb-4 -mt-4">
                        {managerFeeAddressError || !managerFeeAddress
                          ? managerFeeAddressError
                          : null}
                      </p>
                    </div>
                  </form>
                )}

                <div className="space-y-4">
                  <div className="flex flex-row justify-center">
                    <div className="mr-2 w-7/12 flex justify-end">
                      <label
                        htmlFor="syndicateAddress"
                        className="block text-black text-sm font-medium">
                        {`Profit Share to Syndicate Lead (${syndicate?.profitShareToSyndicateLead}%):`}
                      </label>
                    </div>

                    <div className="w-5/12 flex justify-between">
                      <ul>
                        {ERC20TokenFields.map((token) => {
                          const {
                            profitShareToSyndicateLead,
                            tokenSymbol,
                          } = token;
                          return (
                            <>
                              {+profitShareToSyndicateLead >= 0 &&
                              tokenSymbol ? (
                                <li>
                                  <p className="text-sm font-normal leading-5 text-black px-4">
                                    {floatedNumberWithCommas(
                                      profitShareToSyndicateLead
                                    )}{" "}
                                    {tokenSymbol}
                                  </p>
                                </li>
                              ) : (
                                <p className="text-sm font-normal leading-5 text-black px-4">
                                  0.00
                                </p>
                              )}
                            </>
                          );
                        })}
                      </ul>
                    </div>
                  </div>

                  <div className="flex flex-row justify-center">
                    <div className="mr-2 w-7/12 flex justify-end">
                      <label
                        htmlFor="syndicateAddress"
                        className="block text-black text-sm font-medium">
                        {`Profit Share to Syndicate Protocol (${syndicate?.profitShareToSyndicateProtocol}%):`}
                      </label>
                    </div>

                    <div className="w-5/12 flex justify-between">
                      {" "}
                      <ul>
                        {ERC20TokenFields.map((token) => {
                          const {
                            profitShareToSyndicateProtocol,
                            tokenSymbol,
                          } = token;
                          return (
                            <>
                              {tokenSymbol &&
                              +profitShareToSyndicateProtocol >= 0 ? (
                                <li>
                                  <p className="text-sm font-normal leading-5 text-black px-4">
                                    {floatedNumberWithCommas(
                                      profitShareToSyndicateProtocol
                                    )}{" "}
                                    {tokenSymbol}
                                  </p>
                                </li>
                              ) : (
                                <p className="text-sm font-normal leading-5 text-black px-4">
                                  0.00
                                </p>
                              )}
                            </>
                          );
                        })}
                      </ul>
                    </div>
                  </div>

                  <div className="flex flex-row justify-center">
                    <div className="mr-2 w-7/12 flex justify-end">
                      <label
                        htmlFor="syndicateAddress"
                        className="block text-black text-sm font-medium">
                        Available for Members to Withdraw:
                      </label>
                    </div>

                    <div className="w-5/12 flex justify-between">
                      <ul>
                        {ERC20TokenFields.map((token) => {
                          const { availableToWithdraw, tokenSymbol } = token;
                          return (
                            <>
                              {tokenSymbol && +availableToWithdraw >= 0 ? (
                                <li>
                                  <p className="text-sm font-medium leading-5 text-black px-4">
                                    {floatedNumberWithCommas(
                                      availableToWithdraw
                                    )}{" "}
                                    {tokenSymbol}
                                  </p>
                                </li>
                              ) : (
                                <p className="text-sm font-normal leading-5 text-black px-4">
                                  0.00
                                </p>
                              )}
                            </>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* submit button */}
              {!syndicate?.depositsEnabled ? (
                <div className="flex my-4 w-full justify-center py-2">
                  {submitting ? (
                    <div className="loader"></div>
                  ) : (
                    <form onSubmit={onSubmit}>
                      <Button
                        type="submit"
                        customClasses={`rounded-full bg-blue-light w-auto px-10 py-2 text-lg ${
                          enableDistributeButton ? "" : "opacity-50"
                        }`}
                        disabled={enableDistributeButton ? false : true}>
                        Distribute Tokens
                      </Button>
                    </form>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        )}
      </Modal>

      {/* Tell user to confirm transaction on their wallet */}
      <ConfirmStateModal show={showWalletConfirmationModal}>
        <div className="flex flex-col justify-centers m-auto mb-4">
          <p className="text-sm text-center mx-8 opacity-60">
            {confirmSetManagerFeeAddressText}
          </p>
          <p className="text-sm text-center mx-8 mt-2 opacity-60">
            {rejectTransactionText}
          </p>
        </div>
      </ConfirmStateModal>

      {/* Loading modal */}
      <PendingStateModal
        {...{
          show: savingMemberAddress,
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

export default DistributeToken;
