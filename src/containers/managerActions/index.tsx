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
  PendingStateModal,
} from "@/components/shared/transactionStates";
import StateModal from "@/components/shared/transactionStates/shared";
import { SkeletonLoader } from "@/components/skeletonLoader";
import { useUnavailableState } from "@/components/syndicates/hooks/useUnavailableState";
import {
  confirmCloseSyndicateText,
  confirmingTransaction,
  irreversibleActionText,
  rejectTransactionText,
  waitTransactionTobeConfirmedText,
} from "@/components/syndicates/shared/Constants";
import { UnavailableState } from "@/components/syndicates/shared/unavailableState";
import { getMetamaskError } from "@/helpers";
import {
  setSelectedMemberAddress,
  setShowModifyCapTable,
  setShowModifyMemberDistributions,
  setShowRejectDepositOrMemberAddress,
} from "@/redux/actions/manageActions";
import {
  setLoadingSyndicateDepositorDetails,
  setShowRejectAddressOnly,
  setShowRejectDepositOnly,
} from "@/redux/actions/manageMembers";
import { getSyndicateByAddress } from "@/redux/actions/syndicates";
import { RootState } from "@/redux/store";
import { web3 } from "@/utils";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChangeSyndicateSettings from "./changeSyndicateSettings";
import DistributeToken from "./distributeToken";
import ManageMembers from "./manageMembers";
import ManagerActionCard from "./managerActionCard";
import ModifyMemberDistributions from "./modifyMemberDistributions";
import ModifySyndicateCapTable from "./modifySyndicateCapTable";
import MoreManagerActionCard from "./moreManagerActionCard";
import PreApproveDepositor from "./preApproveDepositor";
import RejectDepositOrMemberAddress from "./RejectDepositOrMemberAddress";
import RequestSocialProfile from "./requestSocialProfile";

const ManagerActions = (): JSX.Element => {
  const {
    syndicatesReducer: { syndicate },
    initializeContractsReducer: { syndicateContracts },
    web3Reducer: {
      web3: { account },
    },
    manageActionsReducer: {
      manageActions: {
        modifyMemberDistribution,
        modifyCapTable,
        rejectMemberAddressOrDeposit,
      },
    },
  } = useSelector((state: RootState) => state);
  const dispatch = useDispatch();

  const router = useRouter();

  const { syndicateAddress } = router.query;

  const [address, setAddress] = useState<string | string[]>("");

  useEffect(() => {
    if (router.isReady) {
      setAddress(web3.utils.toChecksumAddress(syndicateAddress));
    }
  }, [router.isReady]);

  const [showWalletConfirmationModal, setShowWalletConfirmationModal] =
    useState(false);

  const [showFinalState, setShowFinalState] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [showDistributeToken, setShowDistributeToken] = useState(false);
  const [showPreApproveDepositor, setShowPreApproveDepositor] = useState(false);
  const [showRequestSocialProfile, setShowRequestSocialProfile] =
    useState(false);
  const [showChangeSettings, setShowChangeSettings] = useState<boolean>(false);
  const [showConfirmCloseSyndicate, setShowConfirmCloseSyndicate] =
    useState(false);

  const [showSyndicateNotModifiable, setShowSyndicateNotModifiable] =
    useState(false);

  // show component handling Manage Members
  const [showManageMembers, setShowManageMembers] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const { title, message, renderUnavailableState, renderJoinWaitList } =
    useUnavailableState("manage");

  const actions = [
    {
      icon: (
        <img
          src="/images/managerActions/create_public_profile.svg"
          alt="Public profile icon"
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

  const handleCloseFinalStateModal = async () => {
    setShowFinalState(false);
    await dispatch(
      getSyndicateByAddress({
        syndicateAddress: web3.utils.toChecksumAddress(syndicateAddress),
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
        web3.utils.toChecksumAddress(syndicateAddress),
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
        <div className="h-fit-content rounded-2xl p-4 md:mx-2 md:p-6 bg-gray-9 mt-6 md:mt-0">
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
        <div className="my-6 mx-4">
          <SkeletonLoader width="24" height="10" />
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

  /**
   * sets member address to empty string. This address might have been set from
   * the manage members component so we need to clear it here.
   */
  const clearMemberSelectedAddress = () => {
    dispatch(setSelectedMemberAddress(""));
  };

  const handleSetShowModifyMemberDistributions = () => {
    clearMemberSelectedAddress();
    dispatch(setShowModifyMemberDistributions(true));
  };

  /**
   * Sets controller variable for modifySyndicateCapTable modal to true and
   * selected member address to the address of the clicked row.
   * @param event
   */
  const handleSetShoModifySyndicateCapTable = (event) => {
    event.preventDefault();
    clearMemberSelectedAddress();
    dispatch(setShowModifyCapTable(true));
  };

  const handleSetRejectMemberDepositOrAddress = (event) => {
    event.preventDefault();
    // Reset store variables set from manage members component.
    // These variables make sense only when triggered from manage members section.
    clearMemberSelectedAddress();
    dispatch(setShowRejectAddressOnly(false));
    dispatch(setShowRejectDepositOnly(false));

    dispatch(setShowRejectDepositOrMemberAddress(true));
  };

  const handleSetShowManageMembers = (event) => {
    event.preventDefault();

    dispatch(setLoadingSyndicateDepositorDetails(true));
    setShowManageMembers(true);
  };

  return (
    <ErrorBoundary>
      <div className="w-full mt-4 sm:mt-0">
        <FadeIn>
          <div className="h-fit-content rounded-2xl p-4 md:mx-2 md:p-6 bg-gray-9 mt-6 md:mt-0 md:pb-2">
            <div className="text-xl font-inter">Manager Actions</div>

            <div className="flex h-12 rounded-custom items-center">
              <img
                src="/images/rightPointedHand.svg"
                className="mr-2"
                alt="You manage this syndicate"
              />
              <div className="text-gray-dim leading-snug">
                You manage this syndicate
              </div>
            </div>

            {/* show set distribution option when syndicate is closed */}
            {syndicate?.open ? (
              <ManagerActionCard
                title={"Close syndicate"}
                description={
                  "Close this syndicate and stop accepting deposits. This action is irreversible."
                }
                icon={
                  <img
                    src="/images/managerActions/close_syndicate.svg"
                    alt="close"
                  />
                }
                onClickHandler={() => setShowConfirmCloseSyndicate(true)}
              />
            ) : (
              <ManagerActionCard
                title={"Distribute tokens back to depositors"}
                description={
                  "Distribute tokens back to depositors and make them available for withdraw."
                }
                icon={<img src="/images/server.svg" alt="server" />}
                onClickHandler={() => {
                  // Amplitude logger: OPEN_DISTRIBUTE_TOKEN_MODAL
                  amplitudeLogger(OPEN_DISTRIBUTE_TOKEN_MODAL, {
                    flow: Flow.MGR_SET_DIST,
                  });
                  // Open distribute token modal
                  setShowDistributeToken(true);
                }}
              />
            )}
            {/* show pre-approve depositor option when syndicate is open and allowList is enabled */}
            {syndicate?.depositsEnabled && syndicate?.allowlistEnabled ? (
              <ManagerActionCard
                title={"Pre-approve depositor addresses"}
                description={
                  "Pre-approve accredited investor addresses that can deposit into this syndicate."
                }
                icon={
                  <img
                    src="/images/managerActions/approve_members.svg"
                    alt=""
                  />
                }
                onClickHandler={() => setShowPreApproveDepositor(true)}
              />
            ) : null}

            {actions.map(({ icon, title, description, onClickHandler }) => {
              return (
                <ManagerActionCard
                  title={title}
                  description={description}
                  icon={icon}
                  onClickHandler={onClickHandler}
                  key={title}
                />
              );
            })}
          </div>
        </FadeIn>
        <div className="p-0 md:p-2">
          <div className="font-semibold tracking-widest text-sm leading-6 text-gray-matterhorn my-6 mx-4">
            MORE
          </div>
          {syndicate?.distributing && syndicate?.modifiable ? (
            <MoreManagerActionCard
              icon={<img src="/images/invertedInfo.svg" alt="Info" />}
              text={"Modify Member distributions"}
              onClickHandler={handleSetShowModifyMemberDistributions}
            />
          ) : null}

          {/* member deposits can be set if syndicate is open and modifiable */}
          {syndicate?.open && syndicate?.modifiable ? (
            <MoreManagerActionCard
              icon={
                <img
                  src="/images/managerActions/overwrite_cap_table.svg"
                  alt="overwrite"
                />
              }
              text={"Overwrite syndicate cap table"}
              onClickHandler={handleSetShoModifySyndicateCapTable}
            />
          ) : null}


          <MoreManagerActionCard
            icon={
              <img src="/images/managerActions/settings.svg" alt="settings" />
            }
            text={"Change syndicate settings"}
            onClickHandler={setShowChangeSettings}
          />
        </div>
        {showDistributeToken ? (
          <DistributeToken
            {...{ showDistributeToken, setShowDistributeToken }}
          />
        ) : showPreApproveDepositor ? (
          <PreApproveDepositor
            {...{ showPreApproveDepositor, setShowPreApproveDepositor }}
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
        ) : null
        }
      </div>
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
    </ErrorBoundary>
  );
};

export default ManagerActions;
