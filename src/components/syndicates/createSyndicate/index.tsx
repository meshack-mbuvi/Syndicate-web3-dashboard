import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
// fontawesome icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// Used for validating form inputs
import { joiResolver } from "@hookform/resolvers/joi";
import Link from "next/link";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import { connect } from "react-redux";
// Other useful components
import Button from "src/components/buttons";
import { InfoIcon } from "src/components/iconWrappers";
import { TextInput, Toggle } from "src/components/inputs";
import { Modal } from "src/components/modal";
// redux actions
import { showWalletModal } from "src/redux/actions/web3Provider";
import { toEther } from "src/utils";
import { syndicateSchema } from "../validators";

/**
 * Diplays all syndicates.
 * The main groups for syndicates are active and inactive
 *
 * At the top-right of the page, there is a create button which opens a modal
 * with a form to create a new syndicate
 */
const CreateSyndicate = (props) => {
  // retrieve contract details
  const {
    web3: { syndicateInstance, account },
    dispatch,
    showModal,
    setShowModal,
  } = props;
  console.log({ props });

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
    if (syndicateInstance) {
      setSyndicateAddress(account);
    }
  }, [syndicateInstance]);

  // this controls the toggle button for manually whitelisting depositors
  const toggleAllowlistEnabled = () => setAllowlistEnabled(!allowlistEnabled);

  const closeModal = () => setShowModal(false);

  // react-hook-form provides Performant, flexible and
  // extensible forms with easy-to-use validation.
  const { register, handleSubmit, control } = useForm({
    resolver: joiResolver(syndicateSchema),
  });

  const onSubmit = async (data) => {
    /**
     * If we are not connected and the form modal is open, user can trigger
     * creation of Syndicate. We therefore catch this here and request for
     * wallet connection.
     * Note: We need to find a way, like a customized alert to inform user this.
     */
    if (!syndicateInstance) {
      // Hide New Syndicate modal to give room to wallet connection modal
      setShowModal(false);

      return dispatch(showWalletModal());
    }

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
        parseFloat(syndicateProtocolProfitSharePercent) * 1000
      );

      const maxDeposits = toEther(data.maxDeposits);
      const maxTotalDeposits = toEther(data.maxTotalDeposits);

      const timeUntilSPVCloseDate = new Date(closeDate).getTime();

      const syndicate = await syndicateInstance.createSyndicate(
        primaryERC20ContractAddress,
        syndicateProfitSharePercent.toString(),
        timeUntilSPVCloseDate,
        maxDeposits,
        maxTotalDeposits,
        allowlistEnabled,
        { from: account, gasLimit: 800000 }
      );

      // this is for testing purpose. It should be removed before launch
      await syndicateInstance.allowAddresses(
        account,
        ["0x176890F8a0d17a82DaC2cF6B4a5F2833bFdbf16F"],
        {
          from: account,
        }
      );

      console.log({ syndicate });

      // before showing success modal, we need to set the shareable link
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
        title="Create New Syndicate">
        {/* modal sub title */}
        <div
          className="flex justify-start mb-1 text-blue font-medium 
          text-center leading-8 text-lg">
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
                    className="block pt-2 text-black text-sm font-medium">
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
                    className="block pt-2 text-black text-sm font-medium">
                    Profit Share to Syndicate Protocol:
                  </label>
                </div>

                {/* shows 4 equal grids used to get the input for profit share */}
                <div className="w-7/12 flex justify-between">
                  <div
                    className={`grid grid-cols-4 w-4/5 border gray-85 flex flex-grow rounded-md`}>
                    <button
                      className={`flex justify-center pt-2 border-r focus:outline-none ${
                        syndicateProfitSharePercent == "0.3"
                          ? "bg-blue-100 text-black"
                          : "gray-85"
                      }`}
                      onClick={() => setProfitShareToSyndProtocol("0.3")}
                      type="button">
                      0.3%
                    </button>

                    <button
                      className={`flex justify-center pt-2 border-r focus:outline-none ${
                        syndicateProfitSharePercent == "1"
                          ? "bg-blue-100 text-black"
                          : "gray-85"
                      }`}
                      onClick={() => setProfitShareToSyndProtocol("1")}
                      type="button">
                      1%
                    </button>

                    <button
                      className={`flex justify-center pt-2 border-r focus:outline-none ${
                        syndicateProfitSharePercent == "3"
                          ? "bg-blue-100 text-black"
                          : "gray-85"
                      }`}
                      type="button"
                      onClick={() => setProfitShareToSyndProtocol("3")}>
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
              customClasses="rounded-full bg-blue-light w-auto px-10 py-2 text-lg">
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
  web3Events: PropTypes.any,
};

const mapStateToProps = ({ web3Reducer }) => {
  const { web3 } = web3Reducer;
  return { web3 };
};

export default connect(mapStateToProps)(CreateSyndicate);
