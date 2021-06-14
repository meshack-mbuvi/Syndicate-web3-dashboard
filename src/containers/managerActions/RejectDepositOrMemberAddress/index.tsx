import { TextArea } from "@/components/inputs";
import Modal from "@/components/modal";
import { PendingStateModal } from "@/components/shared/transactionStates";
import ConfirmStateModal from "@/components/shared/transactionStates/confirm";
import FinalStateModal from "@/components/shared/transactionStates/final";
import { getMetamaskError } from "@/helpers";
import { checkAccountAllowance } from "@/helpers/approveAllowance";
import { getSyndicateMemberInfo } from "@/helpers/syndicate";
import { showWalletModal } from "@/redux/actions";
import { getSyndicateByAddress } from "@/redux/actions/syndicates";
import { RootState } from "@/redux/store";
import { getWeiAmount } from "@/utils/conversions";
import { isZeroAddress, sanitizeInputString } from "@/utils/validators";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  confirmingTransaction,
  preApproveMoreAddress,
  rejectDepositOrMemberAddressConstants,
  rejectTransactionText,
  separateWithCommas,
  waitTransactionTobeConfirmedText,
} from "src/components/syndicates/shared/Constants";

interface Props {
  showRejectDepositOrMemberAddress: boolean;
  setShowRejectDepositOrMemberAddress: Function;
}

/**
 * This component displays a form with textarea to set approved addresses
 * @param props
 * @returns
 */

const RejectDepositOrMemberAddress = (props: Props) => {
  const {
    showRejectDepositOrMemberAddress,
    setShowRejectDepositOrMemberAddress,
  } = props;

  const {
    web3Reducer: {
      web3: { account, web3 },
    },
    syndicateInstanceReducer: { syndicateContractInstance },
    syndicatesReducer: { syndicate },
  } = useSelector((state: RootState) => state);

  const [
    showWalletConfirmationModal,
    setShowWalletConfirmationModal,
  ] = useState(false);

  const [validSyndicate, setValideSyndicate] = useState(false);

  const router = useRouter();
  const { syndicateAddress } = router.query;

  const dispatch = useDispatch();

  // no syndicate exists without a manager, so if no manager,
  // then syndicate does not exist
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

  // array of addresses whose deposit is to be rejected,
  // of maximum size equal to the maximum number of syndicate member.",
  const [memberAddresses, setMemberAddresses] = useState("");
  const [memberAddressesError, setMemberAddressesError] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const [rejectDepositState, setRejectDepositState] = useState(false);

  /**
   * Final state variables
   */
  const [finalStateButtonText, setFinalButtonText] = useState("Done");
  const [finalStateFeedback, setFinalStateFeedback] = useState(
    preApproveMoreAddress
  );
  const [finalStateHeaderText, setFinalStateHeaderText] = useState("");

  const [finalStateIcon, setFinalStateIcon] = useState(
    "/images/checkCircle.svg"
  );
  const [showFinalState, setShowFinalState] = useState(false);

  const handleCloseFinalStateModal = async () => {
    await dispatch(
      getSyndicateByAddress(syndicateAddress, syndicateContractInstance)
    );
    setShowFinalState(false);
  };

  const [allowanceAmount, setAllowanceAmount] = useState<number>(0);

  const [
    totalDepositsForMemberAddress,
    setTotalDepositsForMemberAddress,
  ] = useState(0);

  useEffect(() => {
    if (allowanceAmount < totalDepositsForMemberAddress) {
      setMemberAddressesError(
        `Insufficient allowance set. Please set additional allowance of ${
          totalDepositsForMemberAddress - allowanceAmount
        } ${
          syndicate.depositERC20TokenSymbol || ""
        } before rejecting member deposits.`
      );
    }
    return () => {
      setTotalDepositsForMemberAddress(0);
      setAllowanceAmount(0);
    };
  }, [totalDepositsForMemberAddress]);

  // Retrieve current allowance set on the managerAddress
  useEffect(() => {
    if (syndicate) {
      checkAccountAllowance(
        syndicate.depositERC20Address,
        syndicate.managerCurrent,
        syndicateContractInstance._address
      )
        .then((allowance) => {
          const allowanceInWei = getWeiAmount(
            allowance,
            syndicate.tokenDecimals,
            false
          );
          setAllowanceAmount(parseInt(allowanceInWei));
          if (allowanceInWei === 0) {
            setMemberAddressesError(
              "Please set sufficient allowance before rejecting deposits."
            );
          }
        })
        .catch((error) => console.log({ error }));
    }
  }, [syndicate, syndicateContractInstance]);

  /**
   * This method sets addresses whose deposits are going to be rejected.
   * It also validates the input value and set appropriate error message
   */
  const handleMemberAddressesChange = async (event) => {
    const { value } = event.target;

    // convert comma separated string into array
    const memberAddressesArray = sanitizeInputString(value).split(",");

    // get last element in array
    const lastElement = memberAddressesArray[memberAddressesArray.length - 1];

    // create new copy of split array with no duplicates
    const memberAddressesArrayCopy = Array.from(
      new Set<string>(memberAddressesArray)
    );

    // check if empty string
    if (!lastElement) {
      memberAddressesArrayCopy.pop();
    }

    let totalMemberAddressDeposits = 0;

    // validate addresses
    memberAddressesArrayCopy && memberAddressesArrayCopy.length
      ? memberAddressesArrayCopy.map(async (value: string) => {
          if (value === account) {
            setMemberAddressesError(
              `${value} is a manager account of this syndicate.`
            );
          } else if (web3.utils.isAddress(value)) {
            const { memberDeposits } = await getSyndicateMemberInfo(
              syndicateContractInstance,
              syndicateAddress,
              value,
              parseInt(syndicate.tokenDecimals || 18)
            );
            if (memberDeposits > 0) {
              setMemberAddressesError("");
              totalMemberAddressDeposits += memberDeposits;
              setTotalDepositsForMemberAddress(totalMemberAddressDeposits);
            } else {
              setMemberAddressesError(
                `${value} has not deposited into this syndicate.`
              );
            }
          } else if (!value.trim()) {
            setMemberAddressesError(
              `Entered value is not a valid etherium wallet address.`
            );
          } else {
            setMemberAddressesError(
              `${value} is not a valid etherium wallet address.`
            );
          }
        })
      : setMemberAddressesError("");

    // join the array to comma separated string
    setMemberAddresses(memberAddressesArray.join());
  };

  const handleError = (error, rejectDepositState = false) => {
    // capture metamask error
    setShowWalletConfirmationModal(false);
    setSubmitting(false);

    const { code } = error;
    const errorMessage = getMetamaskError(code, "Reject deposits");
    setFinalButtonText("Dismiss");
    setFinalStateIcon("/images/roundedXicon.svg");
    setFinalStateFeedback("");

    if (code == 4001) {
      setFinalStateHeaderText("");
      setFinalStateFeedback("You have cancelled the transaction.");
    } else if (code == undefined) {
      if (rejectDepositState) {
        setFinalStateFeedback(
          "An error occurred. Please ensure that you have set sufficient allowance before rejecting deposits."
        );
      } else {
        setFinalStateFeedback(
          "An error occurred. Click the button below to view logs on etherscan."
        );
      }
    } else {
      setFinalStateFeedback(errorMessage);
    }
    setShowFinalState(true);
  };

  /**
   * send data to reject deposits
   */
  const handleSubmitRejectDeposits = async () => {
    if (!validSyndicate) {
      throw "This syndicate does not exist and therefore we can't update its details.";
    }

    if (!memberAddresses) {
      setMemberAddressesError("Member address to reject deposits is required");

      return;
    }

    /**
     * If we are not connected and the form modal is open, user can trigger
     * creation of Syndicate. We therefore catch this here and request for
     * wallet connection.
     */
    if (!syndicateContractInstance) {
      // Request wallet connect
      return dispatch(showWalletModal());
    }

    try {
      const sanitizedMemberAddress = sanitizeInputString(memberAddresses);
      // convert comma separated string into array
      const memberAddressesArray = sanitizedMemberAddress.split(",");

      // create new copy of split array with no duplicates
      const memberAddressesArrayCopy = Array.from(
        new Set<string>(memberAddressesArray)
      );

      // get last element in array
      const lastElement =
        memberAddressesArrayCopy[memberAddressesArrayCopy.length - 1];

      // check if empty string
      if (!lastElement) {
        memberAddressesArrayCopy.pop();
      }

      setShowWalletConfirmationModal(true);

      // helps in determining which text to show on the state modals
      setRejectDepositState(true);

      await syndicateContractInstance.methods
        .managerRejectDepositForMembers(
          syndicateAddress,
          memberAddressesArrayCopy
        )
        .send({ from: account, gasLimit: 800000 })
        .on("transactionHash", () => {
          // close wallet confirmation modal
          setShowWalletConfirmationModal(false);
          setSubmitting(true);
        })
        .on("receipt", async () => {
          setSubmitting(false);

          setShowFinalState(true);
          setFinalStateFeedback(rejectMemberDeposit);
          setFinalStateIcon("/images/checkCircle.svg");
          setFinalButtonText("Done");
        })
        .on("error", (error) => {
          handleError(error, true);
        });
    } catch (error) {
      handleError(error, true);
    }
  };

  const {
    rejectDepositOrMemberAddressAdvice,
    rejectMemberDeposit,
    rejectMemberAddress,
    confirmRejectDepositsText,
    confirmBlockMemberAddressesText,
  } = rejectDepositOrMemberAddressConstants;

  /////////////////////////////////////////////////////////////////////////////
  ///// Component to black list member addresses //////////////////////////////
  /////////////////////////////////////////////////////////////////////////////

  // array of addresses whose deposit is to be rejected,
  // of maximum size equal to the maximum number of syndicate member.",
  const [memberAddressesToblackList, setMemberAddressesToBlackList] = useState(
    ""
  );
  const [
    memberAddressesToblackListError,
    setMemberAddressesToBlackListError,
  ] = useState<string>("");

  const handleMemberAddressesToBlacklistChange = async (event) => {
    const { value } = event.target;

    // convert comma separated string into array
    const memberAddressesToBlacklistArray = sanitizeInputString(value).split(
      ","
    );

    // get last element in array
    const lastElement =
      memberAddressesToBlacklistArray[
        memberAddressesToBlacklistArray.length - 1
      ];

    // create new copy of split array with no duplicates
    const memberAddressesToBlacklistArrayCopy = Array.from(
      new Set<string>(memberAddressesToBlacklistArray)
    );

    // check if empty string
    if (!lastElement) {
      memberAddressesToBlacklistArrayCopy.pop();
    }

    // validate addresses
    memberAddressesToBlacklistArrayCopy &&
    memberAddressesToBlacklistArrayCopy.length
      ? memberAddressesToBlacklistArrayCopy.map(async (value: string) => {
          if (value === account) {
            setMemberAddressesToBlackListError(
              `${value} is a manager account of this syndicate.`
            );
          } else if (web3.utils.isAddress(value)) {
            const { memberAddressAllowed } = await getSyndicateMemberInfo(
              syndicateContractInstance,
              syndicateAddress,
              value,
              parseInt(syndicate.tokenDecimals || 18)
            );
            if (memberAddressAllowed) {
              setMemberAddressesToBlackListError("");
            } else {
              setMemberAddressesToBlackListError(
                `${value} is already blacklisted.`
              );
            }
          } else if (!value.trim()) {
            setMemberAddressesToBlackListError(
              `Entered value is not a valid etherium wallet address.`
            );
          } else {
            setMemberAddressesToBlackListError(
              `${value} is not a valid etherium wallet address.`
            );
          }
        })
      : setMemberAddressesToBlackListError("");

    // join the array to comma separated string
    setMemberAddressesToBlackList(memberAddressesToBlacklistArray.join());
  };

  const handleSubmitBlackListMemberAddresses = async () => {
    if (!validSyndicate) {
      throw "This syndicate does not exist and therefore we can't update its details.";
    }

    if (!memberAddressesToblackList) {
      setMemberAddressesToBlackListError(
        "Member address to reject is required"
      );
      return;
    }

    /**
     * If we are not connected and the form modal is open, user can trigger
     * creation of Syndicate. We therefore catch this here and request for
     * wallet connection.
     */
    if (!syndicateContractInstance) {
      // Request wallet connect
      return dispatch(showWalletModal());
    }

    try {
      const sanitizedMemberAddressToBlacklist = sanitizeInputString(
        memberAddressesToblackList
      );
      // convert comma separated string into array
      const memberAddressesArrayToBlacklist = sanitizedMemberAddressToBlacklist.split(
        ","
      );

      // create new copy of split array with no duplicates
      const memberAddressesArrayToBlacklistCopy = Array.from(
        new Set<string>(memberAddressesArrayToBlacklist)
      );

      // get last element in array
      const lastElement =
        memberAddressesArrayToBlacklistCopy[
          memberAddressesArrayToBlacklistCopy.length - 1
        ];

      // check if empty string
      if (!lastElement) {
        memberAddressesArrayToBlacklistCopy.pop();
      }

      setShowWalletConfirmationModal(true);

      await syndicateContractInstance.methods
        .managerBlockAddresses(
          syndicateAddress,
          memberAddressesArrayToBlacklistCopy
        )
        .send({ from: account, gasLimit: 800000 })
        .on("transactionHash", () => {
          // close wallet confirmation modal
          setShowWalletConfirmationModal(false);
          setSubmitting(true);
        })
        .on("receipt", async () => {
          setSubmitting(false);

          setShowFinalState(true);
          setFinalStateFeedback(rejectMemberAddress);
          setFinalStateIcon("/images/checkCircle.svg");
          setFinalButtonText("Done");
        })
        .on("error", (error) => {
          handleError(error, false);
        });
    } catch (error) {
      handleError(error, false);
    }
  };

  return (
    <>
      <Modal
        {...{
          title: "Reject Deposits or Addresses",
          show: showRejectDepositOrMemberAddress,
          closeModal: () => setShowRejectDepositOrMemberAddress(false),
          customWidth: "sm:w-2/3",
        }}>
        <div className="mt-5 sm:mt-6 flex flex-col justify-center">
          <div>
            <div>
              <p className="text-blue-light font-whyte">Reject Deposits</p>
            </div>

            <div>
              <p className="text-gray-400 font-whyte">
                {rejectDepositOrMemberAddressAdvice}
              </p>
            </div>
            <div className="border-1 rounded-lg	bg-gray-99 mt-2 w-full flex py-6 pr-16">
              <div className="w-2/5 px-1 mt-6 text-sm">
                <p className="text-right font-whyte">Addresses:</p>
                <p className="text-right text-gray-400 font-whyte">
                  {separateWithCommas}
                </p>
              </div>
              <div className="w-3/5">
                <TextArea
                  {...{
                    name: "address(es)",
                    value: memberAddresses,
                    onChange: handleMemberAddressesChange,
                    error: memberAddressesError,
                  }}
                  defaultValue=""
                  name="approvedAddresses"
                  placeholder=""
                />
              </div>
            </div>
            <div className="flex items-center	justify-center pt-6">
              <button
                className={`bg-blue-light text-white py-2 px-10 rounded-full ${
                  memberAddressesError ? "cursor-not-allowed opacity-50" : null
                }`}
                onClick={handleSubmitRejectDeposits}
                disabled={memberAddressesError ? true : false}>
                Reject Deposits
              </button>
            </div>
          </div>

          {/* component for rejecting member addresses */}
          {syndicate?.allowlistEnabled ? (
            <div>
              <div>
                <p className="text-blue-light font-whyte">Reject Addresses</p>
              </div>

              <div>
                <p className="text-gray-400 font-whyte">
                  To ensure a certain address cannot deposit into this
                  syndicate, enter it in the field below.
                </p>
              </div>
              <div className="border-2 rounded-lg	bg-gray-99 mt-2 flex py-6 pr-16">
                <div className="w-3/5 px-1 mt-6 text-sm">
                  <p className="text-right font-whyte">Addresses:</p>
                  <p className="text-right text-gray-400 font-whyte">
                    {separateWithCommas}
                  </p>
                </div>
                <TextArea
                  {...{
                    name: "address(es)",
                    value: memberAddressesToblackList,
                    onChange: handleMemberAddressesToBlacklistChange,
                    error: memberAddressesToblackListError,
                  }}
                  defaultValue=""
                  name="approvedAddresses"
                  placeholder=""
                />
              </div>
              <div className="flex items-center	justify-center pt-6">
                <button
                  className={`bg-blue-light text-white	py-2 px-10 rounded-full ${
                    memberAddressesToblackListError
                      ? "cursor-not-allowed opacity-50"
                      : null
                  }`}
                  onClick={handleSubmitBlackListMemberAddresses}
                  disabled={memberAddressesToblackListError ? true : false}>
                  Reject Addresses
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </Modal>
      {/* Tell user to confirm transaction on their wallet */}
      <ConfirmStateModal show={showWalletConfirmationModal}>
        <div className="flex flex-col justify-centers m-auto mb-4">
          <p className="text-sm text-center mx-8 opacity-60">
            {rejectDepositState
              ? confirmRejectDepositsText
              : confirmBlockMemberAddressesText}
          </p>
          <p className="text-sm text-center mx-8 mt-2 opacity-60">
            {rejectTransactionText}
          </p>
        </div>
      </ConfirmStateModal>
      {/* Loading modal */}
      <PendingStateModal
        {...{
          show: submitting,
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
        feedbackText={finalStateFeedback}
        headerText={finalStateHeaderText}
        address={syndicateAddress.toString()}
      />
    </>
  );
};

export default RejectDepositOrMemberAddress;