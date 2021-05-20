import { ErrorModal } from "@/components/shared";
import { PendingStateModal } from "@/components/shared/transactionStates";
import ConfirmStateModal from "@/components/shared/transactionStates/confirm";
import FinalStateModal from "@/components/shared/transactionStates/final";
import {
  confirmCloseSyndicateText,
  confirmingTransaction,
  irreversibleActionText,
  rejectTransactionText,
  syndicateActionConstants,
  waitTransactionTobeConfirmedText,
} from "@/components/syndicates/shared/Constants";
import { getMetamaskError } from "@/helpers";
import { getSyndicateByAddress } from "@/redux/actions/syndicates";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { RootStateOrAny, useDispatch, useSelector } from "react-redux";
import ErrorBoundary from "../../components/errorBoundary";
import DistributeToken from "./distributeToken";
import ManagerAction from "./ManagerAction";
import ModifySyndicateCapTable from "./modifySyndicateCapTable";
import MoreManagerActions from "./MoreManagerActions";
import PreApproveDepositor from "./preApproveDepositor";

const ManagerActions = () => {
  const {
    web3: { account },
  } = useSelector((state: RootStateOrAny) => state.web3Reducer);

  const { syndicateContractInstance } = useSelector(
    (state: RootStateOrAny) => state.syndicateInstanceReducer
  );

  const { syndicate } = useSelector(
    (state: RootStateOrAny) => state.syndicatesReducer
  );

  const dispatch = useDispatch();

  const router = useRouter();

  const { syndicateAddress } = router.query;

  const [
    showWalletConfirmationModal,
    setShowWalletConfirmationModal,
  ] = useState(false);

  const [showFinalState, setShowFinalState] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [showDistributeToken, setShowDistributeToken] = useState(false);
  const [showPreApproveDepositor, setShowPreApproveDepositor] = useState(false);
  const [showModifyCapTable, setShowModifyCapTable] = useState(false);
  const [showSyndicateNotModifiable, setShowSyndicateNotModifiable] = useState(
    false
  );
  const [errorMessage, setErrorMessage] = useState("");

  const {
    nonModifiableSyndicateErrorText,
    enableDistributionToModifySyndicateText,
  } = syndicateActionConstants;

  const actions = [
    {
      icon: <img src="/images/socialProfile.svg" />,
      title: "Create a public-facing social profile",
      onClickHandler: () => console.log("move to create social profile"),
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
      getSyndicateByAddress(syndicateAddress, syndicateContractInstance)
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
        .closeSyndicate(syndicateAddress)
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

  const moreActions = [
    {
      icon: <img src="/images/invertedInfo.svg" />,
      text: "Overwrite syndicate cap table",
      onClickHandler: () => showModifyCapTableModal(),
    },
    {
      icon: <img src="/images/exclamation-triangle.svg" />,
      text: "Reject deposit or depositor address",
    },
    {
      icon: <img src="/images/settings.svg" />,
      text: "Change syndicate settings",
    },
  ];

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

  return (
    <ErrorBoundary>
      <div className="w-full lg:w-2/5 mt-4 sm:mt-0">
        <div className="h-fit-content rounded-custom p-4 md:mx-2 md:p-6 bg-gray-9 mt-6 md:mt-0">
          <div className="text-xl font-inter">Manager Actions</div>
          <div className="flex h-12 rounded-custom items-center">
            <img src="/images/rightPointedHand.svg" className="mr-2" />
            <div className="text-gray-dim leading-snug">
              You manage this syndicate
            </div>
          </div>
          {/* show set distribution option when syndicate is closed */}
          {syndicate?.syndicateOpen ? (
            <ManagerAction
              title={"Close syndicate"}
              description={
                "Close this syndicate and stop accepting deposits. This action is irreversible."
              }
              icon={<img src="/images/closeIcon.svg" />}
              onClickHandler={() => closeSyndicate()}
            />
          ) : (
            <ManagerAction
              title={"Distribute tokens back to depositors"}
              description={
                "Distribute tokens back to depositors and make them available for withdraw."
              }
              icon={<img src="/images/server.svg" />}
              onClickHandler={() => setShowDistributeToken(true)}
            />
          )}

          {/* show pre-approve depositor option when syndicate is open and allowList is enabled */}
          {syndicate?.syndicateOpen && syndicate?.allowlistEnabled ? (
            <ManagerAction
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
              <ManagerAction
                title={title}
                description={description}
                icon={icon}
                onClickHandler={onClickHandler}
                key={title}
              />
            );
          })}
        </div>
        <div className="p-0 md:p-2">
          <div className="font-semibold tracking-widest text-sm leading-6 text-gray-matterhorn my-6 mx-4">
            MORE
          </div>
          {moreActions.map(({ icon, text, onClickHandler }) => (
            <MoreManagerActions
              key={text}
              icon={icon}
              text={text}
              onClickHandler={onClickHandler}
            />
          ))}
        </div>
        {showDistributeToken ? (
          <DistributeToken
            {...{ showDistributeToken, setShowDistributeToken }}
          />
        ) : showPreApproveDepositor ? (
          <PreApproveDepositor
            {...{ showPreApproveDepositor, setShowPreApproveDepositor }}
          />
        ) : showModifyCapTable ? (
          <ModifySyndicateCapTable
            {...{ showModifyCapTable, setShowModifyCapTable }}
          />
        ) : showSyndicateNotModifiable ? (
          <ErrorModal
            {...{
              show: showSyndicateNotModifiable,
              setShowErrorMessage: setShowSyndicateNotModifiable,
              setErrorMessage,
              errorMessage,
            }}
          />
        ) : null}
      </div>
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
      />
    </ErrorBoundary>
  );
};

export default ManagerActions;
