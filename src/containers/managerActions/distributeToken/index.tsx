import { TextInput } from "@/components/inputs";
import Modal from "@/components/modal";
import { ErrorModal } from "@/components/shared";
import { syndicateProps } from "@/components/shared/interfaces";
import { approveManager } from "@/helpers";
import { getPastEvents } from "@/helpers/retrieveEvents";
import { showWalletModal } from "@/redux/actions";
import { etherToNumber } from "@/utils";
import { isZeroAddress, Validate } from "@/utils/validators";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Button from "src/components/buttons";

interface Props {
  dispatch: Function;
  showDistributeToken: boolean;
  setShowDistributeToken: Function;
  web3: any;
}

/**
 * This component displays a form with input fields used to set a syndicate
 * distributions. The component also has some details about the current ownership
 * percentages for the syndicate protocol and syndicate lead
 * @param props
 * @returns
 */
const DistributeToken = (props: Props) => {
  const {
    showDistributeToken,
    setShowDistributeToken,
    web3: {
      syndicateInstance,
      web3,
      account,
      web3contractInstance,
      daiContract,
    },
  } = props;

  const [syndicate, setSyndicate] = useState<syndicateProps>();

  const [
    defaultDistributionERC20ContractAddress,
    setDefaultDistributionERC20Address,
  ] = useState("");

  const router = useRouter();
  const { syndicateAddress } = router.query;

  const [
    managerPerformanceFeePercent,
    setManagerPerformanceBasisPoints,
  ] = useState(0);

  const [
    syndicateProfitShareBasisPoints,
    setSyndicateProfitShareBasisPoints,
  ] = useState(0);

  const [totalDistributions, setTotalDistributions] = useState<string>("0");
  const [loading, setLoading] = useState(false);
  const [syndicateOpen, setSyndicateOpen] = useState(false);
  const [syndicateError, setSyndicateError] = useState<string>("");
  const [validSyndicate, setValideSyndicate] = useState(false);
  const [claimedDistributions, setClaimedDistributions] = useState<string>("0");
  const [unClaimedDistributions, setUnClaimedDistributions] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const unClaimedDistributions =
      parseInt(totalDistributions) - parseInt(claimedDistributions);
    setUnClaimedDistributions(unClaimedDistributions);
  }, [totalDistributions, claimedDistributions]);

  // no syndicate exists without a manager, so if no manager, then syndicate does not exist
  useEffect(() => {
    if (syndicate) {
      // Checking for address 0x0000000; the default value set by solidity
      if (isZeroAddress(syndicate.currentManager)) {
        // address is empty
        setValideSyndicate(false);
      } else {
        setValideSyndicate(true);
      }
    }
  }, [syndicate]);

  useEffect(() => {
    getTotalClaimedDistributionsByCountingWithdrawals().then();
  }, [syndicateAddress]);

  const getTotalClaimedDistributionsByCountingWithdrawals = async () => {
    const events = await getPastEvents(
      web3contractInstance,
      "lpWithdrewDistributionFromSyndicate"
    );

    // filter events for the current syndicate
    events.filter(
      (event) => event.returnValues.syndicateAddress == syndicateAddress
    );

    setClaimedDistributions(events.length || 0);
    return events.length || 0;
  };

  // input fields for distribute token form
  const [
    distributionERC20Address,
    setDistributionERC20Address,
  ] = useState<string>(syndicate?.depositERC20ContractAddress);
  const [amount, setAmount] = useState<string | number>(0);
  const [amountError, setAmountError] = useState<string>("");
  const [
    distributionERC20AddressError,
    setDistributionERC20AddressError,
  ] = useState<string>("");

  const [showErrorMessage, setShowErrorMessage] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  let validated = false;

  if (distributionERC20AddressError || amountError) {
    validated = false;
  } else {
    validated = true;
  }

  const getSyndicateValues = async () => {
    setShowErrorMessage(false);
    setErrorMessage("");
    if (!syndicateInstance) return;
    setLoading(true);

    try {
      const syndicate = await syndicateInstance.getSyndicateValues(
        syndicateAddress
      );
      setSyndicate(syndicate);
      setDistributionERC20Address(syndicate.depositERC20ContractAddress);

      setDefaultDistributionERC20Address(syndicate.depositERC20ContractAddress);
      const syndicateProfitShareBasisPoints = parseInt(
        syndicate.syndicateProfitShareBasisPoints.toString()
      );
      const managerPerformanceFeeBasisPoints = parseInt(
        syndicate.managerPerformanceFeeBasisPoints.toString()
      );

      const { depositERC20ContractAddress } = syndicate;
      // retrieve total distributions
      const totalDistributions = await syndicateInstance.getTotalDistributions(
        syndicateAddress,
        depositERC20ContractAddress
      );
      setTotalDistributions(
        etherToNumber(totalDistributions.toString()).toString()
      );

      setSyndicateProfitShareBasisPoints(syndicateProfitShareBasisPoints);
      setManagerPerformanceBasisPoints(managerPerformanceFeeBasisPoints);
      setSyndicateOpen(syndicate.syndicateOpen);

      setLoading(false);
    } catch (error) {
      console.log({ error });
      setLoading(false);

      setSyndicateError(
        "An error occurred while fetching syndicate distribution details"
      );
    }
  };

  useEffect(() => {
    if (syndicateInstance) {
      getSyndicateValues();
    }
  }, [syndicateInstance]);

  /**
   * This method sets the distribution token address from which depositors can
   * withdraw their investments.
   * It also validates the input value and set appropriate error message
   */
  const handleTokenAddressChange = (event) => {
    const { value } = event.target;
    setDistributionERC20Address(value);

    if (!value.trim()) {
      setDistributionERC20AddressError("Distribution token is required");
    } else if (web3 && !web3.utils.isAddress(value)) {
      setDistributionERC20AddressError(
        "Distribution token should be a valid ERC20 address"
      );
    } else {
      setDistributionERC20AddressError("");
    }
  };

  /**
   * This method sets the amount of token to be distributed to the depositors.
   * It also validates the input value and set appropriate error message
   */
  const handleAmountChange = (event) => {
    event.preventDefault();
    const { value } = event.target;

    setAmount(value);

    const message = Validate(value);
    if (message) {
      setAmountError(`Max deposits ${message}`);
    } else {
      setAmountError("");
    }
  };

  /**
   * send data to set distributions for a syndicate
   * @param {object} data contains amount, syndicateAddress and distribution
   * token address
   */
  const onSubmit = async (event) => {
    event.preventDefault();

    if (!validSyndicate) {
      setShowErrorMessage(true);
      setErrorMessage(
        "This syndicate does not exist and therefore we can't update its details."
      );
      return;
    }

    setShowErrorMessage(false);
    setErrorMessage("");
    /**
     * If we are not connected and the form modal is open, user can trigger
     * creation of Syndicate. We therefore catch this here and request for
     * wallet connection.
     * Note: We need to find a way, like a customized alert to inform user this.
     */
    if (!syndicateInstance) {
      // Request wallet connect
      const { dispatch } = props;
      return dispatch(showWalletModal());
    }

    try {
      const dAmount = web3.utils.toWei(amount.toString());
      setSubmitting(true);

      // Approve syndicate contract to withdraw money from the syndicate
      // manager account, otherwise we will get insuffient allowance error since
      // by default the allowance is 0
      await approveManager(
        daiContract,
        account,
        syndicateInstance.address,
        dAmount
      );

      await syndicateInstance.setDistribution(
        syndicateAddress,
        distributionERC20Address,
        dAmount,
        {
          from: account,
          gasLimit: 800000,
        }
      );

      // update distributions
      setUnClaimedDistributions(+amount + unClaimedDistributions);
      setSubmitting(false);
    } catch (error) {
      setSubmitting(false);
      console.log({ error });
      setShowErrorMessage(true);
      setErrorMessage(
        "An error occured while setting distributions. Please try again"
      );
    }
  };

  return (
    <>
      <Modal
        {...{
          title: "Distribute Tokens to Depositors",
          show: showDistributeToken,
          closeModal: () => setShowDistributeToken(false),
          customWidth: "sm:w-2/3",
        }}
      >
        <div className="mx-4 mb-8">
          <p className="text-gray-500 text-sm">
            Choose a token and specify an amount to distribute from this
            syndicate back to depositors, making them available for withdraw.
          </p>
          <p className="my-2">
            IMPORTANT: In Syndicate Protocol v1, assets are NOT managed in the
            protocol for additional safety and will still appear in your
            syndicate’s wallet. Depositors will be able to withdraw
            distributions from the syndicate’s wallet via ERC20 allowances.
          </p>

          <form onSubmit={onSubmit}>
            <p className="text-blue-light mx-4 my-4 text-xl">
              Create Distribution
            </p>
            <div className="bg-gray-100 rounded-xl p-4 py-8">
              {loading ? (
                <div className="space-y-4 text-center loader">Loading</div>
              ) : !syndicateOpen ? (
                <div className="space-y-4">
                  {/* syndicate address */}
                  <TextInput
                    {...{
                      label: "Syndicate Wallet Address:",
                    }}
                    value={syndicateAddress.toString()}
                    name="syndicateAddress"
                    disabled
                  />

                  {/* Token to Distribute */}
                  <TextInput
                    {...{
                      label: "Token to Distribute:",
                      value: distributionERC20Address,
                      onChange: handleTokenAddressChange,
                      error: distributionERC20AddressError,
                    }}
                    defaultValue={defaultDistributionERC20ContractAddress}
                    name="distributionERC20Address"
                    placeholder="Enter valid distributionERC20Address"
                  />

                  {/* max deposits */}
                  <TextInput
                    {...{
                      label: "Amount:",
                      value: amount,
                      onChange: handleAmountChange,
                      defaultValue: 0,
                      error: amountError,
                    }}
                    name="amount"
                    placeholder="10"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex flex-row justify-center">
                    <p className="text-green-500">
                      You must close syndicate before setting distributions for
                      an open syndicate
                    </p>
                  </div>
                </div>
              )}
            </div>

            <p className="text-gray-500 mx-4 my-4 mt-10 text-xl">
              Distribution Details
            </p>
            <div className="bg-gray-100 mt-4 py-8 rounded-xl p-4">
              {loading ? (
                <div className="space-y-4 text-center loader">Loading</div>
              ) : syndicateError ? (
                <div className="space-y-4">
                  <div className="flex flex-row justify-center">
                    <p className="text-red-500">{syndicateError}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex flex-row justify-center">
                    <div className="mr-2 w-7/12 flex justify-end">
                      <label
                        htmlFor="syndicateAddress"
                        className="block text-black text-lg font-medium"
                      >
                        Profit Share to Syndicate Lead:
                      </label>
                    </div>

                    <div className="w-5/12 flex justify-between">
                      <p
                        className={`flex flex-grow rounded-md text-gray-500  px-4 text-lg font-ibm`}
                      >
                        {managerPerformanceFeePercent.toLocaleString()} (
                        {managerPerformanceFeePercent / 100}%)
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-row justify-center">
                    <div className="mr-2 w-7/12 flex justify-end">
                      <label
                        htmlFor="syndicateAddress"
                        className="block text-black text-lg font-medium"
                      >
                        Profit Share to Syndicate Protocol:
                      </label>
                    </div>

                    <div className="w-5/12 flex justify-between">
                      <p
                        className={`flex flex-grow rounded-md text-gray-500  px-4 text-lg font-ibm`}
                      >
                        {syndicateProfitShareBasisPoints.toLocaleString()} (
                        {syndicateProfitShareBasisPoints / 100}%)
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-row justify-center">
                    <div className="mr-2 w-7/12 flex justify-end">
                      <label
                        htmlFor="syndicateAddress"
                        className="block text-black text-lg font-medium"
                      >
                        Available for Depositors to Withdraw:
                      </label>
                    </div>

                    <div className="w-5/12 flex justify-between">
                      <p
                        className={`flex flex-grow rounded-md px-4 text-lg font-ibm`}
                      >
                        {unClaimedDistributions.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* submit button */}
            {!syndicateOpen ? (
              <div className="flex my-4 w-full justify-center py-2">
                {submitting ? (
                  <div className="loader"></div>
                ) : (
                  <Button
                    type="submit"
                    customClasses={`rounded-full bg-blue-light w-auto px-10 py-2 text-lg ${
                      validated && !loading ? "" : "opacity-50"
                    }`}
                    disabled={validated && !loading ? false : true}
                  >
                    Confirm
                  </Button>
                )}
              </div>
            ) : null}
          </form>
        </div>
      </Modal>
      {/* Error message modal */}
      <ErrorModal
        {...{
          show: showErrorMessage,
          setShowErrorMessage,
          setErrorMessage,
          errorMessage,
        }}
      ></ErrorModal>
    </>
  );
};

const mapStateToProps = ({ web3Reducer }) => {
  const { web3, submitting } = web3Reducer;
  return { web3, submitting };
};

export default connect(mapStateToProps)(DistributeToken);
