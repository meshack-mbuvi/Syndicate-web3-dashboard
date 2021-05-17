import { ErrorModal } from "@/components/shared";
import { PendingStateModal } from "@/components/shared/transactionStates";
import ConfirmStateModal from "@/components/shared/transactionStates/confirm";
import { getMetamaskError } from "@/helpers";
import { processCreatedSyndicateEvent } from "@/helpers/processEvent";
import { addNewSyndicate } from "@/redux/actions/syndicates";
import { Validate, ValidatePercent } from "@/utils/validators";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
// fontawesome icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React, { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import DatePicker from "react-datepicker";
import { connect } from "react-redux";
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
  const {
    web3: { syndicateInstance, account, web3 },
    dispatch,
    showModal,
    setShowModal,
    submitting,
    syndicateContractInstance,
  } = props;

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [
    showWalletConfirmationModal,
    setShowWalletConfirmationModal,
  ] = useState(false);

  // input field error messages
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

    setMaxLPs(value);

    const message = Validate(value);
    if (message) {
      setMaxLPsError(`Max LPs ${message}`);
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
    if (!syndicateInstance) {
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
        .on("receipt", async (receipt) => {
          // we can process the transaction data here together with emitted

          // retrieve details of the newly created syndicate
          const syndicate = processCreatedSyndicateEvent(
            receipt.events.createdSyndicate
          );
          // add the newly created syndicate to application state
          dispatch(
            addNewSyndicate({
              ...syndicate,
              depositors: 0,
              openToDeposits: true,
              totalDeposits: 0,
              active: true,
            })
          );
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
          customWidth: "w-full lg:w-2/3",
        }}
        title="Create New Syndicate">
        <>
          {/* modal sub title */}
          <div
            className="flex justify-start mb-1 text-blue font-medium 
          text-center leading-8 text-lg">
            <p className="text-blue-light ml-4">Onchain Data</p>
          </div>

          <form onSubmit={onSubmit}>
            <div className="border border-gray-85 bg-gray-99 rounded-xl p-4">
              <div className="space-y-4">
                {/* syndicate address */}
                <TextInput
                  {...{
                    label: "Syndicate Address:",
                    toolTip: syndicateAddressToolTip,
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
                    toolTip: depositTokenToolTip,
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
                    toolTip: minimumDepositToolTip,
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
                    toolTip: maximumDepositToolTip,
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
                    toolTip: totalMaximumDepositToolTip,
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
                    toolTip: maxLpsToolTip,
                    type: "number",
                  }}
                  onChange={maxLPsHandler}
                  name="maxLPs"
                  value={maxLPs}
                  placeholder="Unlimited"
                />

                {/* close date */}
                <div className="flex flex-row justify-end">
                  <div className="mr-2 w-1/2 flex justify-end">
                    <label
                      htmlFor="syndicateAddress"
                      className="block pt-2 text-black text-sm font-medium">
                      Close Date:
                    </label>
                  </div>

                  <div className="w-3/5 flex justify-between">
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
                    <div className="w-6 ml-4 mt-1">
                      <InfoIcon toolTip={closeDateToolTip} />
                    </div>
                  </div>
                </div>

                {/* Expected Annual Operating Fees */}
                <PercentInput
                  {...{
                    label: "Expected Annual Operating Fees:",
                    error: expectedAnnualOperatingFeesError,
                    toolTip: expectedAnnualOperatingFeesToolTip,
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
                    toolTip: profitShareToSyndicateLeadToolTip,
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
                      className="block pt-2 text-black text-base font-medium">
                      Profit Share to Syndicate Protocol:
                    </label>
                  </div>

                  {/* shows 4 equal grids used to get the input for profit share */}
                  <div className="w-3/5 flex justify-between">
                    <div
                      className={`grid grid-cols-4 w-4/5 border h-12 gray-85 flex flex-grow rounded-md`}>
                      <button
                        className={`flex justify-center pt-3 border-r focus:outline-none ${
                          syndicateProfitSharePercent == "0.5"
                            ? "bg-blue-100 text-black"
                            : "gray-85"
                        }`}
                        onClick={() => updateProfitShareToSyndProtocol(0.5)}
                        type="button">
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
                        type="button">
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
                        }}>
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
                    <div className="w-6 ml-4 mt-1">
                      <InfoIcon
                        toolTip={profitShareToSyndicateProtocolToolTip}
                      />
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
                    toolTip: allowListEnabledToolTip,
                  }}
                />

                {/* modifiable */}
                <Toggle
                  {...{
                    enabled: modifiable,
                    toggleEnabled: toggleModifiable,
                    label: "Modifiable:",
                    toolTip: modifiableToolTip,
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
                disabled={validated ? false : true}>
                Launch
              </Button>
            </div>
          </form>
        </>
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
        }}>
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
        }}></ErrorModal>

      {/* show success modal */}
      <Modal
        {...{
          show: showSuccessModal,
          closeModal: () => setShowSuccessModal(false),
          type: "success",
          customWidth: "w-3/5",
        }}>
        <div className="flex flex-col justify-center m-auto mb-4">
          <div className="flex align-center justify-center">
            <div className="border-4 border-light-blue m-8 rounded-full h-24 w-24 flex items-center justify-center">
              <svg
                width="34"
                height="26"
                viewBox="0 0 34 26"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M2 13.5723L11.2243 22.7966L32 2"
                  stroke="#35CFFF"
                  strokeWidth="4"
                />
              </svg>
            </div>
          </div>
          <div className="modal-header mb-4 text-black font-medium text-center ">
            <p className="text-3xl">Syndicate Successfully Launched</p>
            <p className="leading-8 text-sm text-gray-500 m-4">{account}</p>
            <div className="flex justify-between">
              <div className="flex flex-grow flex-col rounded-full p-3 bg-blue-light text-white">
                <p className="text-xs sm:text-lg">
                  Your shareable deposit link:
                </p>
                <p className="text-sm sm:text-sm word-break">{`${window.location.origin}/syndicates/${account}/deposit`}</p>
              </div>
              <div className="flex align-center justify-center mx-auto my-4 ml-2">
                {copied ? (
                  <span className="text-green-400">Copied</span>
                ) : (
                  <CopyToClipboard
                    text={`${window.location.origin}/syndicates/${account}/deposit`}
                    onCopy={handleOnCopy}>
                    <FontAwesomeIcon
                      icon={faCopy}
                      size="2x"
                      className="w-8 cursor-pointer border-blue text-blue-light"
                    />
                  </CopyToClipboard>
                )}
              </div>
            </div>

            <div className="text-light-blue">
              <Link href={`/syndicates/${account}/deposit`}>
                <a className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium  text-blue-light hover md:py-4 md:text-lg md:px-10 bg-light-green">
                  {" "}
                  Go to Syndicate Deposit Page
                </a>
              </Link>
            </div>
            <div>
              <p className="font-light">
                <span className="font-medium">IMPORTANT: </span>Do not publicly
                market deposit link. Only share directly with people and
                organizations you have qualified.
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const mapStateToProps = ({
  web3Reducer,
  loadingReducer,
  syndicateInstanceReducer: { syndicateContractInstance },
}) => {
  const { web3 } = web3Reducer;
  const { submitting } = loadingReducer;
  return { web3, submitting, syndicateContractInstance };
};

export default connect(mapStateToProps)(CreateSyndicate);
