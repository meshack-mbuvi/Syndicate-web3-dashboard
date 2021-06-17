import FadeIn from "@/components/fadeIn/FadeIn";
import { PrimaryButton } from "@/components/buttons";
import { ErrorModal } from "@/components/shared";
import { PendingStateModal } from "@/components/shared/transactionStates";
import ConfirmStateModal from "@/components/shared/transactionStates/confirm";
import FinalStateModal from "@/components/shared/transactionStates/final";
import { SkeletonLoader } from "@/components/skeletonLoader";
import { useUnavailableState } from "@/components/syndicates/hooks/useUnavailableState";
import StateModal from "@/components/shared/transactionStates/shared";
import {
  confirmCloseSyndicateText,
  confirmingTransaction,
  irreversibleActionText,
  rejectTransactionText,
  syndicateActionConstants,
  waitTransactionTobeConfirmedText,
} from "@/components/syndicates/shared/Constants";
import { UnavailableState } from "@/components/syndicates/shared/unavailableState";
import { getMetamaskError } from "@/helpers";
import { getSyndicateByAddress } from "@/redux/actions/syndicates";
import { RootState } from "@/redux/store";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ErrorBoundary from "@/components/errorBoundary";
import DistributeToken from "./distributeToken";
import ManagerActionCard from "./managerActionCard";
import ModifyMemberDistributions from "./modifyMemberDistributions";
import ModifySyndicateCapTable from "./modifySyndicateCapTable";
import MoreManagerActionCard from "./moreManagerActionCard";
import PreApproveDepositor from "./preApproveDepositor";
import RejectDepositOrMemberAddress from "./RejectDepositOrMemberAddress";
import RequestSocialProfile from "./requestSocialProfile";

const ManagerActions = () => {
  const {
    web3: { account },
  } = useSelector((state: RootState) => state.web3Reducer);

  const { syndicateContractInstance } = useSelector(
    (state: RootState) => state.syndicateInstanceReducer
  );

  const { syndicate } = useSelector(
    (state: RootState) => state.syndicatesReducer
  );

  const dispatch = useDispatch();

  const router = useRouter();

  const { syndicateAddress } = router.query;

  const [address, setAddress] = useState<string|string[]>('')

  useEffect(() => {
    if (router.isReady) {
      setAddress(syndicateAddress)
    }
  }, [router.isReady])

  const [
    showWalletConfirmationModal,
    setShowWalletConfirmationModal,
  ] = useState(false);

  const [showFinalState, setShowFinalState] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [showDistributeToken, setShowDistributeToken] = useState(false);
  const [showPreApproveDepositor, setShowPreApproveDepositor] = useState(false);
  const [showRequestSocialProfile, setShowRequestSocialProfile] = useState(
    false
  );
  const [showConfirmCloseSyndicate, setShowConfirmCloseSyndicate] = useState(
    false
  );

  const [showModifyCapTable, setShowModifyCapTable] = useState(false);
  const [showSyndicateNotModifiable, setShowSyndicateNotModifiable] = useState(
    false
  );

  const [
    showModifyMemberDistribution,
    setShowModifyMemberDistribution,
  ] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const { title, message, renderUnavailableState } = useUnavailableState('manage');

  const {
    nonModifiableSyndicateErrorText,
    enableDistributionToModifySyndicateText,
  } = syndicateActionConstants;

  const actions = [
    {
      icon: <img src="/images/socialProfile.svg" />,
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
      getSyndicateByAddress(address, syndicateContractInstance)
    );
  };

  /**
   * This function closes an open syndicate and calls function to update
   * syndicate data
   */
  const closeSyndicate = async () => {
    try {
      setShowWalletConfirmationModal(true);

      await syndicateContractInstance.methods
        .managerCloseSyndicate(address)
        .send({ from: account, gasLimit: 800000 })
        .on("transactionHash", () => {
          // close wallet confirmation modal
          setShowWalletConfirmationModal(false);

          setSubmitting(true);
        })
        .on("receipt", async () => {
          setSubmitting(false);

          setShowFinalState(true);
          setFinalStateHeaderText("Closed to Deposits");
          setFinalStateIcon("/images/checkCircle.svg");
          setFinalButtonText("Done");
        })
        .on("error", (error) => {
          // capture metamask error
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
        });
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

  /**
   * Shows modal to modify syndicate cap table if the syndicate is modifiable.
   * Otherwise, the manager is informed that s/he cannot modify syndicate cap
   * table
   */
  const showModifyCapTableModal = () => {
    setErrorMessage("");
    if (syndicate?.modifiable) {
      setShowModifyCapTable(true);
    } else {
      // tell manager this syndicate cannot be modified
      setShowSyndicateNotModifiable(true);

      // set message based on whether syndicate is modifiable and/or distributions are disabled
      if (!syndicate.modifable) {
        setErrorMessage(nonModifiableSyndicateErrorText);
      } else {
        setErrorMessage(enableDistributionToModifySyndicateText);
      }
    }
  };

  const [
    showRejectDepositOrMemberAddress,
    setShowRejectDepositOrMemberAddress,
  ] = useState(false);


  if (renderUnavailableState) {
    return (
      <div className="h-fit-content px-8 pb-4 pt-5 bg-gray-9 rounded-2xl">
        <div className="flex justify-between my-1 px-2">
          <UnavailableState title={title} message={message} />
        </div>
      </div>
    )
  }

  // if syndicateAddress !== account is true then it should redirect to deposit page hence the loader
  // DEV NOTES:
  //   improvements are welcomed. Its a hacky way while waiting for page to redirect.
  //   this happens because this component should be rendered after fetching account and syndicate info
  const isNotManager = syndicateAddress !== account;
  if (isNotManager) {
    return (
      <div className="h-fit-content rounded-custom p-4 md:mx-2 md:p-6 bg-gray-9 mt-6 md:mt-0 md:pb-2">
        <SkeletonLoader width="full" height="8" />
        <SkeletonLoader width="full" height="12" />
        <SkeletonLoader width="full" height="12" />
        <SkeletonLoader width="full" height="12" />
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="w-full mt-4 sm:mt-0">
        <FadeIn>
        <div className="h-fit-content rounded-custom p-4 md:mx-2 md:p-6 bg-gray-9 mt-6 md:mt-0 md:pb-2">
          <div className="text-xl font-inter">Manager Actions</div>

          <div className="flex h-12 rounded-custom items-center">
            <img src="/images/rightPointedHand.svg" className="mr-2" />
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
              icon={<img src="/images/closeIcon.svg" />}
              onClickHandler={() => setShowConfirmCloseSyndicate(true)}
            />
          ) : (
            <ManagerActionCard
              title={"Distribute tokens back to depositors"}
              description={
                "Distribute tokens back to depositors and make them available for withdraw."
              }
              icon={<img src="/images/server.svg" />}
              onClickHandler={() => setShowDistributeToken(true)}
            />
          )}

          {/* show pre-approve depositor option when syndicate is open and allowList is enabled */}
          {syndicate?.depositsEnabled && syndicate?.allowlistEnabled ? (
              <ManagerActionCard
                title={"Pre-approve depositor addresses"}
                description={
                  "Pre-approve accredited investor addresses that can deposit into this syndicate."
                }
                icon={<img src="/images/UserPlus.svg" />}
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
          {!syndicate?.open && syndicate?.distributionsEnabled ? (
            <MoreManagerActionCard
              icon={<img src="/images/invertedInfo.svg" />}
              text={"Modify Member distributions"}
              onClickHandler={setShowModifyMemberDistribution}
            />
          ) : null}

          {/* member deposits can be set if syndicate is open and modifiable */}
          {syndicate?.open && syndicate?.modifiable ? (
            <MoreManagerActionCard
              icon={<img src="/images/invertedInfo.svg" />}
              text={"Overwrite syndicate cap table"}
              onClickHandler={showModifyCapTableModal}
            />
          ) : null}

          {/* Member deposit or member address can only be reject/blocked 
          while the syndicate is open
          */}
          {syndicate?.open ? (
            <MoreManagerActionCard
              icon={<img src="/images/exclamation-triangle.svg" />}
              text={"Reject deposit or depositor address"}
              onClickHandler={() => setShowRejectDepositOrMemberAddress(true)}
            />
          ) : null}

          <MoreManagerActionCard
            icon={<img src="/images/settings.svg" />}
            text={"Change syndicate settings"}
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
        ) : showModifyCapTable ? (
          <ModifySyndicateCapTable
            {...{ showModifyCapTable, setShowModifyCapTable }}
          />
        ) : showRejectDepositOrMemberAddress ? (
          <RejectDepositOrMemberAddress
            {...{
              showRejectDepositOrMemberAddress,
              setShowRejectDepositOrMemberAddress,
            }}
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
        ) : showModifyMemberDistribution ? (
          <ModifyMemberDistributions
            {...{
              showModifyMemberDistribution,
              setShowModifyMemberDistribution,
            }}
          />
        ) : null}
      </div>
      {/* Confirm whether manager wants to close syndicate */}

      <StateModal show={showConfirmCloseSyndicate}>
        <>
          <div className="flex flex-col justify-centers m-auto mb-4">
            <p className="text-sm text-center mx-8 my-2 font-medium text-center leading-6 text-lg">
              Please confirm that you want to close this syndicate.
            </p>
            <p className="text-sm text-center mx-8 mt-2 opacity-60">
              If this was a mistake, please click{" "}
              <strong className="text-blue-cyan font-medium">cancel</strong>{" "}
              button below.
            </p>
            <p className="flex text-sm text-red-600 justify-center text-center mx-8 mt-4">
              <img src="/images/danger.svg" className="mx-2" />
              Closing a syndicate is irreversible.
            </p>
            <div className="flex text-sm justify-between text-center mx-8 mt-4">
              <PrimaryButton
                customClasses="border border-color-gray px-4 py-1 w-full"
                textColor="text-black"
                onClick={() => setShowConfirmCloseSyndicate(false)}>
                Cancel
              </PrimaryButton>
              <PrimaryButton
                customClasses="ml-8 bg-blue-light px-4 py-1 w-full"
                onClick={() => {
                  setShowConfirmCloseSyndicate(false);
                  closeSyndicate();
                }}>
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
            <img src="/images/danger.svg" className="mx-2" />
            {irreversibleActionText}
          </p>
        </div>
      </ConfirmStateModal>

      {/* Loading modal */}
      <PendingStateModal
        {...{
          show: submitting,
        }}>
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
