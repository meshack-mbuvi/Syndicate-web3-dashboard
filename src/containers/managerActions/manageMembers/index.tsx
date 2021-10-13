import Modal, { ModalStyle } from "@/components/modal";
import { Spinner } from "@/components/shared/spinner";
import { getMetamaskError } from "@/helpers";
import { checkAccountAllowance } from "@/helpers/approveAllowance";
import {
  setBlockingMemberAddress,
  showConfirmBlockMemberAddress,
} from "@/redux/actions/manageActions";
import {
  setLoadingSyndicateDepositorDetails,
  setReturningMemberDeposit,
  setSelectedMemberAddress,
  showConfirmReturnDeposit,
} from "@/redux/actions/manageMembers";
import { updateMemberActivityDetails } from "@/redux/actions/syndicateMemberDetails/memberActivityInfo";
import { updateMemberWithdrawalDetails } from "@/redux/actions/syndicateMemberDetails/memberWithdrawalsInfo";
import { getSyndicateByAddress } from "@/redux/actions/syndicates";
import { RootState } from "@/redux/store";
import { web3 } from "@/utils";
import { getWeiAmount } from "@/utils/conversions";
import { formatAddress } from "@/utils/formatAddress";
import { floatedNumberWithCommas } from "@/utils/formattedNumbers";
import _, { sortBy } from "lodash";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DepositTransfer from "../depositTransfer";
import ModifyMemberDeposit from "../modifyMemberDeposits";
import PreApproveDepositor from "../preApproveDepositor";
import MoreOptionButton from "./moreOptionButton";
import {
  handleSubmitBlockMemberAddress,
  handleSubmitReturnDeposits,
} from "./sharedLogicFunctions";
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
      syndicateNewMembers: { newSyndicateMembers },
    },
    syndicateMemberDetailsReducer: {
      memberWithdrawalDetails,
      syndicateDistributionTokens,
      memberActivity,
    },
    manageActionsReducer: {
      manageActions: { confirmBlockAddress },
    },
    initializeContractsReducer: { syndicateContracts },
  } = useSelector((state: RootState) => state);

  const [showPreApproveDepositor, setShowPreApproveDepositor] = useState(false);
  const [showMemberDetailsModal, setShowMemberDetailsModal] = useState(false);

  const dispatch = useDispatch();
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorTitleMessage, setErrorTitleMessage] = useState("");
  const [activeMemberDetailsTab, setActiveMemberDetailsTab] =
    useState("details");

  const [memberInfo, setMemberInfo] = useState<any>({});
  const [memberDetails, setMemberDetails] = useState([]);
  const router = useRouter();
  const { syndicateAddress } = router.query;

  useEffect(() => {
    if (!router.isReady) return;

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
    if (syndicate && syndicateMembers?.length) {
      const memberAddresses = syndicateMembers.map(
        ({ memberAddress }) => memberAddress,
      );
      dispatch(
        updateMemberActivityDetails({
          syndicateAddress: syndicate.syndicateAddress,
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
  }, [
    JSON.stringify(syndicateMembers),
    syndicateDistributionTokens,
    syndicate,
    router.isReady,
  ]);

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
    const res = syndicateMembersToShow.map((memberData) => ({
      ...{
        ...memberData,
        ...syndicate,
        memberWithdrawalDetails,
        activity: [
          ...sortBy(memberActivity[memberData.memberAddress], "timestamp"),
        ],
      },
    }));
    if (syndicate?.open)
      return res.filter(
        (value) =>
          (parseInt(value.memberDeposit) > 0 && value.memberAddressAllowed) ||
          parseInt(value.memberDeposit) > 0 ||
          value.newMember,
      );

    return res.filter((value) => {
      return (
        (parseInt(value.memberDeposit) === 0 && value.memberAddressAllowed) ||
        (parseInt(value.memberDeposit) !== 0 && !value.memberAddressAllowed) ||
        (parseInt(value.memberDeposit) > 0 && value.memberAddressAllowed)
      );
    });
  };

  const [syndicateMembersToShow, setSynMembersToShow] =
    useState(syndicateMembers);

  const [tableData, setTableData] = useState(getTableData());

  const generateTableData = () => {
    const allMembers = [...syndicateMembers, ...newSyndicateMembers];

    if (filteredAddress.trim()) {
      // search any text
      const filteredMembers = allMembers.filter((member) =>
        member.memberAddress.toLowerCase().includes(filteredAddress),
      );
      setSynMembersToShow(filteredMembers);
    } else {
      setSynMembersToShow(allMembers);
    }
  };

  useEffect(() => {
    generateTableData();
  }, [
    newSyndicateMembers,
    JSON.stringify(syndicateMembers),
    memberActivity,
    memberWithdrawalDetails,
    filteredAddress,
  ]);

  useEffect(() => {
    const tableDetails = getTableData();
    setTableData(tableDetails);
  }, [syndicateMembersToShow]);

  const showApproveModal = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowPreApproveDepositor(true);
  };

  const showMemberDetails = (e, memberInfo) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMemberDetailsModal(true);
    setMemberInfo(memberInfo);

    const _memberDetails = [
      {
        "Wallet Address": memberInfo.memberAddress,
      },
      {
        "Deposit Amount": `${floatedNumberWithCommas(
          memberInfo.memberDeposit,
        )} ${memberInfo.depositERC20TokenSymbol}`,
      },
      { "Distribution Share": `${memberInfo.memberStake}%` },
    ];
    setMemberDetails(_memberDetails);
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "Member",
        accessor: function memberAddress(row: {
          memberAddress: string;
          memberAddressAllowed: boolean;
        }) {
          const { memberAddress, memberAddressAllowed } = row;
          if (!memberAddressAllowed) {
            return (
              <div className="flex space-x-3 align-center text-base my-1 leading-6">
                <Image
                  width="32"
                  height="32"
                  src={"/images/user.svg"}
                  alt="user"
                />
                <p className="my-auto">
                  {formatAddress(memberAddress, 6, 6)} (Blocked)
                </p>
              </div>
            );
          } else {
            return (
              <div className="flex space-x-3 align-center text-base my-1 leading-6">
                <Image
                  width="32"
                  height="32"
                  src={"/images/user.svg"}
                  alt="user"
                />
                <p className="my-auto">{formatAddress(memberAddress, 6, 6)}</p>
              </div>
            );
          }
        },
      },
      {
        Header: `Deposit Amount (${syndicate?.depositERC20TokenSymbol})`,
        accessor: function depositAmount({
          memberDeposit,
          returningDeposit,
          blockingAddress,
          transferringDeposit,
          modifyingDeposits,
        }) {
          if (
            returningDeposit ||
            transferringDeposit ||
            blockingAddress ||
            modifyingDeposits
          ) {
            return (
              <p className="flex opacity-70s">
                <Spinner height="h-4" width="w-4" margin="my-1" />
                <span className="ml-2 text-gray-lightManatee text-base leading-6	">
                  {returningDeposit
                    ? "Returning deposits"
                    : transferringDeposit
                    ? "Transferring"
                    : blockingAddress
                    ? "Blocking Address"
                    : "Modifying"}
                </span>
              </p>
            );
          }
          return (
            <p className="text-white text-base">
              {floatedNumberWithCommas(memberDeposit)}
            </p>
          );
        },
      },
      {
        Header: `Distribution Share`,
        accessor: function distributionShare({ memberStake }) {
          return (
            <p className="">
              <span className="ml-1 font-whyte-light text-white">
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
          const { addingMember } = row;
          if (addingMember) {
            return (
              <span className="flex text-sm items-center justify-end">
                <Spinner height="h-4" width="w-4" margin="my-0" />
                <span className="ml-2 text-gray-lightManatee leading-6 font-whyte">
                  Adding Member
                </span>
              </span>
            );
          }
          return <MoreOptionButton {...{ row }} />;
        },
      },
    ],
    [syndicate],
  );

  const showWalletConfirmationModal = (status: boolean) => {
    setShowConfirmationModal(status);
  };

  const handleFetchSyndicate = async () => {
    await dispatch(
      getSyndicateByAddress({
        syndicateAddress: web3.utils.toChecksumAddress(syndicateAddress),
        ...syndicateContracts,
      }),
    );
  };

  const handleBlockAddresses = async () => {
    if (!memberAddresses) {
      dispatch(showConfirmBlockMemberAddress(false));
      return;
    }
    setShowConfirmationModal(true);
    dispatch(showConfirmBlockMemberAddress(false));
    try {
      await handleSubmitBlockMemberAddress(
        syndicateContracts,
        syndicateAddress.toString(),
        memberAddresses,
        account,
        showWalletConfirmationModal,
        (status: boolean) =>
          dispatch(
            setBlockingMemberAddress({
              memberAddresses,
              blockingAddress: status,
            }),
          ),
        () => handleFetchSyndicate(),
      );
    } catch (error) {
      const { code } = error;
      dispatch(
        setBlockingMemberAddress({
          memberAddresses,
          blockingAddress: false,
        }),
      );
      setShowConfirmationModal(false);
      const errorMessage = getMetamaskError(code, "Deposit refund");
      if (code == 4001) {
        setErrorMessage("You have cancelled the transaction.");
      } else {
        setErrorMessage(errorMessage);
      }

      setShowErrorModal(true);
    }
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
        () => handleFetchSyndicate(),
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
    dispatch(showConfirmReturnDeposit(false));
    dispatch(setSelectedMemberAddress([], 0));
  };

  const handleCancelBlockAddress = () => {
    dispatch(showConfirmBlockMemberAddress(false));
    dispatch(setSelectedMemberAddress([], 0));
  };

  const closeErrorModal = () => {
    setErrorMessage("");
    setErrorTitleMessage("");
    setShowErrorModal(false);
    dispatch(setLoadingSyndicateDepositorDetails(false));
  };

  const closeMemberDetailsModal = () => {
    setShowMemberDetailsModal(false);
  };

  return (
    <div className="w-full rounded-md h-full max-w-1480">
      <div className="w-full px-2 sm:px-0">
        {showPreApproveDepositor ? (
          <PreApproveDepositor
            {...{
              showPreApproveDepositor,
              setShowPreApproveDepositor,
            }}
          />
        ) : null}
        {loading ? (
          <div className="flex justify-center ">
            <Spinner />
          </div>
        ) : tableData.length || filteredAddress ? (
          <div className="flex flex-col overflow-y-hidden">
            <SyndicateMembersTable
              columns={columns}
              data={tableData}
              distributing={syndicate.distributing}
              filterAddressOnChangeHandler={filterAddressOnChangeHandler}
              searchAddress={filteredAddress}
              showApproveModal={showApproveModal}
              showMemberDetails={showMemberDetails}
            />
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="my-10">
              <div className="flex flex-col space-y-4">
                <p>
                  No members have been added to this syndicate’s allowlist yet.
                </p>
                {syndicate?.allowlistEnabled && syndicate?.open ? (
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

        {/* component handling deposit Transfer */}
        <DepositTransfer />

        {/* Component to modify member deposits */}
        <ModifyMemberDeposit />

        <Modal
          {...{
            show: showMemberDetailsModal,
            modalStyle: ModalStyle.DARK,
            showCloseButton: false,
            customWidth: "w-2/5",
            outsideOnClick: true,
            closeModal: closeMemberDetailsModal,
            customClassName: "py-8 px-10",
            showHeader: false,
          }}
        >
          <div>
            <div className="flex space-x-3 align-center w-full mb-4">
              <Image
                width="64"
                height="64"
                src={"/images/user.svg"}
                alt="user"
              />
              <div className="flex-grow flex flex-col justify-center">
                <div className="text-2xl">
                  {formatAddress(memberInfo.memberAddress, 6, 6)}
                </div>
              </div>
            </div>
            <div>
              <div className="hidden sm:block">
                <div className="">
                  <nav className="flex" aria-label="Tabs">
                    <button
                      key="details"
                      onClick={() => setActiveMemberDetailsTab("details")}
                      className={`whitespace-nowrap py-4 px-1 border-b-1 font-whyte text-sm cursor-pointer ${
                        activeMemberDetailsTab == "details"
                          ? "border-white text-white"
                          : "border-transparent text-gray-500 hover:text-gray-400 hover:border-gray-400"
                      }`}
                    >
                      DETAILS
                    </button>

                    <button
                      key="activity"
                      onClick={() => setActiveMemberDetailsTab("activity")}
                      className={`whitespace-nowrap py-4 px-1 border-b-1 font-whyte text-sm ml-10 cursor-pointer ${
                        activeMemberDetailsTab == "activity"
                          ? "border-white text-white"
                          : "border-transparent text-gray-500 hover:text-gray-400 hover:border-gray-400"
                      }`}
                    >
                      ACTIVITY
                    </button>
                  </nav>
                </div>
                <div className="border-b-1 border-gray-24 absolute w-full -ml-10"></div>
                <div className="mt-4 text-base">
                  {activeMemberDetailsTab == "details" ? (
                    memberDetails.map((detail) =>
                      Object.entries(detail).map(([key, value]) => (
                        <div
                          className="py-4 flex justify-between border-b-1 border-gray-24"
                          key={key}
                        >
                          <div className="text-gray-500 pr-4">{key}</div>
                          <div className="overflow-y-scroll  no-scroll-bar">
                            {value}
                          </div>
                        </div>
                      )),
                    )
                  ) : memberInfo.activity.length ? (
                    memberInfo.activity.map((activity, index) => (
                      <div
                        key={index}
                        className="py-4 flex justify-between border-b-1 border-gray-24"
                      >
                        <div className="text-gray-500 pr-4 flex">
                          <img
                            src={
                              activity.action === "withdrew"
                                ? "/images/withdrewDeposit.svg"
                                : "/images/memberDeposited.svg"
                            }
                            alt="icon"
                            className="h-6 w-6"
                          />
                          <div className="ml-4 capitalize">
                            {activity.action}{" "}
                            <span className="text-white">
                              {floatedNumberWithCommas(activity.amountChanged)}{" "}
                              {activity.tokenSymbol}
                            </span>
                          </div>
                        </div>
                        <div className="text-gray-500">
                          {activity.elapsedTime}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-4 text-center text-gray-500 w-full border-b-1 border-gray-24">
                      No activity
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Modal>

        <Modal
          {...{
            show: confirmReturnDeposit,
            modalStyle: ModalStyle.DARK,
            showCloseButton: false,
            customWidth: "w-2/5 max-w-564 justify-center",
          }}
        >
          <div>
            <p className="text-2xl text-center mb-6">Are you sure?</p>
            <p className="text-base text-center text-gray-lightManatee">
              {`${
                memberAddresses.length > 1
                  ? "This will return 100% of the deposited funds to the selected members."
                  : "This will return 100% of the deposited funds to the member."
              }`}
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

        {/**Block Address and return deposits Modal */}
        <Modal
          {...{
            show: confirmBlockAddress,
            modalStyle: ModalStyle.DARK,
            showCloseButton: false,
            customWidth: "w-2/5 max-w-564 justify-center",
          }}
        >
          <div>
            <p className="text-2xl text-center mb-6">Are you sure?</p>
            <p className="text-base text-center text-gray-lightManatee">
              {`${
                memberAddresses.length > 1
                  ? "This will block the selected members from depositing more funds into this syndicate. They will remain members until their deposits are returned."
                  : "This will block the member from depositing more funds into this syndicate. They will remain a member until their deposits are returned."
              }`}
            </p>
            <div className="flex justify-between mt-10">
              <button
                className="flex text-center py-3 text-blue hover:opacity-80"
                onClick={() => handleCancelBlockAddress()}
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
                onClick={() => handleBlockAddresses()}
                disabled={showConfirmationModal}
              >
                {memberAddresses.length > 1
                  ? "Block Addresses"
                  : "Block Address"}
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

export default ManageMembers;
