import { InputWithTrailingIcon } from "@/components/inputs";
import { CustomSelectInputField } from "@/components/inputs/customSelectField";
import { TextInputWithControl } from "@/components/inputs/textFieldWithControl";
import Modal, { ModalStyle } from "@/components/modal";
import { Spinner } from "@/components/shared/spinner";
import { getMetamaskError } from "@/helpers";
import {
  setLoadingSyndicateDepositorDetails,
  setSelectedMember,
  setShowTransferDepositModal,
  setTransferringMemberDeposit,
} from "@/redux/actions/manageMembers";
import { getSyndicateByAddress } from "@/redux/actions/syndicates";
import { RootState } from "@/redux/store";
import { web3 } from "@/utils";
import { getWeiAmount } from "@/utils/conversions";
import { Validate } from "@/utils/validators";
import { isEmpty } from "lodash";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const DepositTransfer = (): JSX.Element => {
  // retrieve state variables
  const {
    syndicatesReducer: { syndicate },
    web3Reducer: {
      web3: { account },
    },
    manageMembersDetailsReducer: {
      syndicateManageMembers: {
        syndicateMembers,
        showTransferDepositModal,
        selectedMember,
      },
    },
    initializeContractsReducer: { syndicateContracts },
  } = useSelector((state: RootState) => state);

  const dispatch = useDispatch();
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorTitleMessage, setErrorTitleMessage] = useState("");

  const router = useRouter();
  const { syndicateAddress } = router.query;

  const closeErrorModal = () => {
    setErrorMessage("");
    setErrorTitleMessage("");
    setShowErrorModal(false);
    dispatch(setLoadingSyndicateDepositorDetails(false));
  };

  /****************************************************************************
   * Functionality for transferring member stakes from one address to another.*
   ****************************************************************************/

  const [memberTransferAmount, setMemberTransferAmount] = useState("0");
  const [maxAvailable, setMaxAvailable] = useState(0);
  const [amountErrorMessage, setAmountErrorMessage] = useState("");
  const [showInputField, setShowInputField] = useState(false);

  // member error messages
  const [toMemberAddressInputError, setToMemberAddressInputError] =
    useState("");
  const [toSelectedMemberAddressError, setSelectedMemberAddressError] =
    useState("");

  const [fromMemberSelectedAddressError, setFromMemberSelectedAddressError] =
    useState("");

  // Member receiving the deposits
  const [toMember, setSelectedToMember] = useState<{
    memberDeposit: string;
    memberAddress: string;
  }>({ memberDeposit: "0", memberAddress: "" });

  const [fromMemberSearchAddress, setFromMemberSearchAddress] = useState("");
  const [toMemberSearchAddress, setToMemberSearchAddress] = useState("");

  const [selectFromMembers, setSelectFromMembersData] =
    useState(syndicateMembers);
  const [selectToMembers, setSelectToMembersData] = useState(syndicateMembers);

  // Filter from member Addresses based on the search value
  useEffect(() => {
    const allMembers = [...syndicateMembers];

    if (fromMemberSearchAddress.trim()) {
      // search any text
      const filteredMembers = allMembers.filter((member) =>
        member.memberAddress.toLowerCase().includes(fromMemberSearchAddress),
      );
      setSelectFromMembersData(filteredMembers);
    } else {
      setSelectFromMembersData(allMembers);
    }
  }, [fromMemberSearchAddress, syndicateMembers]);

  // Filter to member Addresses based on the search value
  useEffect(() => {
    // list of members to show on the input for the receiving member should not
    // include fromMemberAddress
    const allMembers = [...syndicateMembers].filter(
      (selectedToMember) =>
        selectedToMember?.memberAddress !== selectedMember?.memberAddress,
    );

    if (toMemberSearchAddress.trim()) {
      const filteredMembers = allMembers.filter((member) =>
        member.memberAddress.toLowerCase().includes(toMemberSearchAddress),
      );

      setSelectToMembersData(filteredMembers);
    } else {
      setSelectToMembersData(allMembers);
    }
  }, [toMemberSearchAddress, syndicateMembers, selectedMember]);

  useEffect(() => {
    // set maxAvailableAmount to be the difference between memberDeposit and
    // syndicate depositMemberMin
    if (!isEmpty(syndicate) && !isEmpty(selectedMember)) {
      const memberDeposit = parseInt(selectedMember?.memberDeposit, 10);
      const depositMemberMin = parseInt(syndicate?.depositMemberMin, 10);
      const depositMemberMax = parseInt(syndicate?.depositMemberMax, 10);
      const maxAvailableFromMember = memberDeposit - depositMemberMin;

      const maxToReceiveMember =
        depositMemberMax - parseInt(toMember.memberDeposit, 10);
      if (memberDeposit == 0) {
        setMaxAvailable(0);
      } else if (maxToReceiveMember > maxAvailableFromMember) {
        setMaxAvailable(maxAvailableFromMember);
      } else {
        // Regardless of what needs to be transferred from previous member,
        // the new member can only take the maximum value allowed by the syndicate.
        setMaxAvailable(maxToReceiveMember);
      }
    }
    return () => {
      setMaxAvailable(0);
    };
  }, [syndicate, selectedMember, toMember]);

  /**
   * Called when the memberAddress from where deposits are transferred is changed.
   * @param event
   */
  const onSelectFromMemberHandler = (member) => {
    dispatch(setSelectedMember(member));
    setToMemberAddressInputError("");
    setAmountErrorMessage("");
    setSelectedMemberAddressError("");
    setFromMemberSelectedAddressError("");
  };

  const onSelectToMemberHandler = (member) => {
    setSelectedToMember(member);
    setToMemberAddressInputError("");
    setAmountErrorMessage("");
    setSelectedMemberAddressError("");
    setFromMemberSelectedAddressError("");
  };

  // clear search addresses
  const clearFromMemberSearchValue = (event) => {
    event.preventDefault();
    setFromMemberSearchAddress("");
    setToMemberAddressInputError("");
    setAmountErrorMessage("");
    setSelectedMemberAddressError("");
    setFromMemberSelectedAddressError("");
  };

  const clearToMemberSearchValue = (event) => {
    event.preventDefault();
    setToMemberSearchAddress("");
    setToMemberAddressInputError("");
    setAmountErrorMessage("");
    setSelectedMemberAddressError("");
    setFromMemberSelectedAddressError("");
  };

  // handlers for searching member address from which to initiate transfer, and
  // member address which will receive the transfer.
  // From member address
  const searchFromMemberAddressOnChangeHandler = (event: {
    preventDefault: () => void;
    target: { value: any };
  }) => {
    event.preventDefault();
    const { value } = event.target;
    setFromMemberSearchAddress(value.trim());
    setToMemberAddressInputError("");
    setAmountErrorMessage("");
    setSelectedMemberAddressError("");
    setFromMemberSelectedAddressError("");
  };

  // To member address
  const searchToMemberAddressOnChangeHandler = (event: {
    preventDefault: () => void;
    target: { value: any };
  }) => {
    event.preventDefault();
    const { value } = event.target;
    setToMemberSearchAddress(value.trim());
    setToMemberAddressInputError("");
    setAmountErrorMessage("");
    setSelectedMemberAddressError("");
    setToMemberAddressInputError("");
    setSelectedMemberAddressError("");
    setFromMemberSelectedAddressError("");
  };

  /**
   * handlers for amount-to-transfer input field
   */
  const handleSetMaxValue = (event) => {
    event.preventDefault();
    setMemberTransferAmount(maxAvailable.toString());
    setToMemberAddressInputError("");
    setAmountErrorMessage("");
    setSelectedMemberAddressError("");
    setFromMemberSelectedAddressError("");
  };

  const handleSetAllMemberDeposit = (event) => {
    event.preventDefault();
    setMemberTransferAmount(selectedMember?.memberDeposit || "0");
    setToMemberAddressInputError("");
    setAmountErrorMessage("");
    setSelectedMemberAddressError("");
  };

  const handleMemberAmountChange = (value) => {
    setMemberTransferAmount(value);
    setAmountErrorMessage("");
    setToMemberAddressInputError("");
    setSelectedMemberAddressError("");
  };

  const validateTransferDepositFields = () => {
    const { depositERC20TokenSymbol, depositMemberMax, depositMemberMin } =
      syndicate;
    // make sure selected address has deposits into this syndicate
    if (!isEmpty(selectedMember)) {
      if (parseFloat(selectedMember?.memberDeposit) == 0) {
        setFromMemberSelectedAddressError(
          "Selected member does not have any deposits.",
        );
        return false;
      } else {
        setFromMemberSelectedAddressError("");
      }
    }

    // Check whether amount is less 0
    const amountError = Validate(memberTransferAmount);
    if (amountError) {
      setAmountErrorMessage(`Amount ${amountError}`);
      return false;
    }
    const amountToTransfer = parseInt(memberTransferAmount.toString(), 10);
    const fromMemberCurrentDeposits = parseInt(
      selectedMember.memberDeposit,
      10,
    );
    const syndicateMinimumDeposit = parseInt(depositMemberMin, 10);

    if (amountToTransfer <= 0) {
      setAmountErrorMessage("Amount provided must be greater than 0");
      return false;
    }

    // Cannot transfer more than the member has
    if (amountToTransfer > parseInt(selectedMember.memberDeposit, 10)) {
      setAmountErrorMessage(
        "Amount selected is greater than current member deposits.",
      );
      return false;
    }

    const fromMemberRemainingDeposits =
      fromMemberCurrentDeposits - amountToTransfer;
    // remaining fromMemberDeposits should not violate syndicate terms
    if (
      fromMemberRemainingDeposits < syndicateMinimumDeposit &&
      fromMemberRemainingDeposits != 0
    ) {
      setAmountErrorMessage(
        `Transfer amount is too high. This member’s total deposits (${fromMemberRemainingDeposits} ${depositERC20TokenSymbol}) 
        will be below the minimum required for this syndicate (${depositMemberMin} ${depositERC20TokenSymbol}).
        You can transfer 100% of their deposits, but they will no longer be a member.`,
      );
      return false;
    }

    // valid amount to transfer
    // check whether member receiving deposits will violate syndicate limits
    if (!isEmpty(toMember)) {
      const recipientTotalDeposits =
        parseInt(toMember.memberDeposit, 10) + amountToTransfer;

      if (toMember.memberAddress.trim() === "") {
        setSelectedMemberAddressError(
          "Select a member address that will receive the deposits",
        );
        return false;
      } else if (recipientTotalDeposits > parseInt(depositMemberMax, 10)) {
        setAmountErrorMessage(
          `Transfer amount is too high. This amount will push the recipient’s 
          total deposits (${recipientTotalDeposits} ${depositERC20TokenSymbol}) 
          above the maximum allowed per member for this syndicate (${depositMemberMax} ${depositERC20TokenSymbol}).`,
        );
        return false;
      } else if (recipientTotalDeposits < parseInt(depositMemberMin, 10)) {
        setAmountErrorMessage(
          `Transfer amount is too low. The recipient’s resulting deposit amount 
          will be below the minimum required for this syndicate (${depositMemberMin} ${depositERC20TokenSymbol}).`,
        );
      } else if (!web3.utils.isAddress(toMember.memberAddress)) {
        // make sure provided toMember address is a valid ETH address for the case
        // where address comes from the input field
        setToMemberAddressInputError(
          "Provide address must be a valid Ethereum address.",
        );
        return false;
      }
    }

    // check that from and to Member is not the same address
    if (
      web3.utils.toChecksumAddress(selectedMember.memberAddress) ===
      web3.utils.toChecksumAddress(toMember.memberAddress)
    ) {
      setToMemberAddressInputError(
        "Recipient member address must be different from the sender address.",
      );
      setSelectedMemberAddressError(
        "Recipient member address must be different from the sender address.",
      );
      return false;
    }

    // if adding new member, check whether total member count will be exceeded
    const numMembersMax = parseInt(syndicate?.numMembersMax, 10);
    const memberExistInSyndicate =
      syndicateMembers.filter((member) =>
        web3.utils
          .toChecksumAddress(member.memberAddress)
          .includes(web3.utils.toChecksumAddress(toMember.memberAddress)),
      ).length > 0 ?? false;
    // member does not exist and adding a new member will exceed syndicate
    // number of allowed investors
    if (
      syndicateMembers.length + 1 > numMembersMax &&
      !memberExistInSyndicate
    ) {
      setToMemberAddressInputError(
        `This address isn’t associated with this syndicate. 
        Transferring deposits to a new address will make them a member of this
        syndicate. This syndicate has already reached its maximum member count (${numMembersMax}).`,
      );
      return false;
    }

    return true;
  };

  const handleShowInputField = (state: boolean) => {
    setShowInputField(state);
    setToMemberAddressInputError("");
    setAmountErrorMessage("");
    setSelectedMemberAddressError("");
    // clear toMember
    setSelectedToMember({ memberAddress: "", memberDeposit: "0" });
  };

  // icon on the input field to switch back to dropdown menu.
  const handleIconClick = (event) => {
    event.preventDefault();
    handleShowInputField(false);
    setToMemberAddressInputError("");
    setAmountErrorMessage("");
    setSelectedMemberAddressError("");
    setSelectedToMember({ memberAddress: "", memberDeposit: "0" });
  };

  const handleClearDepositTransferModalData = () => {
    dispatch(setSelectedMember(null));
    dispatch(setShowTransferDepositModal(false));
    setShowInputField(false);
    setMemberTransferAmount("0");
    setToMemberSearchAddress("");
    setFromMemberSearchAddress("");
    setSelectedToMember({ memberAddress: "", memberDeposit: "0" });
  };

  // Input field shown when user clicks add new member button
  const toMemberInputOnchangeHandler = (event) => {
    event.preventDefault();

    const { value } = event.target;
    setSelectedToMember({
      memberDeposit: "0",
      memberAddress: value,
    });
    setToMemberAddressInputError("");
    setAmountErrorMessage("");
    setSelectedMemberAddressError("");
  };

  const transferButtonDisable =
    amountErrorMessage ||
    toMemberAddressInputError ||
    fromMemberSelectedAddressError ||
    toSelectedMemberAddressError
      ? true
      : false;

  const onTxConfirm = () => {
    setShowConfirmationModal(false);
    dispatch(
      setTransferringMemberDeposit({
        memberAddress: selectedMember.memberAddress,
        transferringDeposit: true,
      }),
    );
  };

  const onTxReceipt = () => {
    // handle set submitting for the member address
    dispatch(
      getSyndicateByAddress({
        syndicateAddress: syndicateAddress.toString(),
        GetterLogicContract: syndicateContracts.GetterLogicContract,
      }),
    );
    handleClearDepositTransferModalData();
  };

  /**
   * Handles submission of deposit transfer to the smart contract.
   * All fields are reset after data is submitted.
   *
   * This function transfers all or a portion of member stakes to an existing
   * or new member.
   *
   * Note:
   * - This function must be called by a manager of the syndicate.
   * - The syndicate must be modifiable and also not distributing.
   * @param event
   */
  const handleTransferMemberDeposits = async (event) => {
    event.preventDefault();

    // do validation and proceed only when there is no error
    const valid = validateTransferDepositFields();

    if (!valid) return;
    const amountInWei = getWeiAmount(
      memberTransferAmount,
      syndicate.tokenDecimals,
      true,
    );

    dispatch(setShowTransferDepositModal(false));

    setShowConfirmationModal(true);

    // DepositTransferLogicContract
    try {
      await syndicateContracts.DepositTransferLogicContract.managerTransferDepositForMembers(
        syndicateAddress,
        selectedMember.memberAddress,
        web3.utils.toChecksumAddress(toMember.memberAddress),
        amountInWei,
        account,
        onTxConfirm,
        onTxReceipt,
      );
    } catch (error) {
      setShowConfirmationModal(false);
      const { code } = error;
      const errorMessage = getMetamaskError(code, "Deposit Transfer");
      setErrorMessage(errorMessage);
      setShowErrorModal(true);
      dispatch(
        setTransferringMemberDeposit({
          memberAddress: selectedMember.memberAddress,
          transferringDeposit: false,
        }),
      );
    }
  };

  return (
    <div className="w-full rounded-md h-full my-4">
      <div className="w-full px-2 py-2 sm:px-0">
        {/* Modal for transferring deposits */}
        <Modal
          {...{
            show: showTransferDepositModal,
            modalStyle: ModalStyle.DARK,
            showCloseButton: false,
            customWidth: "w-2/5",
            outsideOnClick: true,
            closeModal: () => dispatch(setShowTransferDepositModal(true)),
            customClassName: "p-8 -mx-4",
            showHeader: false,
            overflow: "overflow-y-scroll",
          }}
        >
          <div className="font-whyte">
            <div className="mb-4">
              <span className="text-xl font-whyte leading-6 text-white">
                Transfer Holdings
              </span>
            </div>

            <div className="space-y-8">
              <span className="text-base text-gray-lightManatee leading-5">
                You can transfer this member’s holdings to a different
                allowlisted wallet address.
              </span>

              {/* Transfer from this member address */}
              <CustomSelectInputField
                {...{
                  showNewMemberButton: false,
                  onSelectHandler: onSelectFromMemberHandler,
                  searchAddress: fromMemberSearchAddress,
                  clearSearchValue: clearFromMemberSearchValue,
                  selected: selectedMember,
                  label: "Transfer from",
                  data: selectFromMembers,
                  filterAddressOnChangeHandler:
                    searchFromMemberAddressOnChangeHandler,
                  error: fromMemberSelectedAddressError,
                }}
              />

              {/* input for amount to transfer */}
              <TextInputWithControl
                label="Amount to transfer"
                name="Amount to transfer"
                {...{
                  maxAvailable,
                  handleSetMaxValue,
                  errorMessage: amountErrorMessage,
                  onChangeHandler: (event) => handleMemberAmountChange(event),
                  storedValue: memberTransferAmount,
                  handleSetAllMemberDeposit,
                  memberDeposits: selectedMember?.memberDeposit || "0",
                  tokenSymbol: syndicate?.depositERC20TokenSymbol || "USDC",
                  placeholder: `0 ${syndicate?.depositERC20TokenSymbol}`,
                  tooltip:
                    "Maximum amount of funds that can be transferred without violating syndicate limits.",
                }}
              />

              {/* Transfer stakes to this new member */}

              {showInputField ? (
                <InputWithTrailingIcon
                  {...{
                    name: "toMemberAddress",
                    value: toMember?.memberAddress,
                    handleIconClick,
                    label: "Transfer to",
                    icon: "/images/selectorIcon.svg",
                    error: toMemberAddressInputError,
                    placeholder: "0x...",
                    onChangeHandler: toMemberInputOnchangeHandler,
                  }}
                />
              ) : (
                <CustomSelectInputField
                  {...{
                    showInputField: handleShowInputField,
                    showNewMemberButton: true,
                    onSelectHandler: onSelectToMemberHandler,
                    searchAddress: toMemberSearchAddress,
                    selected: toMember,
                    clearSearchValue: clearToMemberSearchValue,
                    label: "Transfer to",
                    data: selectToMembers,
                    placeholder: "Select member",
                    filterAddressOnChangeHandler:
                      searchToMemberAddressOnChangeHandler,
                    error: toSelectedMemberAddressError,
                  }}
                />
              )}

              {parseInt(memberTransferAmount, 10) ===
                parseInt(selectedMember?.memberDeposit, 10) &&
                parseInt(selectedMember?.memberDeposit, 10) !== 0 && (
                  <div className="bg-yellow-semantic bg-opacity-10 py-4 px-5 rounded-md">
                    <p
                      className={`text-xs text-yellow-semantic leading-4 font-whyte`}
                    >
                      By transferring 100% of this member’s deposits to another
                      address, they will be removed as a member of this
                      syndicate.
                    </p>
                  </div>
                )}

              <div className="flex justify-end">
                <button
                  className="text-gray-lightManatee hover:opacity-80"
                  onClick={() => handleClearDepositTransferModalData()}
                >
                  Cancel
                </button>
                <button
                  className={`primary-CTA ml-8 ${
                    transferButtonDisable
                      ? "cursor-not-allowed bg-gray-steelGrey text-gray-4"
                      : "hover:opacity-90"
                  }`}
                  onClick={handleTransferMemberDeposits}
                  disabled={transferButtonDisable}
                >
                  Transfer
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
          // passing empty string to remove default classes
          customClassName=""
        >
          {/* -mx-4 is used to revert the mx-4 set on parent div on the modal */}
          <div className="flex flex-col justify-center py-10 -mx-4 px-8">
            {/* passing empty margin to remove the default margin set on spinner */}
            <Spinner margin="" />
            <p className="text-xl text-center mt-10 mb-4 leading-6 text-white font-whyte">
              Waiting for confirmation
            </p>
            <div className="font-whyte text-center leading-5 text-base text-gray-lightManatee">
              Please confirm the transaction in your wallet.
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
    </div>
  );
};

export default DepositTransfer;
