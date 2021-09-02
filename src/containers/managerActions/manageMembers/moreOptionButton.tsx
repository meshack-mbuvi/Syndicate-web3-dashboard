import Modal, { ModalStyle } from "@/components/modal";
import {
  setSelectedMemberAddress,
  setShowModifyCapTable,
  setShowModifyMemberDistributions,
  setShowRejectDepositOrMemberAddress,
} from "@/redux/actions/manageActions";
import {
  setShowRejectAddressOnly,
  setShowRejectDepositOnly,
} from "@/redux/actions/manageMembers";
import React, { useState } from "react";
import { useDispatch } from "react-redux";

/**
 * Shows the following member details:
 *  - member address - formatted with elipses
 *  - member deposits/stakes - amount member deposited and % stake in the syndicate
 *  - member total distributions and % of claimed versus withdrawn
 *  - Options to modify/reject member deposits/address
 * @returns JSX element
 */
const MoreOptionButton = (props: {
  row: {
    distributing: boolean;
    memberAddress: string;
    memberDeposit: string;
    modifiable: boolean;
    open: boolean;
    memberAddressAllowed;
  };
}): JSX.Element => {
  const {
    distributing,
    memberAddress,
    memberDeposit,
    modifiable,
    open,
    memberAddressAllowed,
  } = props.row;
  const dispatch = useDispatch();

  const [hoveredRow, setHoveredRow] = useState(null);

  const [showMore, setShowMore] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const showMoreInfoOptions = open || (distributing && modifiable);

  const toggleShowMore = () => setShowMore(!showMore);

  const handleSetShowModifyMemberDistributions = (show: boolean) => {
    dispatch(setSelectedMemberAddress(memberAddress));
    dispatch(setShowModifyMemberDistributions(show));
  };

  /**
   * Sets controller variable for modifySyndicateCapTable modal to true and
   * selected member address to the address of the clicked row.
   * @param event
   */
  const handleSetShoModifySyndicateCapTable = (event) => {
    event.preventDefault();
    dispatch(setSelectedMemberAddress(memberAddress));
    dispatch(setShowModifyCapTable(true));
  };

  const handleSetRejectMemberDeposit = (event) => {
    event.preventDefault();
    // show only reject address option on the modal
    dispatch(setShowRejectDepositOnly(true));
    dispatch(setShowRejectAddressOnly(false));

    dispatch(setSelectedMemberAddress(memberAddress));
    dispatch(setShowRejectDepositOrMemberAddress(true));
  };

  const handleSetRejectMemberAddress = (event) => {
    event.preventDefault();
    // show only reject address option on the modal
    dispatch(setShowRejectAddressOnly(true));
    dispatch(setShowRejectDepositOnly(false));

    dispatch(setSelectedMemberAddress(memberAddress));
    dispatch(setShowRejectDepositOrMemberAddress(true));
  };

  const confirmReturnMemberDeposit = () => {
    setShowConfirmModal(true);
  };

  return (
    <>
      {showMoreInfoOptions === true && (
        <div className="flex space-x-4">
          <button className="cursor-pointer hover:opacity-70">
            <img src="/images/edit-deposit.svg" alt="edit member deposit" />
          </button>
          <button
            className="cursor-pointer hover:opacity-70"
            onClick={() => confirmReturnMemberDeposit()}
          >
            <img
              src="/images/return-deposits.svg"
              alt="Return member deposit"
            />
          </button>
          <button className="cursor-pointer hover:opacity-70">
            <img src="/images/block-address.svg" alt="Block address" />
          </button>
        </div>
      )}

      <Modal
        {...{
          show: showConfirmModal,
          closeModal: () => setShowConfirmModal(false),
          modalStyle: ModalStyle.DARK,
          title: "Are you sure?",
          showCloseButton: false,
        }}
      >
        <div>test</div>
      </Modal>
    </>
  );
};

export default MoreOptionButton;
