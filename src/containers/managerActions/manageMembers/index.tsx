import Modal, { ModalStyle } from "@/components/modal";
import { Spinner } from "@/components/shared/spinner";
import { getSyndicateDepostorData } from "@/redux/actions/manageMembers";
import { updateMemberWithdrawalDetails } from "@/redux/actions/syndicateMemberDetails/memberWithdrawalsInfo";
import { SET_SYNDICATE_MANAGE_MEMBERS } from "@/redux/actions/types";
import { RootState } from "@/redux/store";
import { formatAddress } from "@/utils/formatAddress";
import { floatedNumberWithCommas } from "@/utils/formattedNumbers";
import { Tab } from "@headlessui/react";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MoreOptionButton from "./moreOptionButton";

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
  const tabCategories = ["Allowlist", "Requests"];

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
        Header: "Distribution share",
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
          show: showManageMembers || true,
          closeModal: handleCloseModal,
          customWidth: "md:w-1/2 w-full",
          overflow: "overflow-x-visible ",
          modalStyle: ModalStyle.DARK,
          showCloseButton: false,
          outsideOnClick: true,
        }}
      >
        <div className="w-full rounded-md h-full lg:h-96">
          <div>
            <p className="font-whyte mb-4 text-xl">Manage members</p>
          </div>
          <div>
            <p className="font-whyte text-blue-rockBlue">
              From this modal, you can manage existing members, add new ones to
              your allowlist, and reject or allow approval requests.
            </p>
          </div>
          <div className="w-full px-2 py-4 sm:px-0">
            <Tab.Group defaultIndex={0}>
              <Tab.List className="flex space-x-6 border-gray-nightrider border-b-1">
                {tabCategories.map((tabCategory) => (
                  <Tab
                    key={tabCategory}
                    className={({ selected }) =>
                      `-mb-0.5 ${
                        selected
                          ? "text-white border-b-1"
                          : "text-blue-rockBlue"
                      }`
                    }
                  >
                    {tabCategory}
                    {` (0)`}
                  </Tab>
                ))}
              </Tab.List>
              <Tab.Panels className="font-whyte text-blue-rockBlue">
                <Tab.Panel>
                  {loading ? (
                    <Spinner />
                  ) : !syndicateMembersToshow.length ? (
                    <>Show members here</>
                  ) : (
                    <div className="flex justify-center">
                      <div className="my-10">
                        <div className="flex flex-col space-y-4">
                          <p>
                            No members have been added to this syndicate’s
                            allowlist yet.
                          </p>
                          <button className="flex text-blue-600 justify-center py-1">
                            <img
                              src={"/images/plus-circle-blue.svg"}
                              alt="icon"
                              className="mr-3 mt-0.5"
                            />
                            <span>Add members</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </Tab.Panel>
                <Tab.Panel>
                  <div className="flex justify-center">
                    <div className="my-10">
                      <div>
                        <p>
                          Members who have requested to be added to allowlist
                        </p>
                      </div>
                    </div>
                  </div>
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>

          {/* <form className="py-3">
            <SearchForm
              {...{
                onChangeHandler: filterAddressOnChangeHandler,
                searchValue: filteredAddress,
              }}
            />
          </form> */}
          {/* {loading ? (
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
          )} */}
        </div>
      </Modal>
    </>
  );
};

export default ManageMembers;
