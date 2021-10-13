import {
  setSelectedMembers,
  showConfirmBlockMemberAddress,
  showModifyOnChainDepositAmounts,
} from "@/redux/actions/manageActions";
import {
  setSelectedMember,
  setSelectedMemberAddress,
  setShowTransferDepositModal,
  showConfirmReturnDeposit,
} from "@/redux/actions/manageMembers";
import Image from "next/dist/client/image";
import React from "react";
import { useDispatch } from "react-redux";
import ReactTooltip from "react-tooltip";
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
    allowlistEnabled;
    transferringDeposit: boolean;
  };
}): JSX.Element => {
  const {
    distributing,
    memberAddress,
    memberDeposit,
    modifiable,
    open,
    memberAddressAllowed,
    allowlistEnabled,
    transferringDeposit,
  } = props.row;

  const dispatch = useDispatch();

  const confirmReturnMemberDeposit = () => {
    dispatch(showConfirmReturnDeposit(true));
    dispatch(
      setSelectedMemberAddress([memberAddress], parseInt(memberDeposit, 10)),
    );
  };

  const confirmBlockMemberAddress = () => {
    dispatch(showConfirmBlockMemberAddress(true));
    dispatch(
      setSelectedMemberAddress([memberAddress], parseInt(memberDeposit, 10)),
    );
  };

  const handleShowModifyOnChainDepositAmounts = (member) => {
    dispatch(setSelectedMembers([member]));
    dispatch(showModifyOnChainDepositAmounts(true));
  };

  const setSelectedFromMember = () => {
    dispatch(setSelectedMember(props.row));
    dispatch(setShowTransferDepositModal(true));
  };

  return (
    <div className="flex space-x-4 justify-end p-1">
      {modifiable && open && !distributing ? (
        <>
          <button
            className="cursor-pointer hover:opacity-70"
            data-tip
            data-for="edit-member-deposit"
            onClick={() => handleShowModifyOnChainDepositAmounts(props.row)}
          >
            <Image
              src="/images/edit-deposit.svg"
              alt="edit member deposit"
              width={14}
              height={14}
            />
          </button>
          <div className="opacity-100">
            <ReactTooltip
              id="edit-member-deposit"
              place="top"
              effect="solid"
              className="actionsTooltip"
              arrowColor="transparent"
              backgroundColor="#222529"
            >
              Modify on-chain deposit amount
            </ReactTooltip>
          </div>
        </>
      ) : null}

      {!distributing &&
        modifiable &&
        allowlistEnabled &&
        memberDeposit !== "0" && (
          <>
            <button
              className={`${
                transferringDeposit
                  ? "cursor-not-allowed opacity-60"
                  : "cursor-pointer hover:opacity-70"
              }`}
              data-tip
              data-for="transfer-member-deposit"
              onClick={setSelectedFromMember}
              disabled={transferringDeposit ? true : false}
            >
              <Image
                src="/images/managerActions/transfer_deposit.svg"
                alt="transfer-member-deposit"
                height={16}
                width={13}
              />
            </button>
            <div className="opacity-100">
              <ReactTooltip
                id="transfer-member-deposit"
                place="top"
                effect="solid"
                className="actionsTooltip"
                arrowColor="transparent"
                backgroundColor="#222529"
              >
                Transfer member deposit
              </ReactTooltip>
            </div>
          </>
        )}

      {open && memberDeposit !== "0" && (
        <>
          <button
            className={`${
              transferringDeposit
                ? "cursor-not-allowed opacity-60"
                : "cursor-pointer hover:opacity-70"
            }`}
            onClick={() => confirmReturnMemberDeposit()}
            data-tip
            data-for="return-member-deposit"
            disabled={memberDeposit == "0" ? true : false}
          >
            <Image
              src="/images/return-deposits.svg"
              alt="Return member deposit"
              height={16}
              width={16}
            />
          </button>
          <div className="opacity-100">
            <ReactTooltip
              id="return-member-deposit"
              place="top"
              effect="solid"
              className="actionsTooltip"
              arrowColor="transparent"
              backgroundColor="#222529"
            >
              Return all deposits
            </ReactTooltip>
          </div>
        </>
      )}

      {(distributing == false && allowlistEnabled && memberAddressAllowed) ===
        true && (
        <>
          <button
            className="cursor-pointer hover:opacity-70"
            data-tip
            data-for="block-address"
            onClick={() => confirmBlockMemberAddress()}
          >
            <Image
              src="/images/block-address.svg"
              alt="Block address"
              height={16}
              width={16}
            />
          </button>
          <div className="opacity-100">
            <ReactTooltip
              id="block-address"
              place="top"
              effect="solid"
              className="actionsTooltip"
              arrowColor="transparent"
              backgroundColor="#222529"
            >
              Block address
            </ReactTooltip>
          </div>
        </>
      )}
    </div>
  );
};

export default MoreOptionButton;
