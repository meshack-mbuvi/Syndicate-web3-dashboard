import { SearchForm } from "@/components/inputs/searchForm";
import Modal from "@/components/modal";
import { Spinner } from "@/components/shared/spinner";
import { getSyndicateDepostorData } from "@/redux/actions/manageMembers";
import { updateMemberWithdrawalDetails } from "@/redux/actions/syndicateMemberDetails/memberWithdrawalsInfo";
import { SET_SYNDICATE_MANAGE_MEMBERS } from "@/redux/actions/types";
import { RootState } from "@/redux/store";
import { formatAddress } from "@/utils/formatAddress";
import { floatedNumberWithCommas } from "@/utils/formattedNumbers";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MoreOptionButton from "./moreOptionButton";
import SyndicateMembersTable from "./SyndicateMembersTable";

interface ImanageMembers {
  showManageMembers: boolean;
  setShowManageMembers: (boolean) => void;
}

/**
 * Shows a modal with members who have deposited into a syndicate.
 * The modal has options based on whether syndicate is open to deposits or is
 * distributing.
 * For an open syndicate, we show Modify member deposists(depended on whether
 *  syndicate is modifiable or not.), Reject deposits and Reject addresses.
 *
 * For a distributing syndicate, we show modify member distributions on the options.
 * The component also shows a search field where manager can search a member address.
 * @returns
 */
const ManageMembers = (props: ImanageMembers): JSX.Element => {
  const { showManageMembers, setShowManageMembers } = props;

  // retrieve state variables
  const {
    syndicatesReducer: { syndicate },
    manageMembersDetailsReducer: {
      syndicateManageMembers: { syndicateMembers, loading },
    },
    syndicateMemberDetailsReducer: {
      memberWithdrawalDetails,
      syndicateDistributionTokens,
    },
  } = useSelector((state: RootState) => state);

  const dispatch = useDispatch();

  const handleCloseModal = () => {
    setShowManageMembers(false);
    dispatch({
      type: SET_SYNDICATE_MANAGE_MEMBERS,
      data: [],
    });
  };

  useEffect(() => {
    if (syndicateMembers?.length && syndicateDistributionTokens?.length) {
      const memberAddresses = syndicateMembers.map(
        ({ memberAddress }) => memberAddress,
      );

      dispatch(
        updateMemberWithdrawalDetails({
          syndicateAddress: syndicate.syndicateAddress,
          distributionTokens: syndicateDistributionTokens,
          memberAddresses,
        }),
      );
    }
  }, [syndicateMembers, syndicateDistributionTokens, syndicate]);

  // Retrieve syndicate depositors
  useEffect(() => {
    if (syndicate) {
      dispatch(getSyndicateDepostorData());
    }
  }, [syndicate]);

  let syndicateMembersToshow = syndicateMembers;
  const [filteredAddress, setFilteredAddress] = useState("");
  const filterAddressOnChangeHandler = (event) => {
    event.preventDefault();
    const { value } = event.target;
    setFilteredAddress(value.trim());
  };

  if (filteredAddress.trim()) {
    // search any text
    const regex = new RegExp(`${filteredAddress}`);
    syndicateMembersToshow = syndicateMembers.filter((member) =>
      regex.test(member.memberAddress),
    );
  }

  const tableData = syndicateMembersToshow.map((memberData) => ({
    ...{
      ...memberData,
      ...syndicate,
      memberWithdrawalDetails,
    },
  }));

  const columns = React.useMemo(
    () => [
      {
        Header: "Member Address",
        accessor: function (row) {
          const { memberAddress } = row;
          return formatAddress(memberAddress, 4, 4);
        },
      },
      {
        Header: "Deposit/stake",
        // eslint-disable-next-line react/display-name
        accessor: function ({
          memberDeposit,
          depositERC20TokenSymbol,
          memberStake,
        }) {
          return (
            <p className="">
              {floatedNumberWithCommas(memberDeposit)} {depositERC20TokenSymbol}
              <span className="ml-1 font-whyte-light text-gray-400">
                {memberStake}%
              </span>
            </p>
          );
        },
      },
      {
        Header: "Distribution/claimed",
        // eslint-disable-next-line react/display-name
        accessor: function ({
          memberWithdrawalDetails,
          memberAddress,
          distributing,
        }) {
          // distribution tokens are set only when syndicate is distributing
          // wait until memberWithdrawalDetails is set
          let enabledDistributionTokens = [];

          if (
            distributing &&
            !_.isEmpty(memberWithdrawalDetails[memberAddress])
          ) {
            enabledDistributionTokens = Object.keys(
              memberWithdrawalDetails[memberAddress],
            );
          }

          return (
            <div>
              {enabledDistributionTokens?.map((tokenSymbol) => (
                <>
                  <p className="">
                    {/* total member distributions */}
                    {
                      memberWithdrawalDetails[memberAddress][tokenSymbol]
                        .memberDistributionsToDate
                    }{" "}
                    {tokenSymbol}
                    {/* % of syndicates claimed(withdrawn) */}
                    <span className="ml-2 font-whyte-lights text-gray-400">
                      {memberWithdrawalDetails[memberAddress][tokenSymbol]
                        .memberWithdrawalsToDistributionsPercentage
                        ? memberWithdrawalDetails[memberAddress][tokenSymbol]
                            .memberWithdrawalsToDistributionsPercentage
                        : "0.00 %"}
                      {" %"}
                    </span>
                  </p>
                </>
              ))}
            </div>
          );
        },
      },
      {
        Header: " ",
        accessor: function moreOptions(row) {
          return <MoreOptionButton {...{ row }} />;
        },
      },
    ],
    [],
  );

  return (
    <>
      <Modal
        {...{
          title: "Manage Members",
          show: showManageMembers || true,
          closeModal: handleCloseModal,
          customWidth: "md:w-1/2 w-full",
          overflow: "overflow-x-visible ",
        }}
      >
        <div className="w-full rounded-md p-6 border border-gray-93">
          <form className="py-3">
            <SearchForm
              {...{
                onChangeHandler: filterAddressOnChangeHandler,
                searchValue: filteredAddress,
              }}
            />
          </form>
          {loading ? (
            <Spinner />
          ) : syndicateMembersToshow.length ? (
            <>
              <SyndicateMembersTable
                columns={columns}
                data={tableData}
                distributing={syndicate.distributing}
              />
            </>
          ) : (
            <div className="flex justify-center text-gray-500">
              {filteredAddress.trim()
                ? "Member address not found."
                : "Syndicate does not have investors."}
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default ManageMembers;
