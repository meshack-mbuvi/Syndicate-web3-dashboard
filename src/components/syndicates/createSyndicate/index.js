import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useForm, Controller } from "react-hook-form";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Link } from "gatsby";
import { toEther } from "src/utils";

// Used for validating form inputs
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";

// Other usefull components
import Button from "src/components/buttons";
import { TextInput, Toggle } from "src/components/inputs";
import { Modal } from "src/components/modal";
import DatePicker from "react-datepicker";

// redux actions
import { showWalletModal } from "src/redux/actions/web3Provider";

// validation schema for new syndicate form
const syndicateSchema = Joi.object({
  closeDate: Joi.date().required().label("Close date").messages({
    "any.empty": "Fund Close date must be provided.",
  }),
  depositToken: Joi.string().required().label("Deposit token").messages({
    "any.empty": "Deposit token must be provided.",
  }),
  maxDeposits: Joi.number().required().label("Maximum deposits").messages({
    "any.empty": "Max deposits must be provided.",
  }),
  maxTotalDeposits: Joi.number()
    .min(Joi.ref("maxDeposits"))
    .required()
    .label("Maximum Total deposits")
    .messages({
      "any.empty": "Total maximum deposits must be provided.",
      "number.min":
        "Total maximum deposits must be greater than or equal to max deposits",
    }),
  distributionToken: Joi.string()
    .required()
    .label("Distribution Token")
    .messages({
      "any.empty": "Distribution token must be provided.",
    }),
  profitShareToSyndProtocol: Joi.string()
    .regex(/^\d+(\.\d{0,2})?$/)
    .messages({
      "object.regex": "Should have atmost 2 decimal places",
    }),
  profitShareToSyndicateLead: Joi.string()
    .regex(/^\d+(\.\d{0,2})?$/)
    .messages({
      "object.regex": "Must have atmost 2 decimal places",
    }),
});

/**
 * Diplays all syndicates.
 * The main groups for syndicates are active and inactive
 *
 * At the top-right of the page, there is a create button which opens a modal
 * with a form to create a new syndicate
 */
const CreateSyndicate = (props) => {
  // retrive contract details
  const {
    web3: { contract, account },
    dispatch,
    showModal,
    setShowModal,
  } = props;

  const [primaryERC20ContractAddress, setSyndicateAddress] = useState("");
  const [allowlistEnabled, setAllowlistEnabled] = useState(false);
  const [syndicateProfitSharePercent, setProfitShareToSyndProtocol] = useState(
    "1"
  );
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [shareableLink, setShareableLink] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    /**
     * When contract instance is null or undefined, we can't access syndicate
     * address so we need to connect to wallet first which will handle contract
     * instantiation.
     */
    if (!contract) {
      dispatch(showWalletModal());
    } else {
      setSyndicateAddress(contract.address);
    }
  }, [contract]);

  // this controls the toggle button for manually whitelisting depositors
  const toggleAllowlistEnabled = () => setAllowlistEnabled(!allowlistEnabled);

  const closeModal = () => setShowModal(false);

  // react-hook-form provides Performant, flexible and
  // extensible forms with easy-to-use validation.
  const { register, handleSubmit, control, errors } = useForm({
    resolver: joiResolver(syndicateSchema),
  });

  const onSubmit = async (data) => {
    /**
     * If we are not connected and the form modal is open, user can trigger
     * creation of Syndicate. We therefore catch this here and request for
     * wallet connection.
     * Note: We need to find a way, like an customized alert to inform user this.
     */
    if (!contract) {
      // Hide New Syndicate modal to give room to wallet connection modal
      setShowModal(false);

      return dispatch(showWalletModal());
    }

    const zeroAddress = "0x0000000000000000000000000000000000000000";

    // when secondaryAddress is not provided
    const secondaryERC20ContractAddress = zeroAddress;

    // get closeDate and syndicateProtocolProfitSharePercent
    const closeDate = data.closeDate.toString();
    const syndicateProtocolProfitSharePercent =
      syndicateProfitSharePercent == null
        ? data.profitShareToSyndProtocol
        : syndicateProfitSharePercent;

    try {
      /**
       * Convert maxDeposits, totalMaxDeposits and syndicateProfitSharePercent
       * to ether. We need to convert bigNumbers to string before passing them
       */
      const syndicateProfitSharePercent = toEther(
        parseFloat(syndicateProtocolProfitSharePercent) * 100
      );


      const maxDeposits = toEther(data.maxDeposits);
      const maxTotalDeposits = toEther(data.maxTotalDeposits);

      const timeUntilSPVCloseDate = new Date(closeDate).getTime().toString();

      const spv = await contract.createSPV(
        primaryERC20ContractAddress,
        secondaryERC20ContractAddress,
        syndicateProfitSharePercent,
        timeUntilSPVCloseDate,
        maxDeposits,
        maxTotalDeposits,
        allowlistEnabled,
        { from: account, gasLimit: 800000 }
      );
      console.log({ spv });

      // before showing success modal, we need to get the shareable link
      setShareableLink(
        `www.syndicateprotocol.org/${primaryERC20ContractAddress}`
      );

      // close new syndicate form modal
      setShowModal(false);

      // show success modal
      setShowSuccessModal(true);
    } catch (error) {
      // This error will be shown when the designs are ready
      console.log({ error });
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
          customWidth: "w-3/5",
        }}
        title="Create New Syndicate"
      >
        {/* modal sub title */}
        <div className="flex justify-start mb-1 text-blue font-medium text-center leading-8 text-lg">
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
                value={primaryERC20ContractAddress}
                name="syndicateAddress"
                disabled
              />

              {/* deposit token */}
              <TextInput
                {...{
                  label: "Deposit Token:",
                }}
                register={register({ required: true })}
                name="depositToken"
                placeholder="USDC"
              />
              {/* distribution token */}
              <TextInput
                {...{
                  label: "Distribution Token:",
                }}
                register={register({ required: true })}
                name="distributionToken"
                placeholder="USDC"
              />
              {/* max deposits */}
              <TextInput
                {...{
                  label: "Max Deposits:",
                }}
                register={register({ required: true })}
                name="maxDeposits"
                placeholder="5,000"
              />
              {/* Max Total deposits */}
              <TextInput
                {...{
                  label: "Max Total Deposits:",
                }}
                register={register({ required: true })}
                name="maxTotalDeposits"
                placeholder="10,000"
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
                    <span className="w-8 h-5 mt-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="gray"
                        className="rotate-180"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>

              <TextInput
                {...{
                  label: "Profit Share to Syndicate Lead:",
                }}
                register={register}
                name="profitShareToSyndicateLead"
                placeholder="10%"
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
                        syndicateProfitSharePercent == "0.3"
                          ? "bg-blue-100 text-black"
                          : "gray-85"
                      }`}
                      onClick={() => setProfitShareToSyndProtocol(0.3)}
                      type="button"
                    >
                      0.3%
                    </button>

                    <button
                      className={`flex justify-center pt-2 border-r focus:outline-none ${
                        syndicateProfitSharePercent == "1"
                          ? "bg-blue-100 text-black"
                          : "gray-85"
                      }`}
                      onClick={() => setProfitShareToSyndProtocol(1)}
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
                      onClick={() => setProfitShareToSyndProtocol(3)}
                    >
                      3%
                    </button>

                    <div>
                      <Controller
                        control={control}
                        name="profitShareToSyndProtocol"
                        rules={
                          ({ min: "30", message: "Profit must be 30% or more" },
                          { max: "100" })
                        }
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
                    <span className="w-8 h-5 mt-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="gray"
                        className="rotate-180"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </span>
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
            </div>
          </div>

          {/* agree to terms */}
          <div className="flex my-4 w-full justify-center py-4">
            <p className="flex text-black">
              I agree to the{" "}
              <span className="mx-2 text-blue-light"> terms of service</span>
              (required):
              <span className="w-7 h-7 ml-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  className="fill-gray"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
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
            <p className="leading-8 text-sm text-gray-500 m-4">
              {primaryERC20ContractAddress}
            </p>
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
              <Link
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium  text-blue-light hover md:py-4 md:text-lg md:px-10 bg-light-green"
                to={`/syndicates/${account}`}
              >
                Go to Syndicate Deposit Page
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
  props: PropTypes.any,
};

const mapStateToProps = ({ web3Reducer }) => {
  const { web3 } = web3Reducer;
  return { web3 };
};

export default connect(mapStateToProps)(CreateSyndicate);
