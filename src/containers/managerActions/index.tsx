import { amplitudeLogger, Flow } from "@/components/amplitude";
import { OPEN_DISTRIBUTE_TOKEN_MODAL } from "@/components/amplitude/eventNames";
import { PrimaryButton } from "@/components/buttons";
import ErrorBoundary from "@/components/errorBoundary";
import FadeIn from "@/components/fadeIn/FadeIn";
import JoinWaitlist from "@/components/JoinWaitlist";
import { ErrorModal } from "@/components/shared";
import {
  ConfirmStateModal,
  FinalStateModal,
  PendingStateModal
} from "@/components/shared/transactionStates";
import StateModal from "@/components/shared/transactionStates/shared";
import { SkeletonLoader } from "@/components/skeletonLoader";
import DistributionTokenCard from "@/components/syndicateDetails/distributionTokenCard";
import StatusBadge from "@/components/syndicateDetails/statusBadge";
import { useUnavailableState } from "@/components/syndicates/hooks/useUnavailableState";
import {
  confirmCloseSyndicateText,
  confirmingTransaction,
  irreversibleActionText,
  rejectTransactionText,
  waitTransactionTobeConfirmedText
} from "@/components/syndicates/shared/Constants";
import { UnavailableState } from "@/components/syndicates/shared/unavailableState";
import { getMetamaskError } from "@/helpers";
import { setShowModifyMemberDistributions } from "@/redux/actions/manageActions";
import { getSyndicateByAddress } from "@/redux/actions/syndicates";
import { RootState } from "@/redux/store";
import abi from "human-standard-token-abi";
import { useRouter } from "next/router";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChangeSyndicateSettings from "./changeSyndicateSettings";
import DistributeToken from "./distributeToken";
import ManagerActionCard from "./managerActionCard";
import ModifyMemberDistributions from "./modifyMemberDistributions";
import ModifySyndicateCapTable from "./modifySyndicateCapTable";
import MoreManagerActionCard from "./moreManagerActionCard";
import PreApproveDepositor from "./preApproveDepositor";
import RequestSocialProfile from "./requestSocialProfile";
import ManagerSetAllowance from "./setAllowances";

const ManagerActions = (): JSX.Element => {
  const {
    syndicatesReducer: { syndicate },
    initializeContractsReducer: { syndicateContracts },
    web3Reducer: {
      web3: { account, web3 },
    },
    manageActionsReducer: {
      manageActions: { modifyMemberDistribution, modifyCapTable },
    },
    manageMembersDetailsReducer: {
      syndicateManageMembers: { syndicateMembers },
    },
    syndicateMemberDetailsReducer: {
      syndicateDistributionTokens,
      memberWithdrawalDetails,
    },
  } = useSelector((state: RootState) => state);
  const dispatch = useDispatch();

  const router = useRouter();

  const { syndicateAddress } = router.query;

  const [address, setAddress] = useState<string | string[]>("");

  useEffect(() => {
    if (router.isReady) {
      setAddress(web3.utils.toChecksumAddress(syndicateAddress as string));
    }
  }, [router.isReady]);

  const [showWalletConfirmationModal, setShowWalletConfirmationModal] =
    useState(false);

  const [showFinalState, setShowFinalState] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showPreApproveDepositor, setShowPreApproveDepositor] = useState(false);

  const [showDistributeToken, setShowDistributeToken] = useState(false);

  const [showRequestSocialProfile, setShowRequestSocialProfile] =
    useState(false);
  const [showChangeSettings, setShowChangeSettings] = useState<boolean>(false);
  const [showConfirmCloseSyndicate, setShowConfirmCloseSyndicate] =
    useState(false);

  const [showSyndicateNotModifiable, setShowSyndicateNotModifiable] =
    useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const { title, message, renderUnavailableState, renderJoinWaitList } =
    useUnavailableState("manage");

  const actions = [
    {
      grayIcon: (
        <Image
          src="/images/managerActions/create_public_profile.svg"
          alt="Public profile icon"
          width={16}
          height={16}
        />
      ),
      whiteIcon: (
        <Image
          src="/images/managerActions/create_public_profile_white.svg"
          alt="Public profile icon"
          width={16}
          height={16}
        />
      ),
      title: "Create a public-facing social profile",
      onClickHandler: () => setShowRequestSocialProfile(true),
      description:
        "Help others understand this syndicate by requesting a social profile. We’ll help you create it.",
    },
  ];

  /**
   * Final state variables
   */
  const [finalStateButtonText, setFinalButtonText] = useState("");
  const [finalStateHeaderText, setFinalStateHeaderText] = useState("");
  const [finalStateIcon, setFinalStateIcon] = useState("");

  // Allowance
  const depositTotalMax = syndicate?.depositTotalMax;
  const depositERC20Address = syndicate?.depositERC20Address;
  const tokenDecimals = syndicate?.tokenDecimals;
  const depositERC20TokenSymbol = syndicate?.depositERC20TokenSymbol;
  const distributing = syndicate?.distributing;
  const depositsEnabled = syndicate?.depositsEnabled;
  const [depositTokenContract, setDepositTokenContract] = useState<any>(null);
  const [showManagerSetAllowances, setShowManagerSetAllowances] =
    useState<boolean>(false);
  // show modal for manager to set allowances for deposits/distributions
  const showManagerSetAllowancesModal = () => {
    setShowManagerSetAllowances(true);
  };
  //hide modal for setting allowances by the manager
  const hideManagerSetAllowances = () => {
    setShowManagerSetAllowances(false);
  };
  useEffect(() => {
    if (depositERC20Address && web3) {
      // set up token contract
      const tokenContract = new web3.eth.Contract(abi, depositERC20Address);

      setDepositTokenContract(tokenContract);
    }
  }, [depositERC20Address, web3]);

  const handleCloseFinalStateModal = async () => {
    setShowFinalState(false);
    await dispatch(
      getSyndicateByAddress({
        syndicateAddress: web3.utils.toChecksumAddress(syndicateAddress as string),
        ...syndicateContracts,
      }),
    );
  };

  /**
   * This function closes an open syndicate and calls function to update
   * syndicate data
   */
  const closeSyndicate = async () => {
    try {
      setShowWalletConfirmationModal(true);
      await syndicateContracts.ManagerLogicContract.managerCloseSyndicate(
        web3.utils.toChecksumAddress(syndicateAddress as string),
        account,
        setShowWalletConfirmationModal,
        setSubmitting,
      );

      setSubmitting(false);

      setShowFinalState(true);
      setFinalStateHeaderText("Closed to Deposits");
      setFinalStateIcon("/images/checkCircle.svg");
      setFinalButtonText("Done");
    } catch (error) {
      setShowWalletConfirmationModal(false);
      setSubmitting(false);

      const { code } = error;
      const errorMessage = getMetamaskError(code, "Close Syndicate");
      setFinalButtonText("Dismiss");
      setFinalStateIcon("/images/roundedXicon.svg");

      if (code == 4001) {
        setFinalStateHeaderText("Transaction Rejected");
      } else {
        setFinalStateHeaderText(errorMessage);
      }
      setShowFinalState(true);
    }
  };
  if (renderUnavailableState || renderJoinWaitList) {
    return (
      <div className="h-fit-content px-8 pb-4 pt-5 bg-gray-9 rounded-2xl">
        <div className="flex justify-between my-1 px-2">
          {renderJoinWaitList ? (
            <JoinWaitlist />
          ) : (
            renderUnavailableState && (
              <UnavailableState title={title} message={message} />
            )
          )}
        </div>
      </div>
    );
  }

  // if syndicate?.managerCurrent !== account is true then it should redirect to deposit page hence the loader
  // DEV NOTES:
  //   improvements are welcomed. Its a hacky way while waiting for page to redirect.
  //   this happens because this component should be rendered after fetching account and syndicate info
  const isNotManager =
    web3.utils.toChecksumAddress(syndicate?.managerCurrent) !== account;
  if (isNotManager) {
    return (
      <>
        <div className="h-fit-content rounded-2xl p-4 md:mx-2 md:p-6 bg-gray-9 mt-6 md:mt-0 w-full">
          <div className="mb-6">
            <SkeletonLoader width="full" height="10" />
          </div>
          <div className="mb-4">
            <SkeletonLoader width="full" height="12" />
          </div>
          <div className="mb-4">
            <SkeletonLoader width="full" height="12" />
          </div>
          <div className="mb-4">
            <SkeletonLoader width="full" height="12" />
          </div>
        </div>
        <div className="w-40" />
        <div className="my-6 mx-4">
          <SkeletonLoader width="72" height="10" />
          <div className="my-6">
            <SkeletonLoader width="full" height="12" />
          </div>
          <div className="mb-6">
            <SkeletonLoader width="full" height="12" />
          </div>
        </div>
      </>
    );
  }

  const handleSetShowModifyMemberDistributions = () => {
    dispatch(setShowModifyMemberDistributions(true));
  };

  const showApproveModal = () => {
    setShowPreApproveDepositor(true);
  };

  let badgeBackgroundColor = "bg-blue-darker";
  let badgeIcon = "depositIcon.svg";
  let titleText = "Open to deposits";
  if (distributing) {
    badgeBackgroundColor = "bg-green-darker";
    badgeIcon = "distributeIcon.svg";
    titleText = "Distributing";
  } else if (!depositsEnabled && !distributing) {
    badgeBackgroundColor = "bg-green-dark";
    badgeIcon = "active.svg";
    titleText = "Active";
  }

  return (
    <ErrorBoundary>
      <div className="w-full mt-4 sm:mt-0">
        <FadeIn>
          <div className="h-fit-content rounded-2-half bg-gray-syn8">
            <StatusBadge
              badgeBackgroundColor={badgeBackgroundColor}
              badgeIcon={badgeIcon}
              titleText={titleText}
            />
            <div className="h-fit-content rounded-2-half mt-6 mb-2 md:mt-0 pb-8">
              {syndicateDistributionTokens && syndicate?.distributing ? (
                <div className="px-6 border-b-1 border-gray-700 pb-6 font-light w-full tracking-wide">
                  {syndicateDistributionTokens?.map((token, index) => (
                    <DistributionTokenCard
                      key={index}
                      token={token}
                      memberWithdrawalDetails={memberWithdrawalDetails}
                    />
                  ))}
                </div>
              ) : null}
              <div className="pl-8 md:pl-6 pr-4">
                <div
                  className={`text-sm font-bold uppercase tracking-wider m-4 mr-4 ml-0 md:ml-0 md:m-3 md:mr-5 md:mt-5`}
                >
                  Manager Actions
                </div>
                {/* show set distribution option when syndicate is closed */}
                {syndicate?.open ? (
                  <>
                    <ManagerActionCard
                      title={"Set allowance"}
                      description={
                        "In order for USDC to flow in and out of this syndicate, you must first set an appropriate allowance amount."
                      }
                      grayIcon={
                        <Image
                          src="/images/managerActions/allow.svg"
                          alt="close"
                          width={16}
                          height={16}
                        />
                      }
                      whiteIcon={
                        <Image
                          src="/images/managerActions/allow-white.svg"
                          alt="close"
                          width={16}
                          height={16}
                        />
                      }
                      onClickHandler={() => showManagerSetAllowancesModal()}
                    />
                    {syndicate?.allowlistEnabled &&
                    !syndicate?.isCloseDatePast &&
                    syndicateMembers?.length === 0 ? (
                      <ManagerActionCard
                        title={"Add members to your allowlist"}
                        description={
                          "Before this syndicate’s members can deposit, their wallet addresses need to be added to your allowlist."
                        }
                        grayIcon={
                          <Image
                            src="/images/managerActions/userAdd.svg"
                            alt="close"
                            width={16}
                            height={16}
                          />
                        }
                        whiteIcon={
                          <Image
                            src="/images/managerActions/userAdd-white.svg"
                            alt="close"
                            width={16}
                            height={16}
                          />
                        }
                        onClickHandler={() => showApproveModal()}
                      />
                    ) : null}
                    <ManagerActionCard
                      title={"Close to deposits"}
                      description={
                        "Close this syndicate and stop accepting deposits. This action is irreversible."
                      }
                      grayIcon={
                        <Image
                          src="/images/managerActions/close_syndicate.svg"
                          alt="close"
                          width={16}
                          height={16}
                        />
                      }
                      whiteIcon={
                        <Image
                          src="/images/managerActions/close_syndicate_white.svg"
                          alt="close"
                          width={16}
                          height={16}
                        />
                      }
                      onClickHandler={() => setShowConfirmCloseSyndicate(true)}
                    />
                  </>
                ) : (
                  <>
                    <ManagerActionCard
                      title={`${
                        !syndicateDistributionTokens
                          ? "Distribute funds back to members"
                          : "Distribute more funds to members"
                      }`}
                      description={
                        "Distribute tokens to members, making them available to withdraw."
                      }
                      grayIcon={
                        <Image
                          src="/images/distribute-gray.svg"
                          alt="server"
                          width={16}
                          height={16}
                        />
                      }
                      whiteIcon={
                        <Image
                          src="/images/distribute-white.svg"
                          alt="server"
                          width={16}
                          height={16}
                        />
                      }
                      onClickHandler={() => {
                        // Amplitude logger: OPEN_DISTRIBUTE_TOKEN_MODAL
                        amplitudeLogger(OPEN_DISTRIBUTE_TOKEN_MODAL, {
                          flow: Flow.MGR_SET_DIST,
                        });
                        // Open distribute token modal
                        setShowDistributeToken(true);
                      }}
                    />
                  </>
                )}
                {actions.map(
                  ({
                    whiteIcon,
                    grayIcon,
                    title,
                    description,
                    onClickHandler,
                  }) => {
                    return (
                      <ManagerActionCard
                        title={title}
                        description={description}
                        whiteIcon={whiteIcon}
                        grayIcon={grayIcon}
                        onClickHandler={onClickHandler}
                        key={title}
                      />
                    );
                  },
                )}
              </div>
            </div>
          </div>
        </FadeIn>
        <div className="p-0 md:py-2">
          {syndicate?.distributing && syndicate?.modifiable ? (
            <MoreManagerActionCard
              grayIcon={
                <Image
                  src="/images/invertedInfo.svg"
                  alt="Info"
                  width={16}
                  height={16}
                />
              }
              whiteIcon={
                <Image
                  src="/images/invertedInfo-white.svg"
                  alt="Info"
                  width={16}
                  height={16}
                />
              }
              text={"Modify Member distributions"}
              onClickHandler={handleSetShowModifyMemberDistributions}
            />
          ) : null}

          <MoreManagerActionCard
            grayIcon={
              <Image
                src="/images/managerActions/settings.svg"
                alt="settings"
                width={16}
                height={16}
              />
            }
            whiteIcon={
              <Image
                src="/images/managerActions/settings-white.svg"
                alt="settings"
                width={16}
                height={16}
              />
            }
            text={"Syndicate settings"}
            onClickHandler={() => setShowChangeSettings(true)}
          />
        </div>
        
        {showDistributeToken ? (
          <DistributeToken
            {...{ showDistributeToken, setShowDistributeToken }}
          />
        ) : showRequestSocialProfile ? (
          <RequestSocialProfile
            {...{ showRequestSocialProfile, setShowRequestSocialProfile }}
          />
        ) : modifyCapTable ? (
          <ModifySyndicateCapTable />
        ) : showChangeSettings ? (
          <ChangeSyndicateSettings
            {...{ showChangeSettings, setShowChangeSettings }}
          />
        ) : showSyndicateNotModifiable ? (
          <ErrorModal
            {...{
              show: showSyndicateNotModifiable,
              handleClose: () => {
                setShowSyndicateNotModifiable(false);
                setErrorMessage("");
              },
              errorMessage,
            }}
          />
        ) : modifyMemberDistribution ? (
          <ModifyMemberDistributions />
        ) : null}
      </div>

      {/* Approve addresses to allowlist */}
      {showPreApproveDepositor ? (
        <PreApproveDepositor
          {...{
            showPreApproveDepositor,
            setShowPreApproveDepositor,
          }}
        />
      ) : null}

      {/* Confirm whether manager wants to close syndicate */}

      <StateModal show={showConfirmCloseSyndicate}>
        <>
          <div className="flex flex-col justify-center m-auto mb-4">
            <p className="text-sm mx-8 my-2 font-medium text-center leading-6 text-lg">
              Please confirm that you want to close this syndicate.
            </p>
            <p className="text-sm text-center mx-8 mt-2 opacity-60">
              If this was a mistake, please click the{" "}
              <strong className="text-blue font-medium">cancel</strong> button
              below.
            </p>
            <p className="flex text-sm text-red-600 justify-center items-center text-center mx-8 mt-4">
              <img src="/images/danger.svg" className="mx-2" alt="danger" />
              Closing a syndicate is irreversible.
            </p>
            <div className="flex text-sm justify-between text-center mx-8 mt-4">
              <PrimaryButton
                customClasses="border border-color-gray px-4 py-2 w-full"
                textColor="text-black"
                onClick={() => setShowConfirmCloseSyndicate(false)}
              >
                Cancel
              </PrimaryButton>
              <PrimaryButton
                customClasses="ml-8 bg-blue px-4 py-2 w-full"
                onClick={() => {
                  setShowConfirmCloseSyndicate(false);
                  closeSyndicate();
                }}
              >
                Confirm
              </PrimaryButton>
            </div>
          </div>
        </>
      </StateModal>

      {/* Tell user to confirm transaction on their wallet */}
      <ConfirmStateModal show={showWalletConfirmationModal}>
        <div className="flex flex-col justify-centers m-auto mb-4">
          <p className="text-sm text-center mx-8 opacity-60">
            {confirmCloseSyndicateText}
          </p>
          <p className="text-sm text-center mx-8 mt-2 opacity-60">
            {rejectTransactionText}
          </p>
          <p className="flex text-sm text-red-600 justify-center text-center mx-8 mt-8">
            <img src="/images/danger.svg" className="mx-2" alt="danger" />
            {irreversibleActionText}
          </p>
        </div>
      </ConfirmStateModal>

      {/* Loading modal */}
      <PendingStateModal
        {...{
          show: submitting,
        }}
      >
        <div className="modal-header mb-4 font-medium text-center leading-8 text-2xl">
          {confirmingTransaction}
        </div>
        <div className="flex flex-col justify-center m-auto mb-4">
          <p className="text-sm text-center mx-8 opacity-60">
            {waitTransactionTobeConfirmedText}
          </p>
        </div>
      </PendingStateModal>

      <FinalStateModal
        show={showFinalState}
        handleCloseModal={async () => await handleCloseFinalStateModal()}
        icon={finalStateIcon}
        buttonText={finalStateButtonText}
        headerText={finalStateHeaderText}
        address={address.toString()}
      />
      <ManagerSetAllowance
        {...{
          depositTotalMax,
          depositsEnabled,
          depositTokenContract,
          showManagerSetAllowances,
          hideManagerSetAllowances,
          depositERC20TokenSymbol,
          tokenDecimals,
          syndicateContracts,
          depositERC20Address,
        }}
      />
    </ErrorBoundary>
  );
};

export default ManagerActions;
