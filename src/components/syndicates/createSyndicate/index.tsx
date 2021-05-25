import { ErrorModal } from "@/components/shared";
import { PendingStateModal } from "@/components/shared/transactionStates";
import ConfirmStateModal from "@/components/shared/transactionStates/confirm";
import { getMetamaskError } from "@/helpers";
import { addSyndicates } from "@/redux/actions/syndicates";
import {
  isWholeNumber,
  Validate,
  validateEmail,
  ValidatePercent,
} from "@/utils/validators";
import Link from "next/link";
import React, { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import DatePicker from "react-datepicker";
import { RootStateOrAny, useDispatch, useSelector } from "react-redux";
// Other useful components
import Button from "src/components/buttons";
import { InfoIcon } from "src/components/iconWrappers";
import {
  CheckBox,
  PercentInput,
  TextInput,
  Toggle,
} from "src/components/inputs";
import { Modal } from "src/components/modal";
// redux actions
import { setSubmitting, showWalletModal } from "src/redux/actions";
import { getWeiAmount } from "src/utils/conversions";
import { ERC20TokenDetails } from "src/utils/ERC20Methods";
import {
  AgreeToOurTermsOfServiceText,
  allowListEnabledToolTip,
  closeDateToolTip,
  confirmCreateSyndicateSubText,
  emailAddressToolTip,
  fullNameToolTip,
  depositTokenToolTip,
  expectedAnnualOperatingFeesToolTip,
  loaderSubtext,
  maximumDepositToolTip,
  maxLpsToolTip,
  MAX_INTEGER,
  minimumDepositToolTip,
  modifiableToolTip,
  pendingState,
  profitShareToSyndicateLeadToolTip,
  profitShareToSyndicateProtocolToolTip,
  syndicateAddressToolTip,
  totalMaximumDepositToolTip,
} from "../shared/Constants";
import { EtherscanLink } from "../shared/EtherscanLink";

/**
 * Diplays all syndicates.
 * The main groups for syndicates are active and inactive
 *
 * At the top-right of the page, there is a create button which opens a modal
 * with a form to create a new syndicate
 */
const CreateSyndicate = (props: any) => {
  // retrieve contract details
  const { showModal, setShowModal } = props;

  const {
    web3: { account, web3 },
  } = useSelector((state: RootStateOrAny) => state.web3Reducer);

  const { syndicateContractInstance } = useSelector(
    (state: RootStateOrAny) => state.syndicateInstanceReducer
  );
  const { submitting } = useSelector(
    (state: RootStateOrAny) => state.loadingReducer
  );

  const dispatch = useDispatch();

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [
    showWalletConfirmationModal,
    setShowWalletConfirmationModal,
  ] = useState(false);

  // input field error messages
  const [fullNameError, setFullNameError] = useState("");
  const [emailAddressError, setEmailAddressError] = useState("");
  const [
    profitShareToSyndProtocolError,
    setProfitShareToSyndProtocolError,
  ] = useState("");
  const [
    primaryERC20ContractAddressError,
    setPrimaryERC20ContractAddressError,
  ] = useState("");
  const [maxDepositsError, setMaxDepositsError] = useState("");
  const [minDepositsError, setMinDepositsError] = useState("");
  const [maxTotalDepositsError, setMaxTotalDepositsError] = useState("");
  const [maxLPsError, setMaxLPsError] = useState("");
  const [
    expectedAnnualOperatingFeesError,
    setExpectedAnnualOperatingFeesError,
  ] = useState("");
  const [
    profitShareToSyndicateLeadError,
    setprofitShareToSyndicateLeadError,
  ] = useState("");

  let validated = false;

  // offchain data
  const [fullName, setFullName] = useState<string>("");
  const [emailAddress, setEmailAddress] = useState<string>("");

  // set defualt to our test DAI address
  const [
    primaryERC20ContractAddress,
    setPrimaryERC20ContractAddress,
  ] = useState("0xc3dbf84abb494ce5199d5d4d815b10ec29529ff8");
  const [maxDeposits, setMaxDeposits] = useState("");
  const [minDeposits, setMinDeposits] = useState("");
  const [maxLPs, setMaxLPs] = useState("");
  const [maxTotalDeposits, setMaxTotalDeposits] = useState("");
  const [
    expectedAnnualOperatingFees,
    setExpectedAnnualOperatingFees,
  ] = useState("0");
  const [profitShareToSyndicateLead, setProfitShareToSyndicateLead] = useState(
    "0"
  );
  const [allowlistEnabled, setAllowlistEnabled] = useState(false);
  const [modifiable, setModifiable] = useState(false);
  const [syndicateProfitSharePercent, setProfitShareToSyndProtocol] = useState(
    "0.5"
  );
  const [termsOfServiceError, setTermsOfServiceError] = useState("");
  const [termsOfService, setTermsOfService] = useState(false);
  const [
    otherProfitShareToSyndicateProtocol,
    setOtherProfitShareToSyndicateProtocol,
  ] = useState("");
  const [depositTokenDecimals, setDepositTokenDecimals] = useState<number>(18);

  /** get the number of decimal places for the deposit ERC20 */
  const getTokenDecimals = async (depositERC20ContractAddress) => {
    const ERC20Details = new ERC20TokenDetails(depositERC20ContractAddress);
    const tokenDecimals = await ERC20Details.getTokenDecimals();
    if (tokenDecimals) {
      setDepositTokenDecimals(parseInt(tokenDecimals));
    }
  };

  /**
   * if any error message is set on the input fields, then the input
   * fields are not valid. We therefore set validated = false
   *
   * Also, if we have any empty input field, the form is not yet valid,
   * so we set validated to false
   */
  if (
    fullNameError ||
    emailAddressError ||
    profitShareToSyndProtocolError ||
    primaryERC20ContractAddressError ||
    maxDepositsError ||
    maxTotalDepositsError ||
    maxLPsError ||
    expectedAnnualOperatingFeesError ||
    profitShareToSyndicateLeadError ||
    !profitShareToSyndicateLead ||
    !primaryERC20ContractAddress ||
    !expectedAnnualOperatingFees ||
    !profitShareToSyndicateLead ||
    !syndicateProfitSharePercent ||
    !termsOfService
  ) {
    validated = false;
  } else {
    validated = true;
  }

  // input onchange handlers
  const handleFullName = (event: any) => {
    const { value } = event.target;
    if (!value.trim()) {
      setFullNameError("Full name is required");
    } else {
      setFullNameError("");
    }
    setFullName(value);
  };

  const handleEmailAddress = (event: any) => {
    const { value } = event.target;
    const validEmail = validateEmail(value);
    if (!value.trim()) {
      setEmailAddressError("Email name is required");
    } else if (!validEmail) {
      setEmailAddressError("Email is invalid");
    } else {
      setEmailAddressError("");
    }
    setEmailAddress(value);
  };

  const handlesetPrimaryERC20ContractAddress = (event: any) => {
    event.preventDefault();
    const { value } = event.target;
    setPrimaryERC20ContractAddress(value);

    if (!value.trim()) {
      setPrimaryERC20ContractAddressError("Deposit token is required");
    } else if (!web3.utils.isAddress(value)) {
      setPrimaryERC20ContractAddressError(
        "Deposit token should be a valid ERC20 address"
      );
    } else {
      setPrimaryERC20ContractAddressError("");
      // get number of decimal places for the ERC20.
      getTokenDecimals(value);
    }
  };

  // maxDeposits onChangehandle
  const handleSetMaxDeposits = (event: any) => {
    event.preventDefault();
    const { value } = event.target;

    setMaxDeposits(value);

    const message = Validate(value);

    if (message) {
      setMaxDepositsError(`Maximum deposits ${message}`);
    } else if (+value < +minDeposits) {
      setMaxDepositsError(
        "Max Deposits must not be less than minDeposit per LP"
      );
    } else {
      setMaxDepositsError("");
    }
  };

  // minDeposits onChangehandle
  const handleSetMinDeposits = (event: any) => {
    event.preventDefault();
    const { value } = event.target;

    setMinDeposits(value);

    const message = Validate(value);
    if (message) {
      setMinDepositsError(`Minimum deposit ${message}`);
    } else {
      setMinDepositsError("");
    }
  };

  // maxTotalDeposits onChangehandle
  const maxTotalDepositsHandler = (event: any) => {
    event.preventDefault();
    const { value } = event.target;

    setMaxTotalDeposits(value);

    const message = Validate(value);
    if (message) {
      return setMaxTotalDepositsError(`Maximum total deposits ${message}`);
    } else {
      setMaxTotalDepositsError("");
    }

    if (+value < +maxDeposits) {
      setMaxTotalDepositsError(
        "Max Total deposits must not be less than maxDeposit per LP"
      );
    } else if (+value < +minDeposits) {
      setMaxTotalDepositsError(
        "Max Total deposits must not be less than minDeposit per LP"
      );
    } else {
      setMaxTotalDepositsError("");
    }
  };

  // max LPs onChangehandle
  const maxLPsHandler = (event: any) => {
    event.preventDefault();
    const { value } = event.target;
    setMaxLPsError("");

    setMaxLPs(value);
    const checkIsWholeNumber = isWholeNumber(value);

    if (value < 0) {
      setMaxLPsError("Max Lps must be equal to or greater than 0");
    } else if (!checkIsWholeNumber) {
      setMaxLPsError(`Max LPs must be a whole number`);
    } else {
      setMaxLPsError("");
    }
  };

  const expectedAnnualOperatingFeesHandler = (event: any) => {
    event.preventDefault();

    const { value } = event.target;
    setExpectedAnnualOperatingFees(value);

    const message = Validate(value);
    setExpectedAnnualOperatingFees(value);

    let invalidPercent = "";

    if (!message) {
      invalidPercent = ValidatePercent(value);
    }

    if (message) {
      setExpectedAnnualOperatingFeesError(
        `Expected Annual operating fee ${message}`
      );
    } else if (invalidPercent) {
      setExpectedAnnualOperatingFeesError(invalidPercent);
    } else {
      setExpectedAnnualOperatingFeesError("");
    }
  };

  const profitShareToSyndicateLeadHandler = (event: any) => {
    event.preventDefault();
    const { value } = event.target;

    const message = Validate(value);
    setProfitShareToSyndicateLead(value);

    let invalidPercent = "";

    if (!message) {
      invalidPercent = ValidatePercent(value);
    }

    if (message) {
      setprofitShareToSyndicateLeadError(
        `Profit share to syndicate lead ${message}`
      );
    } else if (invalidPercent) {
      setprofitShareToSyndicateLeadError(invalidPercent);
    } else {
      setprofitShareToSyndicateLeadError("");
    }
  };

  const [copied, setCopied] = useState(false);

  // closeDate should be 2 weeks in the future by default
  const minimumCloseDate = new Date(
    new Date().setHours(new Date().getHours() + 24 * 14)
  );
  const [selectedDate, setSelectedDate] = useState(minimumCloseDate);

  // this controls the toggle button for manually whitelisting depositors
  const toggleAllowlistEnabled = () => setAllowlistEnabled(!allowlistEnabled);
  const toggleModifiable = () => setModifiable(!modifiable);

  const closeModal = () => setShowModal(false);

  // set closeDate
  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  /**
   * This method implements manager steps to create a syndicate
   * NOTE: we need to have the feature for setting deposit and distribution token
   * as capture on the UI
   * @param data form data
   * @returns
   */
  const onSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

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

    // get closeDate and syndicateProtocolProfitSharePercent
    const syndicateProtocolProfitSharePercent = syndicateProfitSharePercent;

    /**
     * close modal after validating the minimum requirement for syndicateProfitShare
     */
    closeModal();

    try {
      /**
       * Convert maxDeposits, totalMaxDeposits and syndicateProfitSharePercent
       * to wei since the contract does not take normal javascript numbers
       */
      const syndicateProfitShareBasisPoints = `${
        parseFloat(syndicateProtocolProfitSharePercent) * 100
      }`;

      /// 2% management fee (200 basis points).
      /// This is displayed in the UI as "Expected Annual Operating Fees"
      /// on the Create Syndicate page.
      // SO to get the correct value from the UI, we take the % passed
      // and multiply by 100 eg 2% would be (2/100)* 10000=> 2 * 100 = 200 basis points

      // use the user provided values, otherwise use defaults for mim and max fields.
      const wMinDeposits = minDeposits
        ? getWeiAmount(minDeposits, depositTokenDecimals, true)
        : getWeiAmount("0", depositTokenDecimals, true);

      const wMaxDeposits = maxDeposits
        ? getWeiAmount(maxDeposits, depositTokenDecimals, true)
        : MAX_INTEGER;

      const wMaxLPs = maxLPs ? maxLPs.toString() : MAX_INTEGER;
      const wMaxTotalDeposits = maxTotalDeposits
        ? getWeiAmount(maxTotalDeposits, depositTokenDecimals, true)
        : MAX_INTEGER;

      const managerManagementFeeBasisPoints = `${
        parseFloat(expectedAnnualOperatingFees) * 100
      }`;

      const managerPerformanceFeeBasisPoints = `${
        parseFloat(profitShareToSyndicateLead) * 100
      }`;

      const closeDate = Math.round(new Date(selectedDate).getTime() / 1000);
      setShowWalletConfirmationModal(true);

      // submit offchain data
      const encode = (data) => {
        return Object.keys(data)
          .map(
            (key) =>
              encodeURIComponent(key) + "=" + encodeURIComponent(data[key])
          )
          .join("&");
      };

      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode({
          "form-name": "offChainData",
          fullName,
          emailAddress,
          syndicateAddress: account,
        }),
      });

      await syndicateContractInstance.methods
        .createSyndicate(
          primaryERC20ContractAddress,
          wMinDeposits,
          wMaxDeposits,
          wMaxTotalDeposits,
          wMaxLPs,
          closeDate,
          syndicateProfitShareBasisPoints,
          managerManagementFeeBasisPoints,
          managerPerformanceFeeBasisPoints,
          allowlistEnabled,
          modifiable
        )
        .send({ from: account })
        .on("transactionHash", () => {
          // close wallet confirmation modal
          setShowWalletConfirmationModal(false);

          setShowModal(false);
          // use has confirmed the transaction so we should start loader state.
          // show loading modal

          dispatch(setSubmitting(true));
        })
        .on("receipt", async () => {
          // we can process the transaction data here together with emitted

          dispatch(addSyndicates(props.web3));
          // createSyndicate event
          dispatch(setSubmitting(false));

          // Show the message to the end user
          setShowErrorMessage(false);

          // show success modal
          setShowSuccessModal(true);
        })
        .on("error", (error) => {
          // capture metamask error
          if (error.code) {
            const { code } = error;
            const errorMessage = getMetamaskError(code, "Create Syndicate");

            setErrorMessage(errorMessage);
          }
        });
      validated = false;
    } catch (error) {
      setShowWalletConfirmationModal(false);

      // close loading modal
      dispatch(setSubmitting(false));
      validated = false;

      let errorMessage = "";

      // check whether this text appears in the error message
      const syndicateExists = error.message.search(
        "ERR_SYNDICATE_ALREADY_EXISTS"
      );
      const profitShareError = error.message.search(
        "Syndicate profit share must be greater than or equal to 50 (0.5%)"
      );
      const closeDateError = error.message.search(
        "ERR_CLOSE_DATE_MUST_BE_AFTER_BLOCK_TIMESTAMP"
      );
      const accountNonceError = error.message.search(
        "the tx doesn't have the correct nonce"
      );
      const managesSyndicate = error.message.search(
        "ERR_MSG_SENDER_ALREADY_MANAGES_ONE_SYNDICATE"
      );

      const NOT_FOUND_CODE = -1;

      if (
        syndicateExists > NOT_FOUND_CODE ||
        managesSyndicate > NOT_FOUND_CODE
      ) {
        errorMessage =
          "Your wallet address already manages the maximum of one Syndicate";
      } else if (profitShareError > NOT_FOUND_CODE) {
        errorMessage =
          "Syndicate profit share must be greater than or equal to 50 (0.5%)";
      } else if (closeDateError > NOT_FOUND_CODE) {
        errorMessage = "Close date must be in future";
      } else if (accountNonceError > NOT_FOUND_CODE) {
        errorMessage =
          "Please reset you account. It appears to have incorrect count of transactions.";
      } else {
        errorMessage =
          "Syndicate not created. Please verify you entered valid inputs.";
      }
      setErrorMessage(errorMessage);

      // Show the message to the end user
      setShowErrorMessage(true);
    }
  };

  /**
   * This method retrieves the value of profitShareToSyndicateProtocol from the
   * input, checks whether value is a valid number character or not and updates
   * the error message approproately. We also check whether the value meets the
   * minimum required value of 0.5, otherwise we show an error about the minimum
   * value
   * @param event
   */
  const profitShareToSyndicateOnchangeHandler = (event) => {
    event.preventDefault();
    const { value } = event.target;

    const message = Validate(value);
    let invalidPercent = "";

    if (!message) {
      invalidPercent = ValidatePercent(value);
    }

    if (message) {
      setProfitShareToSyndProtocolError(
        `Profit share to syndicate protocol ${message}`
      );
    } else if (invalidPercent) {
      setProfitShareToSyndProtocolError(invalidPercent);
    } else if (+value < 0.5) {
      setProfitShareToSyndProtocolError(
        "Profit share to syndicate protocol cannot be less than 0.5%"
      );
    } else {
      setProfitShareToSyndProtocolError("");
    }

    setOtherProfitShareToSyndicateProtocol(value);
    setProfitShareToSyndProtocol(value);
  };

  /**
   * Show copied text for 2 seconds when user clicks the copy icon
   */
  const handleOnCopy = () => {
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  /**
   * The method updates syndicate syndicateProfitSharePercent based on the
   * button badge clicked. The options are 0.5, 1, and 3 which are pre-configured
   * on the buttons.
   * Since these values are within the minimum value required, we set the
   * corresponding error message to an empty string.
   * @param value a decimal string eg 0.5
   */
  const updateProfitShareToSyndProtocol = (value) => {
    setProfitShareToSyndProtocol(value);
    // this resets the input field for other values
    setOtherProfitShareToSyndicateProtocol("");
    setProfitShareToSyndProtocolError("");
  };

  /**
   * Handles agree or disagree with terms of service.
   * When user unchecks our terms of service, we inform them that this is a
   * requirement by displaying the appropriate message.
   * @param event
   */
  const handleTermsOfService = (event: any) => {
    setTermsOfService(event.target.checked);
    if (!event.target.checked) {
      setTermsOfServiceError(AgreeToOurTermsOfServiceText);
    } else {
      setTermsOfServiceError("");
    }
  };

  // custom width for syndicate protocol input
  let otherProfitShareWidth;
  if (otherProfitShareToSyndicateProtocol.toString().length == 0) {
    otherProfitShareWidth = 6;
  } else if (otherProfitShareToSyndicateProtocol.toString().length > 1) {
    const textLength =
      otherProfitShareToSyndicateProtocol.toString().length + 1;
    if (!(textLength > 6)) {
      otherProfitShareWidth = textLength;
    }
  } else {
    otherProfitShareWidth = 2;
  }

  return (
    <div className="w-full">
      {/* Modal to create a new syndicate */}
      <Modal
        {...{
          show: showModal,
          closeModal,
          customWidth: "w-full lg:w-3/5",
        }}
        title="Create New Syndicate"
      >
        <form
          name="offChainData"
          method="post"
          data-netlify="true"
          onSubmit={onSubmit}
        >
          <input type="hidden" name="form-name" value="offChainData" />
          {/* modal sub title */}
          <div
            className="flex justify-start mb-1 text-blue font-medium 
          text-center leading-8 text-lg"
          >
            <p className="text-blue-light ml-4">Offchain Data</p>
          </div>

          <div className="border border-gray-85 bg-gray-99 rounded-xl p-4">
            <div className="space-y-4">
              {/* full name address */}
              <TextInput
                {...{
                  label: "Full Name:",
                  error: fullNameError,
                  tooltip: fullNameToolTip,
                }}
                value={fullName}
                onChange={handleFullName}
                name="fullName"
                placeholder="Please provide your full name"
              />
              {/* email address */}
              <TextInput
                {...{
                  label: "Email Address:",
                  error: emailAddressError,
                  tooltip: emailAddressToolTip,
                }}
                value={emailAddress}
                onChange={handleEmailAddress}
                name="emailAddress"
                placeholder="Please provide your email address"
              />
            </div>
          </div>

          {/* modal sub title */}
          <div
            className="flex justify-start mb-1 text-blue font-medium 
          text-center leading-8 text-lg"
          >
            <p className="text-blue-light ml-4">Onchain Data</p>
          </div>

          <div className="border border-gray-85 bg-gray-99 rounded-xl p-4">
            <div className="space-y-4">
              {/* syndicate address */}
              <TextInput
                {...{
                  label: "Syndicate Address:",
                  tooltip: syndicateAddressToolTip,
                }}
                value={account}
                name="syndicateAddress"
                disabled
              />

              {/* deposit token */}
              <TextInput
                {...{
                  label: "Deposit Token:",
                  error: primaryERC20ContractAddressError,
                  tooltip: depositTokenToolTip,
                }}
                value={primaryERC20ContractAddress}
                onChange={handlesetPrimaryERC20ContractAddress}
                name="depositToken"
                placeholder="Please provide an ERC20 token address"
              />

              {/* min deposits */}
              <TextInput
                {...{
                  label: "Minimum Deposits (Per Depositor):",
                  error: minDepositsError,
                  tooltip: minimumDepositToolTip,
                  type: "number",
                }}
                onChange={handleSetMinDeposits}
                name="minDeposits"
                value={minDeposits}
                placeholder="0"
              />

              {/* max deposits */}
              <TextInput
                {...{
                  label: "Maximum Deposits (Per Depositor):",
                  error: maxDepositsError,
                  tooltip: maximumDepositToolTip,
                  type: "number",
                }}
                onChange={handleSetMaxDeposits}
                name="maxDeposits"
                value={maxDeposits}
                placeholder="Unlimited"
              />

              {/* Max Total deposits */}
              <TextInput
                {...{
                  label: "Maximum Deposits (Total):",
                  error: maxTotalDepositsError,
                  tooltip: totalMaximumDepositToolTip,
                  type: "number",
                }}
                onChange={maxTotalDepositsHandler}
                name="maxTotalDeposits"
                value={maxTotalDeposits}
                placeholder="Unlimited"
              />

              {/* Max LPs deposits */}
              <TextInput
                {...{
                  label: "Maximum LPs (Total Depositors):",
                  error: maxLPsError,
                  tooltip: maxLpsToolTip,
                  type: "number",
                }}
                onChange={maxLPsHandler}
                name="maxLPs"
                value={maxLPs}
                placeholder="Unlimited"
              />
              {/* close date */}
              <div className="flex justify-center">
                <div className="flex mr-2 w-1/2 justify-end">
                  <label
                    htmlFor="closeDate"
                    className="block pt-2 text-black text-sm font-medium"
                  >
                    Close Date:
                  </label>
                </div>
                <div className="w-full flex-grow flex flex-col justify-between">
                  {/* input field */}
                  <div className="flex justify-start">
                    <DatePicker
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      className={`flex flex-grow focus:ring-indigo-500 focus:border-indigo-500 rounded-md text-black border-gray-85 w-full`}
                      minDate={minimumCloseDate}
                      selectsStart
                      name="closeDate"
                      dropdownMode="select"
                    />
                    {/* icon */}

                    <div className="w-auto mt-1 flex">
                      <InfoIcon tooltip={closeDateToolTip} />
                    </div>
                  </div>
                  <p className="text-red-500 text-xs mt-1 mb-2"></p>
                </div>
              </div>

              {/* Expected Annual Operating Fees */}
              <PercentInput
                {...{
                  label: "Expected Annual Operating Fees:",
                  error: expectedAnnualOperatingFeesError,
                  tooltip: expectedAnnualOperatingFeesToolTip,
                }}
                onChange={expectedAnnualOperatingFeesHandler}
                name="expectedAnnualOperatingFees"
                value={expectedAnnualOperatingFees}
                placeholder=""
                required
              />

              <PercentInput
                {...{
                  label: "Profit Share to Syndicate Lead:",
                  error: profitShareToSyndicateLeadError,
                  tooltip: profitShareToSyndicateLeadToolTip,
                }}
                onChange={profitShareToSyndicateLeadHandler}
                name="profitShareToSyndicateLead"
                placeholder=""
                value={profitShareToSyndicateLead}
                required
              />

              {/* Profit Share to Syndicate Protocol: */}
              <div className="h-10 flex flex-row justify-center">
                <div className="mr-2 w-1/2 flex justify-end">
                  <label
                    htmlFor="profitShareToSyndProtocol"
                    className="block pt-2 text-black text-base font-medium"
                  >
                    Profit Share to Syndicate Protocol:
                  </label>
                </div>

                {/* shows 4 equal grids used to get the input for profit share */}
                <div className="w-3/5 flex justify-between">
                  <div
                    className={`grid grid-cols-4 w-4/5 border h-12 gray-85 flex-grow rounded-md`}
                  >
                    <button
                      className={`flex justify-center pt-3 border-r focus:outline-none ${
                        syndicateProfitSharePercent == "0.5"
                          ? "bg-blue-100 text-black"
                          : "gray-85"
                      }`}
                      onClick={() => updateProfitShareToSyndProtocol(0.5)}
                      type="button"
                    >
                      0.5%
                    </button>

                    <button
                      className={`flex justify-center pt-3 border-r focus:outline-none ${
                        syndicateProfitSharePercent == "1"
                          ? "bg-blue-100 text-black"
                          : "gray-85"
                      }`}
                      onClick={() => {
                        updateProfitShareToSyndProtocol(1);
                      }}
                      type="button"
                    >
                      1%
                    </button>

                    <button
                      className={`flex justify-center pt-3 border-r focus:outline-none ${
                        syndicateProfitSharePercent == "3"
                          ? "bg-blue-100 text-black"
                          : "gray-85"
                      }`}
                      type="button"
                      onClick={() => {
                        updateProfitShareToSyndProtocol(3);
                      }}
                    >
                      3%
                    </button>

                    <div className="flex p-0 percentage-input rounded-br-md rounded-tr-md ">
                      <input
                        type="number"
                        className={`flex pl-1 pr-1 py-1 ml-1 focus:outline-none outline-none focus:ring-0 focus:border-none border-0`}
                        placeholder="other"
                        name="profitShareToSyndProtocol"
                        onChange={profitShareToSyndicateOnchangeHandler}
                        value={otherProfitShareToSyndicateProtocol}
                        style={{
                          width: `${otherProfitShareWidth}ch`,
                        }}
                      />
                      <span className="flex flex-1 py-2 pt-3 text-gray-500">
                        %
                      </span>
                    </div>
                  </div>

                  {/* icon */}
                  <div className="mt-1 flex content-center">
                    <InfoIcon tooltip={profitShareToSyndicateProtocolToolTip} />
                  </div>
                </div>
              </div>
              <div className="flex flex-row justify-center">
                <p className="mr-2 w-1/2 flex"></p>
                {profitShareToSyndProtocolError ? (
                  <p className="mr-2 w-1/2 text-red-500 text-sm -mt-1">
                    {profitShareToSyndProtocolError}
                  </p>
                ) : null}
              </div>

              <Toggle
                {...{
                  enabled: allowlistEnabled,
                  toggleEnabled: toggleAllowlistEnabled,
                  label: "Manually Whitelist Depositors:",
                  tooltip: allowListEnabledToolTip,
                }}
              />

              {/* modifiable */}
              <Toggle
                {...{
                  enabled: modifiable,
                  toggleEnabled: toggleModifiable,
                  label: "Modifiable:",
                  tooltip: modifiableToolTip,
                }}
              />
            </div>
          </div>

          {/* agree to terms */}
          <div className="flex my-4 w-full flex-col align-center justify-center py-4">
            <p className="flex text-black justify-center">
              I agree to the
              <span className="mx-2 text-blue-light"> terms of service</span>
              (required):
              <CheckBox
                {...{
                  error: termsOfServiceError,
                }}
                onChange={handleTermsOfService}
                name="termsOfService"
                value={termsOfService}
                required
              />
            </p>

            {termsOfServiceError ? (
              <p className="flex mt-2 text-red-500 text-sm justify-center">
                {termsOfServiceError}
              </p>
            ) : null}
          </div>

          {/* submit button */}
          <div className="flex my-4 w-full justify-center py-2">
            <Button
              type="submit"
              customClasses={`rounded-full bg-blue-light w-auto px-10 py-2 text-lg ${
                validated ? "" : "opacity-50"
              }`}
              disabled={validated ? false : true}
            >
              Launch
            </Button>
          </div>
        </form>
      </Modal>

      {/* Tell user to confirm transaction on their wallet */}
      <ConfirmStateModal show={showWalletConfirmationModal}>
        <div className="flex flex-col justify-center m-auto mb-4">
          <p className="text-sm text-center mx-8 opacity-60">
            {confirmCreateSyndicateSubText}
          </p>
        </div>
      </ConfirmStateModal>
      {/* Loading modal */}
      <PendingStateModal
        {...{
          show: submitting,
        }}
      >
        <div className="modal-header mb-4 font-medium text-center leading-8 text-lg">
          {pendingState}
        </div>
        <div className="flex flex-col justify-center m-auto mb-4">
          <p className="text-sm text-center mx-8 opacity-60">{loaderSubtext}</p>
        </div>
        <div className="flex justify-center">
          <EtherscanLink contractAddress={account} />
        </div>
      </PendingStateModal>

      {/* Error message modal */}
      <ErrorModal
        {...{
          show: showErrorMessage,
          setShowErrorMessage,
          setErrorMessage,
          errorMessage,
        }}
      ></ErrorModal>

      {/* show success modal */}
      <Modal
        {...{
          show: showSuccessModal,
          closeModal: () => setShowSuccessModal(false),
          type: "success",
          customWidth: "w-5/12",
        }}
      >
        <div className="flex flex-col justify-center m-auto mb-4">
          <div className="flex align-center justify-center my-2 mb-6">
            <img src="/images/checkCircle.svg" className="w-16" />
          </div>
          <div className="modal-header mb-4 text-black font-medium text-center ">
            <p className="text-2xl font-whyte ">
              Syndicate Successfully Launched
            </p>
            <p className="font-whyte leading-8 text-sm text-gray-500 mt-4">
              Your syndicate's permanent address is:
            </p>

            <span className="font-whyte leading-8 p-1 my-2 rounded-sm text-sm text-gray-500 bg-gray-93 mb-4">
              {account}
            </span>
            <p className="font-whyte leading-8 text-sm text-gray-500 mt-4">
              Your syndicate deposit link:
            </p>
            <div className="flex justify-between mx-2">
              <div className="flex flex-grow flex-col w-3/5">
                <input
                  disabled
                  className="font-whyte text-sm sm:text-base word-break p-2 overflow-hidden overflow-x-scroll border border-blue-light rounded-full"
                  value={`${window.location.origin}/syndicates/${account}/deposit`}
                ></input>
              </div>
              <div className="flex align-center justify-center mx-auto my-2">
                {copied ? (
                  <span className="text-sm text-gray-nightrider font-whyte ml-2 opacity-80">
                    Link copied
                  </span>
                ) : (
                  <>
                    <CopyToClipboard
                      text={`${window.location.origin}/syndicates/${account}/deposit`}
                      onCopy={handleOnCopy}
                    >
                      <p className="flex font-whyte text-sm cursor-pointer hover:opacity-80 text-gray-nightrider">
                        <img
                          src="/images/copy.svg"
                          className="w-4 ml-2 mr-1 font-whyte cursor-pointer border-blue text-blue-light"
                        />
                        Copy link
                      </p>
                    </CopyToClipboard>
                  </>
                )}
              </div>
            </div>

            <div className="my-5">
              <Link href={`/syndicates/${account}/deposit`}>
                <a className="font-whyte text-center py-3 text-sm font-medium  text-blue-light hover bg-light-green">
                  Go to Syndicate Deposit Page
                </a>
              </Link>
            </div>
            <div>
              {/* font-whytes font-light text-gray-dim */}
              <p className="font-thin text-gray-dim text-sm opacity-70">
                <span className="font-thin text-gray-dim">IMPORTANT: </span>
                Do not publicly market deposit link. Only share directly with
                people and organizations you have qualified.
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CreateSyndicate;
