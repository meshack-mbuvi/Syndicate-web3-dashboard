import { InputField } from "@/components/inputs/inputField";
import Modal, { ModalStyle } from "@/components/modal";
import { Spinner } from "@/components/shared/spinner";
import { getMetamaskError } from "@/helpers";
import {
  addMemberToSelectedMembers,
  setModifyingMemberDeposit,
  setSelectedMembers,
  showModifyOnChainDepositAmounts,
} from "@/redux/actions/manageActions";
import {
  addToSyndicateMembers,
  setNewMemberAddresses,
} from "@/redux/actions/manageMembers";
import { updateMemberActivityDetails } from "@/redux/actions/syndicateMemberDetails/memberActivityInfo";
import { updateMemberWithdrawalDetails } from "@/redux/actions/syndicateMemberDetails/memberWithdrawalsInfo";
import { getSyndicateByAddress } from "@/redux/actions/syndicates";
import { RootState } from "@/redux/store";
import { web3 } from "@/utils";
import { getWeiAmount } from "@/utils/conversions";
import { formatAddress } from "@/utils/formatAddress";
import { isZeroAddress } from "@/utils/validators";
import { isEmpty } from "lodash";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
/**
 * Provides an interface for managers to modify member deposits.
 */
const ModifyMemberDeposit = (): JSX.Element => {
  // retrieve state variables
  const {
    syndicatesReducer: { syndicate },
    web3Reducer: {
      web3: { account },
    },
    manageMembersDetailsReducer: {
      syndicateManageMembers: { syndicateMembers },
    },
    syndicateMemberDetailsReducer: { syndicateDistributionTokens },
    manageActionsReducer: {
      manageActions: { modifyOnChainDeposits, selectedMembers },
    },
    initializeContractsReducer: { syndicateContracts },
  } = useSelector((state: RootState) => state);

  const dispatch = useDispatch();
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorTitleMessage, setErrorTitleMessage] = useState("");
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [firstTransactionConfirmed, setFirstTransactionConfirmed] =
    useState(false);
  const [selectedMembersCopy, setSelectedMembersCopy] =
    useState(selectedMembers);

  useEffect(() => {
    setSelectedMembersCopy(selectedMembers);
    return () => {
      setSelectedMembersCopy([]);
    };
  }, [JSON.stringify(selectedMembers)]);

  const [processingMessage, setProcessingMessage] = useState("");
  const [processingTitle, setProcessingTitle] = useState("");

  const router = useRouter();
  const { syndicateAddress } = router.query;

  useEffect(() => {
    if (syndicateMembers?.length && syndicateDistributionTokens?.length) {
      const memberAddresses = syndicateMembers.map(
        ({ memberAddress }) => memberAddress,
      );

      dispatch(
        updateMemberWithdrawalDetails({
          syndicateAddress: syndicate?.syndicateAddress,
          distributionTokens: syndicateDistributionTokens,
          memberAddresses,
        }),
      );
    }
    if (syndicate && syndicateMembers?.length) {
      const memberAddresses = syndicateMembers.map(
        ({ memberAddress }) => memberAddress,
      );
      dispatch(
        updateMemberActivityDetails({
          syndicateAddress: syndicate?.syndicateAddress,
          distributionTokens: syndicateDistributionTokens
            ? syndicateDistributionTokens
            : [],
          depositToken: {
            tokenAddress: syndicate.depositERC20Address,
            tokenDecimals: syndicate.tokenDecimals,
            tokenSymbol: syndicate.depositERC20TokenSymbol,
          },
          memberAddresses,
        }),
      );
    }
  }, [syndicateMembers, syndicateDistributionTokens, syndicate]);

  const showWalletConfirmationModal = (status: boolean) => {
    setShowConfirmationModal(status);
  };

  const handleSubmitModifyingMemberDeposits = async (
    syndicateContracts,
    syndicateAddress: string,
    memberAddresses: string[],
    memberAmounts: string[],
    account: string,
    handleShowWalletConfirmationModal: (status: boolean) => void,
    handleSubmitting: (status: boolean) => void,
    handleReceipt: () => void,
  ): Promise<void> => {
    await syndicateContracts.DepositLogicContract.managerSetDepositForMembers(
      syndicateAddress,
      memberAddresses,
      memberAmounts,
      account,
      handleShowWalletConfirmationModal,
      handleSubmitting,
      handleReceipt,
    );
  };

  const handleFetchSyndicate = async () => {
    await dispatch(
      getSyndicateByAddress({
        syndicateAddress: web3.utils.toChecksumAddress(syndicateAddress),
        ...syndicateContracts,
      }),
    );
  };

  const handleModifyDeposit = async (memberAddresses, memberAmounts) => {
    try {
      setShowConfirmationModal(true);
      dispatch(showModifyOnChainDepositAmounts(false));
      await handleSubmitModifyingMemberDeposits(
        syndicateContracts,
        syndicateAddress.toString(),
        memberAddresses,
        memberAmounts,
        account,
        () => {
          showWalletConfirmationModal(false);
          setFirstTransactionConfirmed(false);
        },
        (status: boolean) =>
          dispatch(
            setModifyingMemberDeposit({
              memberAddresses,
              modifyingDeposits: status,
            }),
          ),
        () => {
          dispatch(setSelectedMembers([]));

          handleFetchSyndicate();
        },
      );
    } catch (error) {
      const { code } = error;
      dispatch(
        setModifyingMemberDeposit({
          memberAddresses,
          modifyingDeposits: false,
        }),
      );
      handleFetchSyndicate();
      setShowConfirmationModal(false);
      const errorMessage = getMetamaskError(code, "Member deposit modified");
      if (code == 4001) {
        setErrorMessage("You have cancelled the transaction.");
      } else {
        setErrorMessage(errorMessage);
      }
      setShowErrorModal(true);
    }
  };

  const handleAddMembersToAllowlist = async (event) => {
    event.preventDefault();
    const memberAddresses = [];
    const memberAmounts = [];

    selectedMembersCopy.forEach((member) => {
      memberAddresses.push(member.memberAddress);
      memberAmounts.push(
        getWeiAmount(
          member.newMemberDeposit?.toString(),
          syndicate.tokenDecimals,
          true,
        ),
      );
    });

    // Check whether there are any new members in the list.
    // New members needs to be added to allowlist first
    const newMembers = selectedMembers.filter(
      (member) => member.newMember === true,
    );

    if (newMembers.length) {
      // add new members to the allowlist first
      const newMemberAddresses = newMembers.map(
        (member) => member.memberAddress,
      );
      setProcessingTitle("Waiting for confirmation 1 of 2");
      setProcessingMessage(
        "Please confirm the transaction in your wallet. This will add the new address to your allowlist.",
      );

      setShowConfirmationModal(true);
      dispatch(showModifyOnChainDepositAmounts(false));

      try {
        await syndicateContracts.AllowlistLogicContract.managerAllowAddresses(
          syndicateAddress,
          newMemberAddresses,
          account,
          () => {
            setShowConfirmationModal(false);
            // show adding member to allowlist

            dispatch(addToSyndicateMembers(newMembers));
            dispatch(setNewMemberAddresses(newMemberAddresses, true));
          },
          () => {
            // This happens when transaction is completed/successful
            // A receipt event has been fired.
            // We therefore add the new members to syndicate members
            dispatch(setNewMemberAddresses(newMemberAddresses, false));

            // and modify their deposits
            setFirstTransactionConfirmed(true);
            setProcessingTitle("Waiting for confirmation 2 of 2");
            setProcessingMessage(
              "Please confirm the second transaction in your wallet. This will modify the deposit amounts.",
            );
            setShowConfirmationModal(true);
            handleModifyDeposit(memberAddresses, memberAmounts);
          },
        );
      } catch (error) {
        const { code } = error;
        setShowConfirmationModal(false);
        const errorMessage = getMetamaskError(code, "Add member to allowlist");
        if (code == 4001) {
          setErrorMessage("You have cancelled the transaction.");
        } else {
          setErrorMessage(errorMessage);
        }
        setShowErrorModal(true);
      }
    } else {
      setProcessingTitle("Waiting for confirmation");
      setProcessingMessage(
        "Please confirm the transaction in your wallet. This will modify the deposits amounts",
      );
      await handleModifyDeposit(memberAddresses, memberAmounts);
    }
  };

  const handleCancelModifyOnChainDepositModal = () => {
    dispatch(showModifyOnChainDepositAmounts(false));
  };

  const findDuplicateMemberAddress = (array, memberAddress) => {
    const duplicatedMemberItem = array.filter(
      (arrayItem) => arrayItem.memberAddress === memberAddress,
    );
    return duplicatedMemberItem.length > 1 ? true : false;
  };

  const handleAddNewMemberAddress = async (event, index) => {
    event.preventDefault();

    const { value } = event.target;
    const selectedMembers = selectedMembersCopy;
    selectedMembers[index].memberAddress = value;

    if (web3 && !web3.utils.isAddress(value)) {
      selectedMembers[index].addressError =
        "The address you have entered is not valid.";
    } else if (isZeroAddress(value)) {
      selectedMembers[index].addressError =
        "Member address cannot be zero address";
    } else if (findDuplicateMemberAddress(selectedMembers, value)) {
      selectedMembers[index].addressError =
        "This address already exists in this form.";
    } else if (value === syndicate?.managerCurrent) {
      selectedMembers[index].addressError =
        "Address must not be a manager of this Syndicate.";
    } else {
      selectedMembers[index].addressError = "";
    }
    dispatch(setSelectedMembers(selectedMembers));
  };

  const handleSetNewDepositAmounts = (event, index) => {
    event.preventDefault();
    const { value } = event.target;
    const selectedMembers = selectedMembersCopy;

    let message = "";
    if (+value < 0) {
      message = "Amount cannot be a negative number";
    } else if (+value < syndicate.depositMemberMin) {
      message = `Deposit amount is too low. The minimum allowed per member for 
      this syndicate is ${syndicate.depositMemberMin} ${syndicate.depositERC20TokenSymbol}.`;
    } else if (+value > syndicate.depositMemberMax) {
      message = `Deposit amount is too high. The maximum allowed per member for 
      this syndicate is ${syndicate.depositMemberMax} ${syndicate.depositERC20TokenSymbol}.`;
    } else if (+value === +selectedMembers[index].memberDeposit) {
      message = "New amount should not be same as current amount.";
    } else {
      message = "";
    }

    selectedMembers[index].newMemberDeposit = value;

    if (message) {
      selectedMembers[index].amountError = message;
    } else {
      selectedMembers[index].amountError = "";
    }

    dispatch(setSelectedMembers(selectedMembers));
  };

  const closeErrorModal = () => {
    setErrorMessage("");
    setErrorTitleMessage("");
    setShowErrorModal(false);
    handleFetchSyndicate();
  };

  useEffect(() => {
    // Check whether there is any member with invalid details(memberAddress for
    // the case of a new member, or 0/empty value for deposit)
    const membersWithError = selectedMembers.filter(
      (member) =>
        isEmpty(member?.memberAddress.trim()) ||
        !web3.utils.isAddress(member?.memberAddress) ||
        member?.newMemberDeposit == "" ||
        +member?.newMemberDeposit <= 0 ||
        member?.amountError ||
        member?.addressError ||
        !member?.newMemberDeposit ||
        +member?.newMemberDeposit === +member.memberDeposit,
    );

    setSubmitDisabled(membersWithError.length ? true : false);

    return () => {
      setSubmitDisabled(false);
    };
  }, [JSON.stringify(selectedMembers)]);

  // Adds new member item to the list of syndicate members
  const handleAddNewMember = (event) => {
    event.preventDefault();

    dispatch(
      addMemberToSelectedMembers({
        memberAddress: "",
        newMember: true,
      }),
    );
  };

  const removeMemberFromSelectedMembers = (event, index) => {
    event.preventDefault();
    const currentSelectedMembers = selectedMembersCopy;
    currentSelectedMembers.splice(index, 1);
    dispatch(setSelectedMembers(currentSelectedMembers));
  };

  return (
    <div className="w-full rounded-md h-full my-4">
      {/**Modify on chain Deposits Modal */}
      <Modal
        {...{
          show: modifyOnChainDeposits,
          modalStyle: ModalStyle.DARK,
          showCloseButton: false,
          customWidth: "w-2/5 justify-center",
          outsideOnClick: false,
          closeModal: handleCancelModifyOnChainDepositModal,
          showHeader: false,
          customClassName: "pr-8 py-8",
          overflow: "",
        }}
      >
        <div className="">
          <div className="hidden sm:block ">
            <div className="text-xl mb-4 ml-8">Modify Deposit Amounts</div>
            <div className="text-base ml-8 text-gray-lightManatee mb-8 pl-0.5">
              Fix on-chain inaccuracies by manually modifying the deposit
              amounts of members.
            </div>
            <div className="border-b-1 border-gray-syn7 absolute w-full"></div>

            <div className="pt-8 text-base">
              <div className="flex space-x-4 ml-8 justify-between mb-2 pl-0.5">
                <div className="flex py-auto space-x-4 align-middle w-3/4">
                  <div className="text-gray-lightManatee text-sm w-1/2 text-left">
                    Member Address
                  </div>
                  <div className="text-gray-lightManatee text-sm w-1/2 pl-5">
                    Deposit Amount
                  </div>
                </div>
                <div className="text-gray-lightManatee text-sm flex-grow text-centers pl-5">
                  Share
                </div>
              </div>

              <div className="max-h-104 flex-col overflow-y-scroll">
                {selectedMembersCopy.map((member, index) => {
                  return (
                    <div
                      key={index}
                      className={`flex align-center relative justify-between text-base`}
                    >
                      {member?.showInputField && (
                        <button
                          className="absolute top-6 left-2"
                          onClick={(event) =>
                            removeMemberFromSelectedMembers(event, index)
                          }
                        >
                          <Image
                            src="/images/close-gray-5.svg"
                            height={10}
                            width={20}
                          />
                        </button>
                      )}
                      <div className="flex flex-col w-full ml-9 border-b-1 py-2.5 border-gray-syn7">
                        <div className="flex space-x-4">
                          <div className="flex w-3/4 space-x-4 justify-between">
                            <div className="flex align-middle w-1/2 z-50">
                              {member?.showInputField ? (
                                <InputField
                                  label={""}
                                  {...{
                                    type: "text",
                                    placeholder: "0x...",
                                    value: member?.memberAddress,
                                    hasError: member?.addressError
                                      ? true
                                      : false,
                                    onChange: (event) =>
                                      handleAddNewMemberAddress(event, index),
                                  }}
                                />
                              ) : (
                                <p className="my-auto text-base font-whyte">
                                  {formatAddress(member?.memberAddress, 6, 6)}
                                </p>
                              )}
                            </div>
                            <div className="flex justify-around w-1/2">
                              <InputField
                                label={""}
                                {...{
                                  type: "number",
                                  placeholder: member?.memberDeposit,
                                  value: member.newMemberDeposit,
                                  addOn: syndicate?.depositERC20TokenSymbol,
                                  hasError: member?.amountError ? true : false,
                                  customClass: {
                                    addon: "text-gray-syn7",
                                  },
                                  onChange: (event) =>
                                    handleSetNewDepositAmounts(event, index),
                                }}
                              />
                            </div>
                          </div>
                          <div className="flex justify-centers my-auto flex-grow align-middle pl-5">
                            {member?.memberStake}%
                          </div>
                        </div>

                        {member?.addressError || member?.amountError ? (
                          <div>
                            <p className="text-red-semantic text-sm mt-1">
                              {member?.addressError}
                            </p>
                            <p className="text-red-semantic text-sm mt-1">
                              {member.amountError}
                            </p>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
                <div className="flex align-center space-x-4 ml-8 justify-between text-base">
                  <button
                    className="flex text-blue justify-center py-6"
                    onClick={(event) => handleAddNewMember(event)}
                  >
                    <img
                      src={"/images/plus-circle-blue.svg"}
                      alt="icon"
                      className="mr-3 mt-0.5"
                    />
                    <span>Add new member</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="flex justify-between mt-10 ml-8">
              <button
                className="flex text-center py-3 text-blue hover:opacity-80"
                onClick={() => handleCancelModifyOnChainDepositModal()}
              >
                <img
                  src={"/images/leftArrowBlue.svg"}
                  className="mt-1.5 mx-1"
                  alt="Back arrow"
                />
                Back
              </button>

              <button
                className={`${
                  submitDisabled
                    ? "secondary-CTA opacity-50 cursor-not-allowed"
                    : "primary-CTA hover:opacity-80"
                }}`}
                onClick={(event) => handleAddMembersToAllowlist(event)}
                disabled={submitDisabled ? true : false}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Tell user to confirm transaction on their wallet */}
      <Modal
        show={showConfirmationModal}
        modalStyle={ModalStyle.DARK}
        showCloseButton={false}
        customWidth="w-1/3"
      >
        <div className="flex flex-col justify-center m-auto mb-4">
          {firstTransactionConfirmed === true && (
            <p className="flex align-middle text-sm justify-center text-gray-syn4 mt-4">
              <Image
                src="/images/status/check.svg"
                alt="confirmed"
                height="16"
                width="16"
              />
              <span className="ml-2">First transaction confirmed</span>
            </p>
          )}

          <Spinner />
          <p className="text-lg text-center mt-8 mb-1">{processingTitle}</p>
          <div className="modal-header font-medium text-center leading-8 text-sm text-gray-syn4">
            {processingMessage}
          </div>
        </div>
      </Modal>

      {/* Error modal */}
      <Modal
        show={showErrorModal}
        modalStyle={ModalStyle.DARK}
        closeModal={closeErrorModal}
        outsideOnClick={true}
        customWidth="w-1/3"
      >
        <div className="flex flex-col justify-center m-auto mb-4">
          <Image
            src={"/images/errorClose.svg"}
            alt="Error image"
            height="50"
            width="50"
          />
          <p className="text-lg text-center mt-8 mb-1">{errorTitleMessage}</p>
          <div className="modal-header font-medium text-center leading-8 text-sm text-blue-rockBlue">
            {errorMessage}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ModifyMemberDeposit;
