import { amplitudeLogger, Flow } from "@/components/amplitude";
import {
  CLICK_COPY_LINK_TO_SHARE,
  CLOSE_CREATE_SYNDICATE_FORM,
  CREATE_SYNDICATE,
  ERROR_CREATING_SYNDICATE,
} from "@/components/amplitude/eventNames";
import { ErrorModal } from "@/components/shared";
import { PendingStateModal } from "@/components/shared/transactionStates";
import ConfirmStateModal from "@/components/shared/transactionStates/confirm";
import { getMetamaskError } from "@/helpers";
import { getSyndicates } from "@/redux/actions/syndicates";
import { RootState } from "@/redux/store";
import { getUnixTimeFromDate } from "@/utils/dateUtils";
import {
  isWholeNumber,
  Validate,
  validateEmail,
  ValidatePercent,
} from "@/utils/validators";
import { getCoinFromContractAddress } from "functions/src/utils/ethereum";
import Link from "next/link";
import React, { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import DatePicker from "react-datepicker";
import { useDispatch, useSelector } from "react-redux";
// Other useful components
import Button from "src/components/buttons";
import { InfoIcon } from "src/components/iconWrappers";
import { PercentInput, TextInput, Toggle } from "src/components/inputs";
import { Modal } from "src/components/modal";
// redux actions
import { setSubmitting, showWalletModal } from "src/redux/actions";
import { getWeiAmount } from "src/utils/conversions";
import { ERC20TokenDetails } from "src/utils/ERC20Methods";
import {
  allowListEnabledToolTip,
  closeDateToolTip,
  confirmCreateSyndicateSubText,
  depositTokenToolTip,
  emailAddressToolTip,
  expectedAnnualOperatingFeesToolTip,
  fullNameToolTip,
  loaderSubtext,
  maximumDepositToolTip,
  maxMembersToolTip,
  MAX_INTEGER,
  minimumDepositToolTip,
  modifiableToolTip,
  pendingState,
  profitShareToSyndicateLeadToolTip,
  profitShareToSyndicateProtocolToolTip,
  syndicateAddressToolTip,
  totalMaximumDepositToolTip,
  transferableToolTip,
} from "../shared/Constants";
import { EtherscanLink } from "../shared/EtherscanLink";

const TERMS_OF_SERVICE_LINK = process.env.NEXT_PUBLIC_TERMS_OF_SERVICE_LINK;

/**
 * Diplays all syndicates.
 * The main groups for syndicates are active and inactive
 *
 * At the top-right of the page, there is a create button which opens a modal
 * with a form to create a new syndicate
 */
const CreateSyndicate = (props) => {
  const { showModal, setShowModal } = props;
  const {
    initializeContractsReducer: {
      syndicateContracts: { ManagerLogicContract },
    },
    initializeContractsReducer: { syndicateContracts },
    web3Reducer: { web3: web3Instance },
  } = useSelector((state: RootState) => state);

  const { web3, account } = web3Instance;

  const { submitting } = useSelector(
    (state: RootState) => state.loadingReducer,
  );

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [
    showWalletConfirmationModal,
    setShowWalletConfirmationModal,
  ] = useState(false);
  const dispatch = useDispatch();

  // input field error messages
  const [fullNameError, setFullNameError] = useState("");
  const [emailAddressError, setEmailAddressError] = useState("");
  const [
    profitShareToSyndProtocolError,
    setProfitShareToSyndProtocolError,
  ] = useState("");
  const [depositERC20AddressError, setDepositERC20AddressError] = useState("");
  const [maxDepositsError, setMaxDepositsError] = useState("");
  const [minDepositsError, setMinDepositsError] = useState("");
  const [maxTotalDepositsError, setMaxTotalDepositsError] = useState("");
  const [maxMembersError, setMaxMembersError] = useState("");
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

  const [depositERC20Address, setDepositERC20Address] = useState("");
  const [depositERC20AddressLogo, setDepositERC20AddressLogo] = useState("");
  const [maxDeposits, setMaxDeposits] = useState("");
  const [minDeposits, setMinDeposits] = useState("");
  const [maxMembers, setMaxMembers] = useState("");
  const [maxTotalDeposits, setMaxTotalDeposits] = useState("");
  const [
    expectedAnnualOperatingFees,
    setExpectedAnnualOperatingFees,
  ] = useState<string>("0");
  const [
    profitShareToSyndicateLead,
    setProfitShareToSyndicateLead,
  ] = useState<string>("0");
  const [allowlistEnabled, setAllowlistEnabled] = useState(false);
  const [modifiable, setModifiable] = useState(false);
  const [transferable, setTransferable] = useState(false);
  const [syndicateProfitSharePercent, setProfitShareToSyndProtocol] = useState(
    "0.5",
  );
  const [
    otherProfitShareToSyndicateProtocol,
    setOtherProfitShareToSyndicateProtocol,
  ] = useState("");
  const [depositTokenDecimals, setDepositTokenDecimals] = useState<number>(18);

  /** get the number of decimal places for the deposit ERC20 */
  const getTokenDecimals = async (depositERC20Address) => {
    const ERC20Details = new ERC20TokenDetails(depositERC20Address);
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
    depositERC20AddressError ||
    maxDepositsError ||
    maxTotalDepositsError ||
    maxMembersError ||
    expectedAnnualOperatingFeesError ||
    profitShareToSyndicateLeadError ||
    !profitShareToSyndicateLead ||
    !depositERC20Address ||
    !expectedAnnualOperatingFees ||
    !syndicateProfitSharePercent
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

  const handlesetDepositERC20Address = async (event: any) => {
    event.preventDefault();
    const { value } = event.target;
    setDepositERC20Address(value);

    if (!value.trim()) {
      setDepositERC20AddressError("Deposit token is required");
    } else if (!web3.utils.isAddress(value)) {
      setDepositERC20AddressError(
        "Deposit token should be a valid ERC20 address",
      );
    } else {
      setDepositERC20AddressError("");
      // get number of decimal places for the ERC20.
      getTokenDecimals(value);

      // we should get logo for a valid value
      // get logo from coingeko api
      const { logo } = await getCoinFromContractAddress(value);

      setDepositERC20AddressLogo(logo);
    }
  };

  // maxDeposits onChangehandle
  const handleSetMaxDeposits = (event: any) => {
    event.preventDefault();
    const { value } = event.target;
    setMaxDepositsError("");

    // value should be set to unlimited once everything is deleted.
    if (!value.trim()) {
      setMaxDeposits("");
      return;
    }
    setMaxDeposits(value);

    const message = Validate(value);

    if (message) {
      setMaxDepositsError(`Maximum deposits ${message}`);
    } else if (+value < +minDeposits) {
      setMaxDepositsError(
        "Max Deposits must not be less than minDeposit per Member",
      );
    } else {
      setMaxDepositsError("");
    }
  };

  // minDeposits onChangehandle
  const handleSetMinDeposits = (event: any) => {
    event.preventDefault();
    const { value } = event.target;
    setMinDepositsError("");

    // value should be set to unlimited once everything is deleted.
    if (!value.trim()) {
      setMinDeposits("");
      return;
    }
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
    setMaxTotalDepositsError("");
    // value should be set to unlimited once everything is deleted.
    if (!value.trim()) {
      setMaxTotalDeposits("");
      return;
    }
    setMaxTotalDeposits(value);

    const message = Validate(value);
    if (message) {
      return setMaxTotalDepositsError(`Maximum total deposits ${message}`);
    } else {
      setMaxTotalDepositsError("");
    }

    if (+value < +maxDeposits) {
      setMaxTotalDepositsError(
        "Max Total deposits must not be less than maxDeposit per Member",
      );
    } else if (+value < +minDeposits) {
      setMaxTotalDepositsError(
        "Max Total deposits must not be less than minDeposit per Member",
      );
    } else {
      setMaxTotalDepositsError("");
    }
  };

  // max Members onChangehandle
  const maxMembersHandler = (event: any) => {
    event.preventDefault();
    const { value } = event.target;
    setMaxMembersError("");
    // value should be set to unlimited once everything is deleted.
    if (!value.trim()) {
      setMaxMembers("");
      return;
    }

    setMaxMembers(value);
    const checkIsWholeNumber = isWholeNumber(value);

    if (value < 0) {
      setMaxMembersError("Total members cannot be less than 0");
    } else if (isNaN(value)) {
      setMaxMembersError("Total members should be a valid number.");
    } else if (!checkIsWholeNumber) {
      setMaxMembersError(`Total members must be a whole number`);
    } else {
      setMaxMembersError("");
    }
  };

  const expectedAnnualOperatingFeesHandler = (event: any) => {
    event.preventDefault();

    const { value } = event.target;
    setExpectedAnnualOperatingFees(value);

    const message = Validate(value);

    let invalidPercent = "";

    if (!message) {
      invalidPercent = ValidatePercent(value);
    }

    if (message) {
      setExpectedAnnualOperatingFeesError(
        `Expected Annual operating fee ${message}`,
      );
    } else if (invalidPercent) {
      setExpectedAnnualOperatingFeesError(invalidPercent);
    } else {
      setExpectedAnnualOperatingFeesError("");
    }

    if (!(parseInt(expectedAnnualOperatingFees, 10) > 100)) {
      setExpectedAnnualOperatingFees(value);
    } else {
      setExpectedAnnualOperatingFees("100");
      setExpectedAnnualOperatingFeesError("");
    }
  };

  const profitShareToSyndicateLeadHandler = (event: any) => {
    event.preventDefault();
    const { value } = event.target;

    const message = Validate(value);

    let invalidPercent = "";

    if (!message) {
      invalidPercent = ValidatePercent(value);
    }

    if (message) {
      setprofitShareToSyndicateLeadError(
        `Profit share to syndicate lead ${message}`,
      );
    } else if (invalidPercent) {
      setprofitShareToSyndicateLeadError(invalidPercent);
    } else {
      setprofitShareToSyndicateLeadError("");
    }

    if (!(parseInt(profitShareToSyndicateLead, 10) > 100)) {
      setProfitShareToSyndicateLead(value);
    } else {
      setProfitShareToSyndicateLead("100");
      setprofitShareToSyndicateLeadError("");
    }
  };

  const [copied, setCopied] = useState(false);

  // closeDate should be 2 weeks in the future by default
  const minimumCloseDate = new Date(
    new Date().setHours(new Date().getHours() + 24 * 14),
  );
  const [selectedDate, setSelectedDate] = useState(minimumCloseDate);

  // this controls the toggle button for manually whitelisting depositors
  const toggleAllowlistEnabled = () => setAllowlistEnabled(!allowlistEnabled);
  const toggleModifiable = () => setModifiable(!modifiable);
  const toggleTransferable = () => setTransferable(!transferable);

  const [formLLC, setFormLLC] = useState(false);

  const closeModal = () => {
    setShowModal(false);

    // Amplitude logger: How many users who fill out the form to create a syndicate do not submit the form
    amplitudeLogger(CLOSE_CREATE_SYNDICATE_FORM, {
      flow: Flow.MGR_CREATE_SYN,
    });
  };

  // set closeDate
  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  /**
   * This method implements manager steps to create a syndicate
   * @param data form data
   * @returns
   */
  const onSubmit = async (event) => {
    event.preventDefault();

    /**
     * If we are not connected and the form modal is open, user can trigger
     * creation of Syndicate. We therefore catch this here and request for
     * wallet connection.
     * Note: We need to find a way, like a customized alert to inform user this.
     */
    if (!syndicateContracts) {
      // Request wallet connect
      return dispatch(showWalletModal());
    }

    // get closeDate and syndicateProtocolProfitSharePercent
    const syndicateProtocolProfitSharePercent = syndicateProfitSharePercent;

    /**
     * close modal after validating the minimum requirement for syndicateProfitShare
     */
    closeModal();

    /**
     * Convert maxDeposits, totalMaxDeposits and syndicateProfitSharePercent
     * to wei since the contract does not take normal javascript numbers
     */
    const syndicateDistributionShareBasisPoints = `${
      parseFloat(syndicateProtocolProfitSharePercent) * 100
    }`;

    /// 2% management fee (200 basis points).
    /// This is displayed in the UI as "Expected Annual Operating Fees"
    /// on the Create Syndicate page.
    // SO to get the correct value from the UI, we take the % passed
    // and multiply by 100 eg 2% would be (2/100)* 10000=> 2 * 100 = 200 basis points

    // use the user provided values, otherwise use defaults for min and max fields.
    const depositMemberMin = minDeposits
      ? getWeiAmount(minDeposits, depositTokenDecimals, true)
      : getWeiAmount("0", depositTokenDecimals, true);

    const depositMemberMax = maxDeposits
      ? getWeiAmount(maxDeposits, depositTokenDecimals, true)
      : MAX_INTEGER;

    const numMembersMax = maxMembers ? maxMembers.toString() : MAX_INTEGER;
    const depositTotalMax = maxTotalDeposits
      ? getWeiAmount(maxTotalDeposits, depositTokenDecimals, true)
      : MAX_INTEGER;

    const managerManagementFeeBasisPoints = `${
      parseFloat(expectedAnnualOperatingFees) * 100
    }`;

    const managerDistributionShareBasisPoints = `${
      parseFloat(profitShareToSyndicateLead) * 100
    }`;

    const dateCloseUnixTime = getUnixTimeFromDate(selectedDate);

    // submit offchain data
    const encode = (data) => {
      return Object.keys(data)
        .map(
          (key) =>
            encodeURIComponent(key) + "=" + encodeURIComponent(data[key]),
        )
        .join("&");
    };

    // off-chain data should be submitted if its provided.
    if (fullName || emailAddress) {
      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode({
          "form-name": "offChainData",
          fullName,
          emailAddress,
          syndicateAddress: account,
          attachLLCManually: formLLC,
        }),
      });
    }

    // The name of CreateSyndicate function and order of function parameters
    // has changed in the recent version so we need to find the correct function
    // to call based on the contract version
    try {
      const syndicateData = {
        managerManagementFeeBasisPoints,
        managerDistributionShareBasisPoints,
        syndicateDistributionShareBasisPoints,
        numMembersMax,
        depositERC20Address,
        depositMemberMin,
        depositMemberMax,
        depositTotalMax,
        dateCloseUnixTime,
        allowlistEnabled,
        modifiable,
        transferable,
      };

      await ManagerLogicContract.createSyndicate(
        syndicateData,
        account,
        setShowWalletConfirmationModal,
        (value) => dispatch(setSubmitting(value)),
      );

      dispatch(getSyndicates({ ...web3Instance, ...syndicateContracts }));

      validated = false;
      dispatch(setSubmitting(false));
      setShowErrorMessage(false);

      // show success modal
      setShowSuccessModal(true);

      // Amplitude logger: How many users started filling out the form to create a Syndicate
      amplitudeLogger(CREATE_SYNDICATE, {
        flow: Flow.MGR_CREATE_SYN,
        data: {
          syndicateData,
          account,
          fullName,
          emailAddress,
        },
      });
    } catch (error) {
      setShowWalletConfirmationModal(false);

      if (error.code) {
        const { code } = error;
        const errorMessage = getMetamaskError(code, "Create Syndicate");

        setErrorMessage(errorMessage);

        // Amplitude logger: Error creating a Syndicate
        amplitudeLogger(ERROR_CREATING_SYNDICATE, {
          flow: Flow.MGR_CREATE_SYN,
          error,
        });
      }
      // close loading modal
      dispatch(setSubmitting(false));
      validated = false;
    }
  };

  const [iconLeftMargin, setIconLeftMargin] = useState(2);

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
    if (value.toString().length > 1 && value.toString().length <= 6) {
      setIconLeftMargin(value.toString().length + 0.8);
    } else if (value.toString().length <= 1) {
      setIconLeftMargin(2);
    } else {
      setIconLeftMargin(6.8);
    }

    const message = Validate(value);
    let invalidPercent = "";

    if (!message) {
      invalidPercent = ValidatePercent(value);
    }

    if (message) {
      setProfitShareToSyndProtocolError(
        `Profit share to syndicate protocol ${message}`,
      );
    } else if (invalidPercent) {
      setProfitShareToSyndProtocolError(invalidPercent);
    } else if (+value < 0.5) {
      setProfitShareToSyndProtocolError(
        "Profit share to syndicate protocol cannot be less than 0.5%",
      );
    } else {
      setProfitShareToSyndProtocolError("");
    }

    if (!(parseInt(otherProfitShareToSyndicateProtocol, 10) > 100)) {
      setOtherProfitShareToSyndicateProtocol(value);
      setProfitShareToSyndProtocol(value);
    } else {
      setOtherProfitShareToSyndicateProtocol("100");
      setProfitShareToSyndProtocol("100");
      setProfitShareToSyndProtocolError("");
      setIconLeftMargin(3.8);
    }
  };

  /**
   * Show copied text for 2 seconds when user clicks the copy icon
   */
  const handleOnCopy = () => {
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);

    // Amplitude logger: How many users after the success pop up modal click on the "copy link to share"
    amplitudeLogger(CLICK_COPY_LINK_TO_SHARE, { flow: Flow.MGR_CREATE_SYN });
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

  const handleFormLLC = (event: any) => {
    setFormLLC(event.target.checked);
  };

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
            <p className="text-blue ml-4">Offchain Data</p>
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
              <div className={`flex flex-row justify-center`}>
                <div className={`flex mr-2 w-1/2 justify-end `}>
                  <label className="block pt-2 text-black text-sm font-medium"></label>
                </div>

                <div className="w-5/6 flex-grow flex flex-col justify-between">
                  {/* input field */}
                  <div className="flex justify-start">
                    <div className="flex items-center h-5">
                      <input
                        name="attachLLCManually"
                        type="checkbox"
                        className="focus:ring-blue h-4 w-4 text-blue border-gray-300 rounded"
                        onChange={handleFormLLC}
                        checked={formLLC ? true : false}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-700 ml-2 text-black justify-center text-sm font-whyte word-wrap">
                        I&apos;d like help forming an LLC for this syndicate
                        (optional)
                      </p>

                      <p className="ml-2 text-black justify-center text-sm font-whyte text-gray-500 word-wrap">
                        We&apos;ll reach out within 48 hours to coordinate
                        further details.
                      </p>
                    </div>

                    <div className="w-auto mt-1 flex">
                      <div className="flex-shrink-0 flex items-center justify-center">
                        <div className="tooltip px-4"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* modal sub title */}
          <div
            className="flex justify-start mt-4 mb-1 text-blue font-medium 
          text-center leading-8 text-lg"
          >
            <p className="text-blue ml-4">Onchain Data</p>
          </div>

          <div className="border border-gray-85 bg-gray-99 rounded-xl p-4">
            <div className="space-y-3">
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
                  error: depositERC20AddressError,
                  tooltip: depositTokenToolTip,
                  logo: depositERC20AddressLogo,
                }}
                value={depositERC20Address}
                onChange={handlesetDepositERC20Address}
                name="depositToken"
                placeholder="Please provide an ERC20 token address"
              />

              {/* min deposits */}
              <TextInput
                {...{
                  label: "Minimum Deposits (Per Member):",
                  error: minDepositsError,
                  tooltip: minimumDepositToolTip,
                }}
                onChange={handleSetMinDeposits}
                name="minDeposits"
                value={minDeposits}
                placeholder="0"
              />

              {/* max deposits */}
              <TextInput
                {...{
                  label: "Maximum Deposits (Per Member):",
                  error: maxDepositsError,
                  tooltip: maximumDepositToolTip,
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
                }}
                onChange={maxTotalDepositsHandler}
                name="maxTotalDeposits"
                value={maxTotalDeposits}
                placeholder="Unlimited"
              />

              {/* Max Members allowed to deposit */}
              <TextInput
                {...{
                  label: "Maximum Members (Total Members):",
                  error: maxMembersError,
                  tooltip: maxMembersToolTip,
                }}
                onChange={maxMembersHandler}
                name="maxMembers"
                value={maxMembers}
                placeholder="Unlimited"
              />

              {/* close date */}
              <div
                className={`flex flex-row
                justify-center w-full`}
              >
                <div className={`flex mr-2 w-1/2 justify-end`}>
                  <label
                    htmlFor="closeDate"
                    className="block pt-2 text-black text-sm font-medium"
                  >
                    Close Date:
                  </label>
                </div>
                <div
                  className={`w-5/6 flex-grow flex flex-col justify-between`}
                >
                  {/* input field */}
                  <div className="flex justify-end">
                    <DatePicker
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      className={`flex flex-grow focus:ring-blue text-sm focus:border-blue rounded-md text-black border-gray-85 w-full font-whyte`}
                      minDate={minimumCloseDate}
                      selectsStart
                      name="closeDate"
                      dropdownMode="select"
                    />

                    {/* icon */}
                    <div className="w-12 -mr-0.5 flex">
                      <InfoIcon tooltip={closeDateToolTip} />
                    </div>
                  </div>
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
              <div className="flex flex-row justify-center">
                <div className="mr-2 w-1/2 mt-1 flex justify-end">
                  <label
                    htmlFor="profitShareToSyndProtocol"
                    className="block pt-2 text-black text-sm font-medium"
                  >
                    Profit Share to Syndicate Protocol:
                  </label>
                </div>

                {/* shows 4 equal grids used to get the input for profit share */}
                <div className="w-5/6 flex justify-between">
                  <div
                    className={`grid grid-cols-4 w-2/5  overflow-hidden gray-85 flex-grow`}
                  >
                    <button
                      className={`flex justify-center items-center py-2 text-sm rounded-l-md border border-gray-85 border-r-0 focus:outline-none ${
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
                      className={`flex justify-center items-center py-2 text-sm border border-gray-85 focus:outline-none ${
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
                      className={`flex justify-center items-center py-2 text-sm border border-gray-85 border-l-0 focus:outline-none ${
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

                    <div className="flex justify-start rounded-r-md border-l-0 border border-gray-85">
                      <input
                        type="number"
                        className={`flex text-sm rounded-r-md font-whyte w-full border-0 border-gray-85 border-l-0 pr-6`}
                        placeholder="Other %"
                        name="profitShareToSyndProtocol"
                        onChange={profitShareToSyndicateOnchangeHandler}
                        value={otherProfitShareToSyndicateProtocol}
                        onWheel={(e) => e.currentTarget.blur()}
                      />
                      <span
                        className="flex flex-1 justify-start items-center absolute py-2 text-gray-500"
                        style={{ marginLeft: `${iconLeftMargin}ch` }}
                      >
                        {otherProfitShareToSyndicateProtocol ? "%" : ""}
                      </span>
                    </div>
                  </div>

                  {/* icon */}
                  <div className="flex w-12 content-center">
                    <InfoIcon tooltip={profitShareToSyndicateProtocolToolTip} />
                  </div>
                </div>
              </div>
              <div className="flex flex-row justify-center w-full">
                <div className="mr-2 w-1/2 justify-end"></div>

                <p className="w-5/6 text-red-500 text-xs -mt-2">
                  {profitShareToSyndProtocolError
                    ? profitShareToSyndProtocolError
                    : null}
                </p>
              </div>

              <Toggle
                {...{
                  enabled: allowlistEnabled,
                  toggleEnabled: toggleAllowlistEnabled,
                  label: "Manually Whitelist Members:",
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

              <Toggle
                {...{
                  enabled: transferable,
                  toggleEnabled: toggleTransferable,
                  label: "Transferable:",
                  tooltip: transferableToolTip,
                }}
              />
            </div>
          </div>

          {/* agree to terms */}
          <div className="flex my-4 w-full flex-col align-center justify-center py-4">
            <p className="flex text-black justify-center">
              By creating a syndicate, you agree to the{" "}
              <Link href={`${TERMS_OF_SERVICE_LINK}`}>
                <a
                  className="font-whyte text-center ml-1 font-medium text-blue hover bg-light-green"
                  target="_blank"
                >
                  terms of service.
                </a>
              </Link>
            </p>
          </div>

          {/* submit button */}
          <div className="flex my-4 w-full justify-center py-2">
            <Button
              type="submit"
              customClasses={`rounded-full bg-blue w-auto px-10 py-2 text-lg ${
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
      </PendingStateModal>

      {/* Error message modal */}
      <ErrorModal
        {...{
          show: showErrorMessage,
          errorMessage,
          handleClose: () => {
            setShowErrorMessage(false);
            setErrorMessage("");
            setShowModal(true);
          },
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
            <p className="text-2xl font-whyte">
              Syndicate Successfully Launched
            </p>
            <p className="font-whyte-light leading-8 text-sm sm:text-base text-gray-500 mt-4 mb-2">
              Your syndicate&apos;s permanent address is:
            </p>

            <div className="mb-6">
              <span className="font-whyte leading-8 p-2 my-2 rounded-md text-sm text-gray-500 bg-gray-93">
                {account}
              </span>
            </div>
            <p className="font-whyte-light leading-8 text-sm sm:text-base text-gray-500 mt-4 mb-2">
              Your syndicate's deposit link:
            </p>
            <div className="flex justify-between mx-2">
              <div className="flex flex-grow flex-col w-4/5">
                <input
                  disabled
                  className="font-whyte text-sm sm:text-base word-break p-2 overflow-hidden overflow-x-scroll border border-blue-light rounded-full"
                  value={`${window.location.origin}/syndicates/${account}/deposit`}
                ></input>
              </div>
              <div className="flex align-center justify-center mx-auto my-2 w-1/5">
                {copied ? (
                  <span className="text-sm text-gray-nightrider font-whyte-light ml-2 opacity-80">
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
                          className="w-4 ml-2 mr-1 font-whyte-light cursor-pointer border-blue text-blue"
                        />
                        Copy link
                      </p>
                    </CopyToClipboard>
                  </>
                )}
              </div>
            </div>
            <div className="flex mt-5 mb-2 justify-center">
              <EtherscanLink
                contractAddress={account}
                customStyles="font-whyte-light"
              />
            </div>
            <div className="mb-6">
              <Link href={`/syndicates/${account}/manage`}>
                <a className="font-whyte-light text-center py-3 text-sm sm:text-base font-medium text-blue hover bg-light-green">
                  Go to Syndicate Management Page
                </a>
              </Link>
            </div>
            <div>
              {/* font-whytes font-light text-gray-dim */}
              <p className="font-whyte-light text-gray-dim text-sm opacity-70">
                <span className="font-whyte text-gray-dim">
                  <b>IMPORTANT:</b>{" "}
                </span>
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
