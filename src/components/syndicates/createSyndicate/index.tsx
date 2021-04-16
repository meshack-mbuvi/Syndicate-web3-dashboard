import { addNewSyndicate } from "@/redux/actions/syndicates";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
import {
  faCheckCircle,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
// fontawesome icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// Used for validating form inputs
import { joiResolver } from "@hookform/resolvers/joi";
import Link from "next/link";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import { connect } from "react-redux";
// Other useful components
import Button from "src/components/buttons";
import { InfoIcon } from "src/components/iconWrappers";
import { TextInput, Toggle } from "src/components/inputs";
import { Modal } from "src/components/modal";
import { getSyndicate } from "src/helpers/syndicate";
// redux actions
import { setLoading, setSumbitting, showWalletModal } from "src/redux/actions";
import { syndicateSchema } from "../validators";

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
  } = props;

  const [allowlistEnabled, setAllowlistEnabled] = useState(false);
  const [modifiable, setModifiable] = useState(false);
  const [syndicateProfitSharePercent, setProfitShareToSyndProtocol] = useState(
    "1"
  );
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [shareableLink, setShareableLink] = useState("");
  const [copied, setCopied] = useState(false);

  // this controls the toggle button for manually whitelisting depositors
  const toggleAllowlistEnabled = () => setAllowlistEnabled(!allowlistEnabled);
  const toggleModifiable = () => setModifiable(!modifiable);

  const closeModal = () => setShowModal(false);

  // react-hook-form provides Performant, flexible and
  // extensible forms with easy-to-use validation.
  const { register, handleSubmit, control, errors } = useForm({
    resolver: joiResolver(syndicateSchema),
  });
  /**
   * This method implements manager steps to create a syndicate
   * NOTE: we need to have the feature for setting deposit and distribution token
   * as capture on the UI
   * @param data form data
   * @returns
   */
  const onSubmit = async (data) => {
    closeModal();

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

    // show loading modal
    dispatch(setSumbitting(true));

    // get closeDate and syndicateProtocolProfitSharePercent
    const syndicateProtocolProfitSharePercent =
      syndicateProfitSharePercent == null
        ? data.profitShareToSyndProtocol
        : syndicateProfitSharePercent;

    try {
      /**
       * Convert maxDeposits, totalMaxDeposits and syndicateProfitSharePercent
       * to wei since the contract does not take normal javascript numbers
       */
      const syndicateProfitShareBasisPoints = `${
        parseFloat(syndicateProtocolProfitSharePercent) * 100
      }`;

      const maxDeposit = web3.utils.toWei(data.maxDeposits.toString());
      const maxTotalDeposits = web3.utils.toWei(
        data.maxTotalDeposits.toString()
      );
      const managerManagementFeeBasisPoints = `${
        parseFloat(data.expectedAnnualOperatingFees) * 100
      }`;
      const managerPerformanceFeeBasisPoints = `${
        parseFloat(data.profitShareToSyndicateLead) * 100
      }`;

      const depositERC20ContractAddress = data.depositToken;

      const closeDate = data.closeDate.getTime();

      await syndicateInstance.createSyndicate(
        depositERC20ContractAddress,
        maxDeposit,
        maxTotalDeposits,
        closeDate,
        syndicateProfitShareBasisPoints.toString(),
        managerManagementFeeBasisPoints,
        managerPerformanceFeeBasisPoints,
        allowlistEnabled,
        modifiable,
        { from: account, gasLimit: 800000 }
      );

      // retrieve details of the newly created syndicate
      const syndicate = await getSyndicate(account, syndicateInstance);

      // add the newly created syndicate to application state
      dispatch(addNewSyndicate({ ...syndicate, depositors: 0 }));

      dispatch(setLoading(true));

      // close loading modal
      dispatch(setSumbitting(false));

      // before showing success modal, we need to set the shareable link
      setShareableLink(
        `www.syndicateprotocol.org/${depositERC20ContractAddress}`
      );

      // close new syndicate form modal
      setShowModal(false);

      // show success modal
      setShowSuccessModal(true);
    } catch (error) {
      console.log({ error });
      // close loading modal
      dispatch(setSumbitting(false));
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
        errorMessage = "ERR_CLOSE_DATE_MUST_BE_AFTER_BLOCK_TIMESTAMP";
      } else if (accountNonceError > NOT_FOUND_CODE) {
        errorMessage =
          "Please reset you account. It appears to have incorrect count of transactions.";
      } else {
        errorMessage =
          "Your wallet address already manages the maximum of one Syndicate";
      }
      setErrorMessage(errorMessage);

      // Show the message to the end user
      setShowErrorMessage(true);
    }
  };

  // sanitize and format profitShareToSyndProtocol
  const profitShareToSyndicateOnchangeHandler = (event) => {
    event.preventDefault();
    const { value } = event.target;
    if (!isNaN(value)) {
      // what is store here will help to determine whether to read value from
      // the buttons or from the input field. See implementation of onSubmit to
      // find out why
      if (value == "1" || value == "0.3" || value == "3") {
        setProfitShareToSyndProtocol(value);
      } else {
        setProfitShareToSyndProtocol(null);
      }
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
  };

  return (
    <div className="w-full">
      {/* All syndicates from the smart contract will be displayed here */}

      {/* Modal to create a new syndicate */}
      <Modal
        {...{
          show: showModal,
          closeModal,
          customWidth: "w-full lg:w-3/5",
        }}
        title="Create New Syndicate"
      >
        {/* modal sub title */}
        <div
          className="flex justify-start mb-1 text-blue font-medium 
          text-center leading-8 text-lg"
        >
          <p className="text-blue-light ml-4">Onchain Data</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="border border-gray-85 bg-gray-99 rounded-xl p-4">
            <div className="space-y-4">
              {/* syndicate address */}
              <TextInput
                {...{
                  label: "Syndicate Address:",
                }}
                value={account}
                name="syndicateAddress"
                disabled
              />

              {/* deposit token */}
              <TextInput
                {...{
                  label: "Deposit Token:",
                  error: errors.depositToken?.message,
                }}
                defaultValue="Provide an ERC20 or DAI address"
                register={register({ required: true })}
                name="depositToken"
                placeholder="USDC"
              />

              {/* max deposits */}
              <TextInput
                {...{
                  label: "Max Deposits(Per Depositor):",
                  error: errors.maxDeposits?.message,
                }}
                register={register({ required: true })}
                name="maxDeposits"
                defaultValue="100"
                placeholder="5000"
              />

              {/* Max Total deposits */}
              <TextInput
                {...{
                  label: "Max Deposits(Total):",
                  error: errors.maxTotalDeposits?.message,
                }}
                register={register({ required: true })}
                name="maxTotalDeposits"
                defaultValue="100"
                placeholder="10000"
              />

              {/* close date */}
              <div className="flex flex-row justify-end">
                <div className="mr-2 w-5/12 flex justify-end">
                  <label
                    htmlFor="syndicateAddress"
                    className="block pt-2 text-black text-sm font-medium"
                  >
                    Close Date:
                  </label>
                </div>

                <div className="w-7/12 flex justify-between">
                  <Controller
                    control={control}
                    name="closeDate"
                    render={({ onChange, value }) => (
                      <DatePicker
                        selected={value}
                        onChange={onChange}
                        className={`flex flex-grow focus:ring-indigo-500 focus:border-indigo-500 rounded-md text-black border-gray-85 w-full`}
                        placeholder={new Date()}
                      />
                    )}
                  />

                  {/* icon */}
                  <div className="w-6 ml-4 mt-1">
                    <InfoIcon />
                  </div>
                </div>
              </div>

              {/* Expected Annual Operating Fees */}
              <TextInput
                {...{
                  label: "Expected Annual Operating Fees:",
                  error: errors.expectedAnnualOperatingFees?.message,
                }}
                register={register}
                name="expectedAnnualOperatingFees"
                defaultValue="2"
                placeholder="2"
              />

              <TextInput
                {...{
                  label: "Profit Share to Syndicate Lead:",
                  error: errors.profitShareToSyndicateLead?.message,
                }}
                register={register}
                name="profitShareToSyndicateLead"
                placeholder="10"
                defaultValue="10"
              />

              {/* Profit Share to Syndicate Protocol: */}
              <div className="h-10 flex flex-row justify-center">
                <div className="mr-2 w-5/12 flex justify-end">
                  <label
                    htmlFor="syndicateAddress"
                    className="block pt-2 text-black text-sm font-medium"
                  >
                    Profit Share to Syndicate Protocol:
                  </label>
                </div>

                {/* shows 4 equal grids used to get the input for profit share */}
                <div className="w-7/12 flex justify-between">
                  <div
                    className={`grid grid-cols-4 w-4/5 border gray-85 flex flex-grow rounded-md`}
                  >
                    <button
                      className={`flex justify-center pt-2 border-r focus:outline-none ${
                        syndicateProfitSharePercent == "0.5"
                          ? "bg-blue-100 text-black"
                          : "gray-85"
                      }`}
                      onClick={() => setProfitShareToSyndProtocol("0.5")}
                      type="button"
                    >
                      0.5%
                    </button>

                    <button
                      className={`flex justify-center pt-2 border-r focus:outline-none ${
                        syndicateProfitSharePercent == "1"
                          ? "bg-blue-100 text-black"
                          : "gray-85"
                      }`}
                      onClick={() => setProfitShareToSyndProtocol("1")}
                      type="button"
                    >
                      1%
                    </button>

                    <button
                      className={`flex justify-center pt-2 border-r focus:outline-none ${
                        syndicateProfitSharePercent == "3"
                          ? "bg-blue-100 text-black"
                          : "gray-85"
                      }`}
                      type="button"
                      onClick={() => setProfitShareToSyndProtocol("3")}
                    >
                      3%
                    </button>

                    <div>
                      <Controller
                        control={control}
                        name="profitShareToSyndProtocol"
                        rules={{ min: "30", max: "100" }}
                        render={({ onChange }) => (
                          <input
                            type="text"
                            className="flex flex-grow w-full h-full outline-none border-0 focus:border-0 rounded-br-md rounded-tr-md"
                            placeholder="other"
                            onChange={(value) => {
                              profitShareToSyndicateOnchangeHandler(value);
                              onChange(value);
                            }}
                          />
                        )}
                      />
                    </div>
                  </div>

                  {/* icon */}
                  <div className="w-6 ml-4 mt-1">
                    <InfoIcon />
                  </div>
                </div>
              </div>

              <Toggle
                {...{
                  enabled: allowlistEnabled,
                  toggleEnabled: toggleAllowlistEnabled,
                  label: "Manually Whitelist Depositors:",
                }}
              />

              {/* modifiable */}
              <Toggle
                {...{
                  enabled: modifiable,
                  toggleEnabled: toggleModifiable,
                  label: "Modifiable:",
                }}
              />
            </div>
          </div>

          {/* agree to terms */}
          <div className="flex my-4 w-full justify-center py-4">
            <p className="flex text-black">
              I agree to the
              <span className="mx-2 text-blue-light"> terms of service</span>
              (required):
              <span className="ml-2">
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  size="lg"
                  className="text-gray-light"
                />
              </span>
            </p>
          </div>

          {/* submit button */}
          <div className="flex my-4 w-full justify-center py-2">
            <Button
              type="submit"
              customClasses="rounded-full bg-blue-light w-auto px-10 py-2 text-lg"
            >
              Launch
            </Button>
          </div>
        </form>
      </Modal>

      {/* Loading modal */}
      <Modal {...{ show: submitting, closeModal: () => setSumbitting(false) }}>
        <div className="flex flex-col justify-center m-auto mb-4">
          <div className="loader">Loading...</div>
          <div className="modal-header mb-4 text-black font-medium text-center leading-8 text-lg">
            Please wait, we are creating your syndicate.
          </div>
        </div>
      </Modal>

      {/* Error message modal */}
      <Modal
        {...{
          show: showErrorMessage,
          closeModal: () => {
            setShowErrorMessage(false);
            setErrorMessage("");
          },
        }}
      >
        <div className="flex justify-center m-auto mb-4">
          <div className="modal-header mb-4 flex-col font-medium text-center flex justify-center leading-8 text-lg">
            <div className="w-full flex justify-center mb-4">
              <FontAwesomeIcon
                icon={faExclamationTriangle}
                size="10x"
                className="cursor-pointer h-4 text-red-500 text-7xl"
              />
            </div>
            <p className="text-red-500 text-lg">{errorMessage}</p>
          </div>
        </div>
      </Modal>

      {/* show success modal */}
      <Modal
        {...{
          show: showSuccessModal,
          closeModal: () => setShowSuccessModal(false),
          type: "success",
          customWidth: "w-3/5",
        }}
      >
        <div className="flex flex-col justify-center m-auto mb-4">
          <div className="flex align-center justify-center">
            <div className="border-4 border-light-blue m-8 rounded-full h-24 w-24 flex items-center justify-center">
              <svg
                width="34"
                height="26"
                viewBox="0 0 34 26"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
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
                <p className="text-xs">Your shareable deposit link:</p>
                <p className="text-sm">{shareableLink}</p>
              </div>
              <div className="flex align-center justify-center mx-auto my-4 ml-2">
                {copied ? (
                  <span className="text-green-400">Copied</span>
                ) : (
                  <CopyToClipboard text={shareableLink} onCopy={handleOnCopy}>
                    <FontAwesomeIcon
                      icon={faCopy}
                      size="2x"
                      className="cursor-pointer border-blue text-blue-light"
                    />
                  </CopyToClipboard>
                )}
              </div>
            </div>

            <div className="text-light-blue">
              <Link href={`/syndicates/${account}`}>
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

CreateSyndicate.propTypes = {
  web3: PropTypes.any,
  dispatch: PropTypes.func,
  showModal: PropTypes.bool,
  setShowModal: PropTypes.func,
  web3contractInstance: PropTypes.any,
};

const mapStateToProps = ({ web3Reducer }) => {
  const { web3, submitting } = web3Reducer;
  console.log({ web3Reducer });
  return { web3, submitting };
};

export default connect(mapStateToProps)(CreateSyndicate);
