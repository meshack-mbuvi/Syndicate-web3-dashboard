import { TextArea } from "@/components/inputs";
import Modal from "@/components/modal";
import { ErrorModal } from "@/components/shared";
import { syndicateProps } from "@/components/shared/interfaces";
import { showWalletModal } from "@/redux/actions";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { managerApproveAddressesConstants } from "src/components/syndicates/shared/Constants";

interface Props {
  dispatch: Function;
  showPreApproveDepositor: boolean;
  setShowPreApproveDepositor: Function;
  web3: any;
}

/**
 * This component displays a form with textarea to set approved addresses
 * @param props
 * @returns
 */

const PreApproveDepositor = (props: Props) => {
  const {
    showPreApproveDepositor,
    setShowPreApproveDepositor,
    web3: { syndicateInstance, web3, account },
  } = props;

  const [syndicate, setSyndicate] = useState<syndicateProps>(null);

  const [validSyndicate, setValideSyndicate] = useState(false);

  const router = useRouter();
  const { syndicateAddress } = router.query;

  const [loading, setLoading] = useState(false);

  // no syndicate exists without a manager, so if no manager, then syndicate does not exist
  useEffect(() => {
    if (syndicate) {
      // Checking for address 0x0000000; the default value set by solidity
      if (/^0x0+$/.test(syndicate.currentManager)) {
        // address is empty
        setValideSyndicate(false);
      } else {
        setValideSyndicate(true);
      }
    }
  }, [syndicate]);

  const getSyndicate = async () => {
    setShowErrorMessage(false);
    setErrorMessage("");
    if (!syndicateInstance) return;
    setLoading(true);

    try {
      const syndicate = await syndicateInstance.getSyndicateValues(
        syndicateAddress
      );
      setSyndicate(syndicate);

      setLoading(false);
    } catch (error) {
      console.log({ error });
      setLoading(false);

      setSyndicateError("An error occurred while fetching syndicate values");
    }
  };

  useEffect(() => {
    if (syndicateInstance) {
      getSyndicate();
    }
  }, [syndicateInstance]);

  const [syndicateError, setSyndicateError] = useState<string>("");

  // array of addresses to be allowed by the Syndicate, of maximum size equal to the maximum number of LPs.",
  const [lpAddresses, setLpAddresses] = useState("");
  const [lpAddressesError, setLpAddressesError] = useState<string>("");
  const [showLPError, setShowLPError] = useState<boolean>(false);
  const [showErrorMessage, setShowErrorMessage] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  /**
   * This method sets the approved addresses
   * It also validates the input value and set appropriate error message
   */
  const handleLpAddressesChange = (event) => {
    const { value } = event.target;

    const removeEnter = value.replace(/^\s+|\s+$/g, "");
    const removeSpace = removeEnter.replace(/\s/g, "");

    // convert comma separated string into array
    const splitArr = removeSpace.split(",");

    // get last element in array
    const lastElement = splitArr[splitArr.length - 1];

    // create new copy of split array
    let newSplitArr = [...splitArr];

    // check if empty string
    if (!lastElement) {
      newSplitArr.pop();
    }

    // validate addresses
    newSplitArr && newSplitArr.length
      ? newSplitArr.map((value: string) => {
          if (web3.utils.isAddress(value)) {
            setLpAddressesError("");
            setShowLPError(false);
          } else {
            setShowLPError(true);
            console.log({ showLPError });
            setLpAddressesError(`${value} is not a valid ERC20 address`);
          }
        })
      : setLpAddressesError("");

    // join the array to comma separated string
    setLpAddresses(splitArr.join());
  };

  /**
   * send data to set distributions for a syndicate
   * @param {object} data contains amount, syndicateAddress and distribution
   * token address
   */
  const handleSubmit = async () => {
    if (!validSyndicate) {
      setShowErrorMessage(true);
      setErrorMessage(
        "This syndicate does not exist and therefore we can't update its details."
      );
      return;
    }

    if (!lpAddresses) {
      setLpAddressesError("Approved address is required");
      setShowLPError(true);
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
      setSubmitting(true);

      // convert comma separated string into array
      const splitArr = lpAddresses.split(",");

      // get last element in array
      const lastElement = splitArr[splitArr.length - 1];

      // create new copy of split array
      let newSplitArr = [...splitArr];

      // check if empty string
      if (!lastElement) {
        newSplitArr.pop();
      }

      await syndicateInstance.allowAddresses(syndicateAddress, newSplitArr, {
        from: account,
        gasLimit: 800000,
      });

      // // close pre-approve modal
      setShowPreApproveDepositor(false);
      setSubmitting(false);
    } catch (error) {
      setSubmitting(false);
      console.log({ error });
      setShowErrorMessage(true);
      setErrorMessage(
        "An error occured while setting pre-approve depositors. Please try again"
      );
    }
  };

  const {
    approveAddressesWarning,
    approveAddressesHeadingText,
    textAreaTitle,
    approvedAddressesLabel,
    separateWithCommas,
    buttonText,
  } = managerApproveAddressesConstants;

  return (
    <>
      <Modal
        {...{
          title: "Pre-Approve Depositors",
          show: showPreApproveDepositor,
          closeModal: () => setShowPreApproveDepositor(false),
          customWidth: "sm:w-2/3",
        }}
      >
        <div className="mt-5 sm:mt-6 flex justify-center">
          {loading ? (
            <div className="space-y-4 text-center loader">Loading</div>
          ) : syndicateError ? (
            <div className="space-y-4">
              <div className="flex flex-row justify-center">
                <p className="text-red-500">{syndicateError}</p>
              </div>
            </div>
          ) : (
            <div>
              <div className="text-gray-400 py-6">
                {approveAddressesHeadingText}
              </div>
              <div className="font-bold	">{approveAddressesWarning}</div>
              <div className="text-blue-light font-semibold	pt-10 pl-4">
                {textAreaTitle}
              </div>
              <div className="border-2 rounded-lg	bg-gray-99 mt-2 flex px-10 py-6">
                <div className="w-2/5 mt-6">
                  <p>{approvedAddressesLabel}:</p>
                  <p>{separateWithCommas}</p>
                </div>
                <TextArea
                  {...{
                    name: "addresses",
                    value: lpAddresses,
                    onChange: handleLpAddressesChange,
                    error: lpAddressesError,
                  }}
                  defaultValue=""
                  name="approvedAddresses"
                  placeholder=""
                />
              </div>
              <div className="flex items-center	justify-center pt-6">
                {submitting ? (
                  <div className="loader"></div>
                ) : (
                  <button
                    className={`bg-blue-light text-white	py-2 px-10 rounded-full ${
                      showLPError ? "cursor-not-allowed" : null
                    }`}
                    onClick={handleSubmit}
                    disabled={showLPError}
                  >
                    {buttonText}
                  </button>
                )}
              </div>
            </div>
          )}
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

export default connect(mapStateToProps)(PreApproveDepositor);
