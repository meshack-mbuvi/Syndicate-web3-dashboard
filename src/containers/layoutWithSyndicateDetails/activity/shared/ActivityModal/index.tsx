import Modal, { ModalStyle } from "@/components/modal";
import { CategoryPill } from "@/containers/layoutWithSyndicateDetails/activity/shared/CategoryPill";
import InvestmentDetailsModal from "@/containers/layoutWithSyndicateDetails/activity/shared/InvestmentDetails/InvestmentDetails";
import {
  ANNOTATE_TRANSACTIONS,
  SET_MEMBER_SIGN_STATUS,
} from "@/graphql/mutations";
import { MEMBER_SIGNED_QUERY } from "@/graphql/queries";
import { useIsClubOwner } from "@/hooks/useClubOwner";
import { useDemoMode } from "@/hooks/useDemoMode";
import { AppState } from "@/state";
import { isDev } from "@/utils/environment";
import { useMutation, useQuery } from "@apollo/client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { OpenExternalLinkIcon } from "src/components/iconWrappers";

import TransactionDetails from "../TransactionDetails";
import ActivityNote from "./ActivityNote";

interface IActivityModal {
  showModal: boolean;
  closeModal: any;
  refetchTransactions: () => void;
  showNote: boolean;
  setShowNote: any;
}

/**
 * category pill component used either in read-only mode or as a drop-down.
 * @param showModal boolean for when to show and hide modal
 * @param closeModal callback to close modal
 * @param refetchTransactions callback to refetch transactions after annotating.
 * @returns
 */
const ActivityModal: React.FC<IActivityModal> = ({
  showModal,
  closeModal,
  refetchTransactions,
  showNote,
  setShowNote,
}) => {
  const {
    transactionsReducer: {
      currentTransaction: {
        category,
        note,
        readOnly,
        amount,
        transactionInfo,
        timestamp,
        tokenSymbol,
        tokenLogo,
        tokenName,
        hash,
        metadata,
        blockTimestamp,
      },
    },
    erc20TokenSliceReducer: {
      erc20Token: { address },
    },
  } = useSelector((state: AppState) => state);

  const isManager = useIsClubOwner();
  const etherScanBaseUrl = isDev
    ? "https://rinkeby.etherscan.io/tx"
    : "https://etherscan.io/tx";

  const isDemoMode = useDemoMode();

  const [setMemberHasSigned] = useMutation(SET_MEMBER_SIGN_STATUS, {
    context: { clientName: "backend" },
  });

  const { from } = transactionInfo;

  // find out whether member has signed document
  const { loading, data, refetch } = useQuery(MEMBER_SIGNED_QUERY, {
    variables: {
      clubAddress: address,
      address: from,
    },
    skip: !address || !from,
  });

  useEffect(() => {
    if (address && from) {
      refetch();
    }
  }, [address, from, loading]);

  const [adaptiveBackground, setAdaptiveBackground] = useState<string>("");
  const [etherscanLink, setEtherscanLink] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [showTransactionDetails, setShowTransactionDetails] =
    useState<boolean>(false);
  const [showDetailSection, setShowDetailSection] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [storedInvestmentDetails, setStoredInvestmentDetails] = useState<
    Record<string, number | string>
  >({});
  const [disableDropDown, setDisableDropDown] = useState(false);

  // we use this function to determine what happens when done button is hit from investmentDetails component
  const handleClick = () => {
    setEditMode(!editMode);
  };

  const handleAddDetails = () => {
    setShowDetailSection(true);
    setEditMode(true);
  };

  useEffect(() => {
    // Update with new details as the user selects different transactions
    setStoredInvestmentDetails({
      companyName: metadata?.companyName,
      investmentRound: metadata?.roundCategory,
      numberShares: metadata?.numberShares,
      numberTokens: metadata?.numberTokens,
      fullyDilutedOwnershipStake: metadata?.fullyDilutedOwnershipStake,
      investmentDate: metadata?.acquisitionDate
        ? new Date(metadata?.acquisitionDate).toISOString()
        : null,
      currentInvestmentValue: metadata?.preMoneyValuation,
      costBasis: metadata?.postMoneyValuation,
    });
  }, [metadata, blockTimestamp]);

  useEffect(() => {
    setEtherscanLink(`${etherScanBaseUrl}/${transactionInfo?.transactionHash}`);
  }, [transactionInfo?.transactionHash]);

  // text and icon to show based on category
  useEffect(() => {
    switch (selectedCategory) {
      case "EXPENSE":
        setAdaptiveBackground("bg-blue-darkGunMetal");
        break;
      case "INVESTMENT":
        setAdaptiveBackground("bg-blue-gunMetal");
        setShowTransactionDetails(true);
        break;
      case "DEPOSIT":
        setAdaptiveBackground("bg-blue-oxfordBlue");
        break;
      case "INVESTMENT_TOKEN":
        setAdaptiveBackground("bg-blue-darkGunMetal");
        break;
      case "OFF_CHAIN_INVESTMENT":
        setAdaptiveBackground("bg-blue-darkGunMetal");
        setShowTransactionDetails(true);
        break;
      case "OTHER":
        setAdaptiveBackground("bg-blue-darkGunMetal");
        break;
      default:
        setAdaptiveBackground("");
        break;
    }
  }, [selectedCategory]);

  const changeAdaptiveBackground = (selectedCategory: string) => {
    setSelectedCategory(selectedCategory);
  };

  useEffect(() => {
    if (note) {
      setShowNote(true);
    } else {
      setShowNote(false);
    }
  }, [note]);

  // Toggle details section
  useEffect(() => {
    const detailsHaveValues = Object.values(storedInvestmentDetails).reduce(
      (acc, curr) => {
        if (curr) {
          acc = true;
        }
        return acc;
      },
      false as boolean,
    );
    if (detailsHaveValues) {
      setShowDetailSection(true);
    } else {
      setShowDetailSection(false);
    }
  }, [storedInvestmentDetails]);

  const [annotationMutation, { loading: loadingNoteAnnotation }] = useMutation(
    ANNOTATE_TRANSACTIONS,
  );

  // save note/memo for a given transaction
  const saveTransactionNote = (noteValue: string) => {
    const inlineAnnotationData = [
      {
        memo: noteValue,
        transactionId: hash,
      },
    ];
    annotationMutation({
      variables: {
        transactionAnnotationList: inlineAnnotationData,
      },
      context: { clientName: "backend" },
    });
    if (!loadingNoteAnnotation) {
      refetchTransactions();
    }
  };

  const handleSetMemberHasSigned = async (event) => {
    event.preventDefault();

    const { data } = await setMemberHasSigned({
      variables: {
        clubAddress: address,
        address: from,
        hasSigned: true,
      },
    });

    if (data) {
      refetch();
    }
  };

  const toggleDropDown = (value: boolean) => {
    setDisableDropDown(value);
  };

  return (
    <Modal
      modalStyle={ModalStyle.DARK}
      show={showModal}
      closeModal={() => {
        closeModal();
        setEditMode(false);
        setShowDetailSection(false);
      }}
      customWidth="sm:w-564 w-full"
      customClassName="p-0"
      showCloseButton={false}
      outsideOnClick={true}
      showHeader={false}
      overflow="overflow-x-visible"
      overflowYScroll={false}
      isMaxHeightScreen={false}
      overflowXScroll={false}
      maxHeight={false}
    >
      <div className="relative">
        {isDemoMode && <div className="absolute inset-0 z-10" />}
        <div
          className={`flex rounded-t-2xl items-center flex-col relative py-10 px-5 ${adaptiveBackground} last:rounded-b-2xl`}
        >
          <div
            onMouseLeave={() => toggleDropDown(true)}
            onMouseEnter={() => toggleDropDown(false)}
          >
            <div className="mb-8">
              <CategoryPill
                category={category}
                outgoing={
                  transactionInfo?.isOutgoingTransaction
                    ? transactionInfo.isOutgoingTransaction
                    : false
                }
                readonly={readOnly}
                changeAdaptiveBackground={changeAdaptiveBackground}
                renderedInModal={true}
                refetchTransactions={refetchTransactions}
                transactionHash={transactionInfo?.transactionHash}
                disableDropDown={disableDropDown}
              />
            </div>
          </div>
          <div className="items-center flex flex-col">
            {transactionInfo && Object.keys(transactionInfo).length && (
              <TransactionDetails
                tokenLogo={tokenLogo}
                tokenSymbol={
                  category === "INVESTMENT" ||
                  category === "OFF_CHAIN_INVESTMENT"
                    ? "USD"
                    : tokenSymbol
                }
                tokenName={tokenName}
                transactionType={
                  transactionInfo.isOutgoingTransaction
                    ? "outgoing"
                    : "incoming"
                }
                isTransactionAnnotated={false}
                amount={
                  category === "INVESTMENT" ||
                  category === "OFF_CHAIN_INVESTMENT"
                    ? metadata?.postMoneyValuation
                    : amount
                }
                address={
                  transactionInfo.isOutgoingTransaction
                    ? transactionInfo.to
                    : transactionInfo.from
                }
                onModal={true}
                category={category}
                companyName={metadata?.companyName}
                round={metadata?.roundCategory}
              />
            )}

            {category !== "OFF_CHAIN_INVESTMENT" ? (
              <div className="text-gray-lightManatee text-sm mt-6 flex items-center justify-center">
                <a
                  className="flex cursor-pointer items-center"
                  href={`${etherscanLink}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    className="pr-2"
                    src={`/images/actionIcons/checkMark.svg`}
                    alt=""
                  />{" "}
                  Completed on {timestamp}
                  <OpenExternalLinkIcon className="text-gray-syn4 ml-2 w-3 h-3" />
                </a>
              </div>
            ) : null}
          </div>
        </div>

        {/* Show this component only when manager has not marked member signature status 
        
        Adding essential check for isManager. Members should not see this*/}

        {!data?.Financial_memberSigned &&
          !loading &&
          category === "DEPOSIT" &&
          isManager && (
            <div className="flex flex-col space-y-6 py-6 px-5">
              <div className="bg-gray-syn7 px-5 py-4 space-y-2 rounded-xl">
                <p className="text-gray-syn4 leading-6">
                  Has this member signed the associated legal agreements?
                </p>
                <button
                  className="text-blue"
                  onClick={handleSetMemberHasSigned}
                >
                  Yes, mark as signed
                </button>
              </div>
            </div>
          )}

        {/* Note and details section */}
        {category === "DEPOSIT" ||
        category === "UNCATEGORISED" ||
        category === null ||
        (!isManager && !note && !showDetailSection) ? null : (
          <div className="flex flex-col space-y-6 py-6 px-5">
            {/* note */}
            {!showNote && isManager ? (
              <button
                className="flex items-center px-5 py-4 text-base text-gray-lightManatee bg-blue-darkGunMetal rounded-1.5lg leading-6 cursor-pointer"
                onClick={() => setShowNote(true)}
              >
                <Image
                  src={`/images/actionIcons/plus-sign.svg`}
                  height={16}
                  width={16}
                />
                <span className="ml-2">Add note</span>
              </button>
            ) : (
              <div className="">
                {!note && !isManager ? null : (
                  <ActivityNote
                    saveTransactionNote={saveTransactionNote}
                    setShowNote={setShowNote}
                  />
                )}
              </div>
            )}

            {/* details */}
            {(category === "INVESTMENT" ||
              category === "OFF_CHAIN_INVESTMENT") && (
              <div>
                {/* Checks if the stored investment details has empty values */}
                {!showDetailSection && !editMode && isManager && (
                  <button
                    className="w-full flex items-center px-5 py-4 text-base text-gray-lightManatee bg-blue-darkGunMetal rounded-1.5lg leading-6 cursor-pointer"
                    onClick={() => handleAddDetails()}
                  >
                    <Image
                      src={`/images/actionIcons/plus-sign.svg`}
                      height={16}
                      width={16}
                    />
                    <span className="ml-2">Add details</span>
                  </button>
                )}
                {/* implement Details edit and view mode here */}
                {showDetailSection || editMode ? (
                  <InvestmentDetailsModal
                    showModal={showTransactionDetails}
                    editMode={editMode}
                    readonly={true}
                    onClick={handleClick}
                    storedInvestmentDetails={storedInvestmentDetails}
                    transactionId={hash}
                    setStoredInvestmentDetails={setStoredInvestmentDetails}
                    isManager={isManager}
                    onSuccessfulAnnotation={() => {
                      refetchTransactions();
                    }}
                  />
                ) : null}
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ActivityModal;
