import React, { useEffect, useState } from "react";
import Modal, { ModalStyle } from "@/components/modal";
import Image from "next/image";
import { isDev } from "@/utils/environment";
import { ExternalLinkIcon } from "src/components/iconWrappers";
import TransactionDetails from "../TransactionDetails";
import { CategoryPill } from "@/containers/layoutWithSyndicateDetails/activity/shared/CategoryPill";
import ActivityNote from "./ActivityNote";
import InvestmentDetailsModal from "@/containers/layoutWithSyndicateDetails/activity/shared/InvestmentDetails/InvestmentDetails";
import { ANNOTATE_TRANSACTIONS } from "@/graphql/mutations";
import { useMutation } from "@apollo/client";
import { useSelector } from "react-redux";
import { AppState } from "@/state";
import { investmentRounds } from "../InvestmentDetails/InvestmentDetailsConstants";

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
    erc20TokenSliceReducer: { erc20Token },
    web3Reducer: {
      web3: { account },
    },
  } = useSelector((state: AppState) => state);
  const isManager = erc20Token.isOwner;
  const etherScanBaseUrl = isDev ? 'https://rinkeby.etherscan.io/tx' : 'https://etherscan.io/tx';

  const [adaptiveBackground, setadaptiveBackground] = useState<string>("");
  const [etherscanLink, setEtherscanLink] = useState<string>("");
  // const [showNote, setShowNote] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [showTransactionDetails, setShowTransactionDetails] =
    useState<boolean>(false);
  const [showDetailSection, setShowDetailSection] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [storedInvestmentDetails, setStoredInvestmentDetails] = useState<
    Record<string, number | string>
  >({});

  // we use this function to determine what happens when done button is hit from investmentDetails component
  const handleClick = () => {
    setEditMode(!editMode);

    refetchTransactions();
  };

  const handleAddDetails = () => {
    setShowDetailSection(true);
    setEditMode(true);
  };

  useEffect(() => {
    // Update with new details as the user selects different transactions
    setStoredInvestmentDetails({
      companyName: metadata?.companyName,
      investmentRound: metadata?.roundCategory
        ? investmentRounds.find(
            (option) => option.value === metadata?.roundCategory?.toString(),
          )?.text
        : null,
      shareAmount: metadata?.sharesAmount,
      tokenAmount: metadata?.tokenAmount,
      ownershipStake: metadata?.equityStake,
      investmentDate: metadata?.acquisitionDate
        ? new Date(metadata?.acquisitionDate).toISOString()
        : null,
      currentInvestmentValue: metadata?.preMoneyValuation,
      costBasis: metadata?.postMoneyValuation,
    });
  }, [metadata, blockTimestamp]);

  useEffect(() => {
    setEtherscanLink(`${etherScanBaseUrl}/${transactionInfo?.transactionHash}`)
  }, [transactionInfo?.transactionHash]);

  // text and icon to show based on category
  useEffect(() => {
    switch (selectedCategory) {
      case "EXPENSE":
        setadaptiveBackground("bg-blue-darkGunMetal");
        break;
      case "INVESTMENT":
        setadaptiveBackground("bg-blue-gunMetal");
        setShowTransactionDetails(true);
        break;
      case "DEPOSIT":
        setadaptiveBackground("bg-blue-oxfordBlue rounded-b-2xl");
        break;
      case "INVESTMENT_TOKEN":
        setadaptiveBackground("bg-blue-darkGunMetal");
        break;
      case "OTHER":
        setadaptiveBackground("bg-blue-darkGunMetal");
        break;
      default:
        setadaptiveBackground("");
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

  return (
    <Modal
      modalStyle={ModalStyle.DARK}
      show={showModal}
      closeModal={() => {
        closeModal();
        setEditMode(false);
        setShowDetailSection(false);
      }}
      customWidth="w-564"
      customClassName="p-0"
      showCloseButton={false}
      outsideOnClick={true}
      showHeader={false}
      overflow="overflow-x-visible"
      overflowYScroll={false}
      isMaxHeightScreen={false}
    >
      <div>
        <div
          className={`flex rounded-t-2xl items-center flex-col relative py-10 px-5 ${adaptiveBackground} ${
            !isManager && !note && "rounded-b-2xl"
          }`}
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
            />
          </div>
          <div className="items-center flex flex-col">
            {transactionInfo && Object.keys(transactionInfo).length > 0 && (
              <TransactionDetails
                tokenLogo={tokenLogo}
                tokenSymbol={tokenSymbol}
                tokenName={tokenName}
                transactionType={
                  transactionInfo.isOutgoingTransaction
                    ? "outgoing"
                    : "incoming"
                }
                isTransactionAnnotated={false}
                amount={amount}
                address={
                  transactionInfo.isOutgoingTransaction
                    ? transactionInfo.to
                    : transactionInfo.from
                }
                onModal={true}
                category={category}
                companyName={metadata?.companyName}
              />
            )}

            <div className="text-gray-lightManatee text-sm mt-6 flex items-center justify-center">
              <a
                className="flex cursor-pointer"
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
                <ExternalLinkIcon grayIcon className="ml-2 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Note and details section */}
        {category === "DEPOSIT" ||
        category === "UNCATEGORISED" ||
        category === null ||
        (!isManager && !note && !showDetailSection) ? null : (
          <div className="flex flex-col space-y-6 py-6 px-5">
            {/* note */}
            {!showNote && isManager ? (
              <div
                className="flex items-center px-5 py-4 text-base text-gray-lightManatee bg-blue-darkGunMetal rounded-1.5lg leading-6 cursor-pointer"
                onClick={() => setShowNote(true)}
              >
                <Image
                  src={`/images/actionIcons/plus-sign.svg`}
                  height={16}
                  width={16}
                />
                <span className="ml-2">Add note</span>
              </div>
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
            {category === "INVESTMENT" && (
              <div>
                {/* Checks if the stored investment details has empty values */}
                {!showDetailSection && !editMode && isManager && (
                  <div
                    className="flex items-center px-5 py-4 text-base text-gray-lightManatee bg-blue-darkGunMetal rounded-1.5lg leading-6 cursor-pointer"
                    onClick={() => handleAddDetails()}
                  >
                    <Image
                      src={`/images/actionIcons/plus-sign.svg`}
                      height={16}
                      width={16}
                    />
                    <span className="ml-2">Add details</span>
                  </div>
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
