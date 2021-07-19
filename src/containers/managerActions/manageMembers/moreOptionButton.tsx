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

  const [showMore, setShowMore] = useState(false);

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

  return (
    <>
      {showMoreInfoOptions === true && (
        <div className="relative">
          <button onClick={toggleShowMore} className="px-2">
            <img src="/images/more_horiz.svg" alt="Icon to show more options" />

            {/* more actions options to member address */}
            {showMore === true && (
              <div className="flex flex-col absolute shadow shadow-lg border border-gray-93 bg-white rounded-lg w-max z-50">
                {open === true && (
                  <>
                    {modifiable === true && (
                      <button
                        className={`block text-left px-4 py-2 hover:bg-gray-200 first:rounded-t-md last:rounded-b-md`}
                        onClick={handleSetShoModifySyndicateCapTable}
                      >
                        Modify Deposit Amount
                      </button>
                    )}

                    {memberDeposit.trim() !== "0" && (
                      <button
                        className={`block text-left px-4 py-2 hover:bg-gray-200 first:rounded-t-md last:rounded-b-md`}
                        onClick={handleSetRejectMemberDeposit}
                      >
                        Reject Deposits
                      </button>
                    )}

                    {memberAddressAllowed === true && (
                      <button
                        className={`block flex-1 flex-grow text-left px-4 py-2 hover:bg-gray-200 first:rounded-t-md last:rounded-b-md`}
                        onClick={handleSetRejectMemberAddress}
                      >
                        Reject Address
                      </button>
                    )}
                  </>
                )}

                {/* case for when syndicate is distributing and is modifiable */}
                {distributing === true && modifiable === true && (
                  <button
                    className={`block flex-1 flex-grow text-left px-4 py-2 hover:bg-gray-200 first:rounded-t-md last:rounded-b-md`}
                    onClick={() => handleSetShowModifyMemberDistributions(true)}
                  >
                    Modify Distribution Amounts
                  </button>
                )}
              </div>
            )}
          </button>
        </div>
      )}
    </>
  );
};

export default MoreOptionButton;
