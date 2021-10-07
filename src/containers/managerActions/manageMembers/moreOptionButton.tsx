import { showConfirmBlockMemberAddress } from "@/redux/actions/manageActions";
import {
  setSelectedMemberAddress,
  showConfirmReturnDeposit,
} from "@/redux/actions/manageMembers";
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
  } = props.row;

  const dispatch = useDispatch();

  const showMoreInfoOptions = open || (distributing && modifiable);

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

  return (
    <>
      {showMoreInfoOptions === true && (
        <div className="flex space-x-6 justify-end items-center">
          {!distributing && (
            <div>
              <button
                className="cursor-pointer hover:opacity-70 pt-2"
                data-tip
                data-for="edit-member-deposit"
              >
                <img src="/images/edit-deposit.svg" alt="edit member deposit" />
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
            </div>
          )}
          {memberDeposit !== "0" && (
            <div>
              <button
                className={`cursor-pointer pt-2 ${
                  memberDeposit == "0" ? "opacity-40" : "hover:opacity-70"
                }`}
                onClick={() => confirmReturnMemberDeposit()}
                data-tip
                data-for="return-member-deposit"
                disabled={memberDeposit == "0" ? true : false}
              >
                <img
                  src="/images/return-deposits.svg"
                  alt="Return member deposit"
                />
              </button>
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
          )}

          {(distributing == false &&
            allowlistEnabled &&
            memberAddressAllowed) === true && (
            <div>
              <button
                className="cursor-pointer hover:opacity-70 pt-2"
                data-tip
                data-for="block-address"
                onClick={() => confirmBlockMemberAddress()}
              >
                <img src="/images/block-address.svg" alt="Block address" />
              </button>
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
          )}
        </div>
      )}
    </>
  );
};

export default MoreOptionButton;
