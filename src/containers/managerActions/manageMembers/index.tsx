import Modal, { ModalStyle } from "@/components/modal";
import { Spinner } from "@/components/shared/spinner";
import { getMetamaskError } from "@/helpers";
import { checkAccountAllowance } from "@/helpers/approveAllowance";
import {
  getSyndicateDepositorData,
  setLoadingSyndicateDepositorDetails,
  setReturningMemberDeposit,
  setSelectedMemberAddress,
  showConfirmReturnDeposit,
} from "@/redux/actions/manageMembers";
import { updateMemberWithdrawalDetails } from "@/redux/actions/syndicateMemberDetails/memberWithdrawalsInfo";
import { getSyndicateByAddress } from "@/redux/actions/syndicates";
import { RootState } from "@/redux/store";
import { web3 } from "@/utils";
import { getWeiAmount } from "@/utils/conversions";
import { formatAddress } from "@/utils/formatAddress";
import { floatedNumberWithCommas } from "@/utils/formattedNumbers";
import { Tab } from "@headlessui/react";
import _ from "lodash";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PreApproveDepositor from "../preApproveDepositor";
import MoreOptionButton from "./moreOptionButton";
import { handleSubmitReturnDeposits } from "./sharedLogicFunctions";
import SyndicateMembersTable from "./SyndicateMembersTable";

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
const ManageMembers = (): JSX.Element => {
  // retrieve state variables
  const {
    syndicatesReducer: { syndicate },
    web3Reducer: {
      web3: { account },
    },
    manageMembersDetailsReducer: {
      syndicateManageMembers: {
        syndicateMembers,
        confirmReturnDeposit,
        memberAddresses,
        totalAmountToReturn,
        loading,
      },
    },
    syndicateMemberDetailsReducer: {
      memberWithdrawalDetails,
      syndicateDistributionTokens,
    },
    initializeContractsReducer: { syndicateContracts },
  } = useSelector((state: RootState) => state);
  const [showPreApproveDepositor, setShowPreApproveDepositor] = useState(false);
  const [addingMember, setAddingMember] = useState(false);

  const dispatch = useDispatch();
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorTitleMessage, setErrorTitleMessage] = useState("");

  const router = useRouter();
  const { syndicateAddress } = router.query;

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
      dispatch(getSyndicateDepositorData());
    }
  }, [syndicate]);

  const [filteredAddress, setFilteredAddress] = useState("");

  const filterAddressOnChangeHandler = (event: {
    preventDefault: () => void;
    target: { value: any };
  }) => {
    event.preventDefault();
    const { value } = event.target;
    setFilteredAddress(value.trim());
  };

  const getTableData = () => {
    const res = syndicateMembersToshow.map((memberData) => ({
      ...{
        ...memberData,
        ...syndicate,
        memberWithdrawalDetails,
      },
    }));
    return res;
  };

  const [syndicateMembersToshow, setSynMembersToShow] =
    useState(syndicateMembers);
  const [tableData, setTableData] = useState(getTableData());

  const generateTableData = () => {
    const allMembers = syndicateMembers.concat(newSyndicateMembers);

    if (filteredAddress.trim()) {
      // search any text
      const regex = new RegExp(`${filteredAddress}`);
      const filteredMembers = allMembers.filter((member) =>
        regex.test(member.memberAddress),
      );
      setSynMembersToShow(filteredMembers);
    } else {
      setSynMembersToShow(allMembers);
    }
  };

  useEffect(() => {
    generateTableData();
  }, [newSyndicateMembers]);

  useEffect(() => {
    const tableDetails = getTableData();
    setTableData(tableDetails);
  }, [syndicateMembersToshow]);

  const showApproveModal = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowPreApproveDepositor(true);
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "Member",
        accessor: function memberAddress(row: { memberAddress: string }) {
          const { memberAddress } = row;
          return (
            <div className="flex space-x-3 align-center text-base my-1 leading-6">
              <Image
                width="32"
                height="32"
                src={"/images/user.svg"}
                alt="user"
              />
              <p className="mt-1">{formatAddress(memberAddress, 6, 6)}</p>
            </div>
          );
        },
      },
      {
        Header: `Deposit Amount (${syndicate?.depositERC20TokenSymbol})`,
        accessor: function depositAmount({ memberDeposit, returningDeposit }) {
          if (returningDeposit)
            return (
              <p className="flex opacity-70">
                <Spinner height="h-4" width="w-4" />
                <span className="ml-2 text-gray-lightManatee">
                  Returning deposit
                </span>
              </p>
            );
          return <p className="">{floatedNumberWithCommas(memberDeposit)}</p>;
        },
      },
      {
        Header: `Distribution Share`,
        accessor: function distributionShare({ memberStake }) {
          return (
            <p className="">
              <span className="ml-1 font-whyte-light text-gray-400">
                {memberStake}%
              </span>
            </p>
          );
        },
      },
      {
        Header: "Distribution/claimed",
        accessor: function distributionClaimed({
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
          const { memberAddressAllowed, allowlistEnabled } = row;
          if (!memberAddressAllowed && allowlistEnabled && addingMember) {
            return (
              <span className="flex items-center">
                <Spinner height="h-4" width="w-4" margin="my-0" />
                <span className="ml-2 text-gray-400 leading-6">
                  Adding Member
                </span>
              </span>
            );
          }
          return <MoreOptionButton {...{ row }} />;
        },
      },
    ],
    [],
  );

  const showWalletConfirmationModal = (status: boolean) => {
    setShowConfirmationModal(status);
  };

  const handleResetMemberBalances = async () => {
    await dispatch(
      getSyndicateByAddress({
        syndicateAddress: web3.utils.toChecksumAddress(syndicateAddress),
        ...syndicateContracts,
      }),
    );
  };

  const handleReturnDeposits = async () => {
    // check whether there is sufficient allowance before continuing
    const allowance = await checkAccountAllowance(
      syndicate.depositERC20Address,
      syndicate.managerCurrent,
      syndicateContracts.DepositLogicContract._address,
    );
    const allowanceInWei = parseInt(
      getWeiAmount(allowance, syndicate.tokenDecimals, false),
      10,
    );

    if (!memberAddresses) {
      dispatch(showConfirmReturnDeposit(false));

      return;
    }
    if (totalAmountToReturn === 0) {
      // show error message here
      setErrorMessage(`Ensure members have stake in this syndicate.`);
      setShowErrorModal(true);
      return;
    }

    if (allowanceInWei === 0 || allowanceInWei < totalAmountToReturn) {
      // hide confirm modal
      dispatch(showConfirmReturnDeposit(false));

      // show error message here
      setErrorMessage(
        `Please set an allowance equal to or greater than ${totalAmountToReturn} and try again.`,
      );
      setErrorTitleMessage("Insufficient allowance set.");
      setShowErrorModal(true);
      return;
    }

    setShowConfirmationModal(true);
    dispatch(showConfirmReturnDeposit(false));
    try {
      await handleSubmitReturnDeposits(
        syndicateContracts,
        syndicateAddress.toString(),
        memberAddresses,
        account,
        showWalletConfirmationModal,
        (status: boolean) =>
          dispatch(
            setReturningMemberDeposit({
              memberAddresses,
              returningDeposit: status,
            }),
          ),
        () => handleResetMemberBalances(),
      );
    } catch (error) {
      const { code } = error;
      dispatch(
        setReturningMemberDeposit({
          memberAddresses,
          returningDeposit: false,
        }),
      );
      setShowConfirmationModal(false);
      // show error message here
      const errorMessage = getMetamaskError(code, "Deposit refund");
      if (code == 4001) {
        setErrorMessage("You have cancelled the transaction.");
      } else {
        setErrorMessage(errorMessage);
      }

      setShowErrorModal(true);
    }
  };

  const handleCancelReturnDeposit = () => {
    // dispatch(setLoadingSyndicateDepositorDetails(false));

    dispatch(showConfirmReturnDeposit(false));
    // dispatch(setSelectedMemberAddress([], 0));
  };

  const closeErrorModal = () => {
    setErrorMessage("");
    setErrorTitleMessage("");
    setShowErrorModal(false);
    dispatch(setLoadingSyndicateDepositorDetails(false));
  };

  return (
    <div className="w-full rounded-md h-full my-4">
      <div className="w-full px-2 py-2 sm:px-0">
        <Tab.Group defaultIndex={0}>
          <Tab.List className="flex space-x-10">
            <div className="uppercase text-sm p-1">Members</div>
            <div className="w-fit-content rounded-full border h-fit-content border-gray-nightrider">
              <Tab
                className={({ selected }) =>
                  `px-3 p-1 text-xs font-whyte ${
                    selected
                      ? "text-white border-1 border-white rounded-full"
                      : "text-gray-lightManatee"
                  }`
                }
              >
                Allowlist
              </Tab>
              <Tab
                className={({ selected }) =>
                  `px-3 py-1 text-xs ${
                    selected
                      ? "text-white border-1 border-white rounded-full"
                      : "text-gray-lightManatee"
                  }`
                }
              >
                Requests
              </Tab>
            </div>
          </Tab.List>
          {showPreApproveDepositor ? (
            <PreApproveDepositor
              {...{
                showPreApproveDepositor,
                setShowPreApproveDepositor,
                setAddingMember,
              }}
            />
          ) : null}
          <Tab.Panels className="font-whyte text-blue-rockBlue w-full">
            <Tab.Panel as="div">
              {loading ? (
                <div className="flex justify-center ">
                  <Spinner />
                </div>
              ) : syndicateMembers.length ? (
                <div className="flex flex-col overflow-y-hidden -mx-6">
                  {syndicateMembersToshow.length ? (
                    <SyndicateMembersTable
                      columns={columns}
                      data={tableData}
                      distributing={syndicate.distributing}
                      addingMember={addingMember}
                      filterAddressOnChangeHandler={
                        filterAddressOnChangeHandler
                      }
                      searchAddress={filteredAddress}
                    />
                  ) : (
                    <div className="flex justify-center text-gray-500">
                      {filteredAddress.trim()
                        ? "Member address not found."
                        : "Syndicate does not have investors."}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex justify-center">
                  <div className="my-10">
                    <div className="flex flex-col space-y-4">
                      <p>
                        No members have been added to this syndicate’s allowlist
                        yet.
                      </p>
                      {syndicate?.depositsEnabled &&
                      syndicate?.allowlistEnabled ? (
                        <button
                          className="flex text-blue-600 justify-center py-1"
                          onClick={showApproveModal}
                        >
                          <img
                            src={"/images/plus-circle-blue.svg"}
                            alt="icon"
                            className="mr-3 mt-0.5"
                          />
                          <span>Add members</span>
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
              )}

              <Modal
                {...{
                  show: confirmReturnDeposit,
                  modalStyle: ModalStyle.DARK,
                  showCloseButton: false,
                  customWidth: "w-2/5",
                }}
              >
                <div>
                  <p className="text-2xl text-center mb-6">Are you sure?</p>
                  <p className="text-base text-center text-gray-lightManatee">
                    This will return 100% of the deposited funds to the selected
                    members.
                  </p>
                  <div className="flex justify-between mt-10">
                    <button
                      className="flex text-center py-3 text-blue hover:opacity-80"
                      onClick={() => handleCancelReturnDeposit()}
                    >
                      <img
                        src={"/images/leftArrowBlue.svg"}
                        className="mt-1.5 mx-2"
                        alt="Back arrow"
                      />
                      Back
                    </button>

                    <button
                      className="primary-CTA hover:opacity-80"
                      onClick={() => handleReturnDeposits()}
                      disabled={showConfirmationModal}
                    >
                      Return Deposits
                    </button>
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
                  <Spinner />
                  <p className="text-lg text-center mt-8 mb-1">
                    Waiting for confirmation
                  </p>
                  <div className="modal-header font-medium text-center leading-8 text-sm text-blue-rockBlue">
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
                  <p className="text-lg text-center mt-8 mb-1">
                    {errorTitleMessage}
                  </p>
                  <div className="modal-header font-medium text-center leading-8 text-sm text-blue-rockBlue">
                    {errorMessage}
                  </div>
                </div>
              </Modal>
            </Tab.Panel>
            <Tab.Panel>
              <div className="flex justify-center">
                <div className="my-10">
                  <div>
                    <p>Members who have requested to be added to allowlist</p>
                  </div>
                </div>
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
};

export default ManageMembers;
