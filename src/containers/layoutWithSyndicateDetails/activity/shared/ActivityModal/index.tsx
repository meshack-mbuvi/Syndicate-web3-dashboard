import { amplitudeLogger, Flow } from '@/components/amplitude';
import { TRANSACTION_DETAIL_ADD } from '@/components/amplitude/eventNames';
import { DistributionMembersTable } from '@/components/distributions/membersTable';
import Modal, { ModalStyle } from '@/components/modal';
import { SimpleTable } from '@/components/simpleTable';
import { memberDetail } from '@/containers/distribute/DistributionMembers';
import { CategoryPill } from '@/containers/layoutWithSyndicateDetails/activity/shared/CategoryPill';
import InvestmentDetailsModal from '@/containers/layoutWithSyndicateDetails/activity/shared/InvestmentDetails/InvestmentDetails';
import {
  ANNOTATE_TRANSACTIONS,
  SET_MEMBER_SIGN_STATUS
} from '@/graphql/mutations';
import { MEMBER_SIGNED_QUERY } from '@/graphql/queries';
import useClubTokenMembers from '@/hooks/clubs/useClubTokenMembers';
import { useDemoMode } from '@/hooks/useDemoMode';
import { getInput } from '@/hooks/useFetchRecentTransactions';
import { SUPPORTED_GRAPHS } from '@/Networks/backendLinks';
import { AppState } from '@/state';
import { CurrentTransaction } from '@/state/erc20transactions/types';
import { getWeiAmount } from '@/utils/conversions';
import {
  numberWithCommas,
  removeTrailingDecimalPoint
} from '@/utils/formattedNumbers';
import { useMutation, useQuery } from '@apollo/client';
import Image from 'next/image';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { OpenExternalLinkIcon } from 'src/components/iconWrappers';
import { BatchIdTokenDetails } from '../../ActivityTable/index';
import TransactionDetails from '../TransactionDetails';
import ActivityNote from './ActivityNote';

interface IActivityModal {
  showModal: boolean;
  isAnnotationsModalShown: boolean;
  closeModal: any;
  refetchTransactions: () => void;
  showNote: boolean;
  setShowNote: any;
  isOwner: boolean;
  currentTransaction: CurrentTransaction;
  currentBatchIdentifier: string;
  batchIdentifiers: BatchIdTokenDetails;
  setCurrentTransaction: Dispatch<SetStateAction<CurrentTransaction>>;
}

type TokenDetailsList = {
  name: string;
  symbol: string;
  icon: string | undefined;
  amount: string;
};

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
  isAnnotationsModalShown,
  refetchTransactions,
  showNote,
  setShowNote,
  isOwner,
  currentTransaction,
  currentBatchIdentifier,
  batchIdentifiers,
  setCurrentTransaction
}) => {
  const {
    web3Reducer: {
      web3: { web3, activeNetwork, account }
    },
    erc20TokenSliceReducer: { erc20Token },
    erc20TokenSliceReducer: {
      erc20Token: { address }
    }
  } = useSelector((state: AppState) => state);

  const {
    category,
    note,
    readOnly,
    transactionInfo,
    timestamp,
    hash,
    metadata,
    blockTimestamp
  } = currentTransaction;

  const [tokenDetailsList, setTokenDetailsList] = useState<
    Array<TokenDetailsList>
  >([]);

  useEffect(() => {
    if (!batchIdentifiers || !currentBatchIdentifier) return;
    const tokenDetailsList: Array<TokenDetailsList> = [];
    batchIdentifiers[currentBatchIdentifier].map((transaction) => {
      if (transaction.transfers[0].contractAddress !== '') {
        tokenDetailsList.push({
          name: String(transaction.transfers[0].tokenName),
          symbol: String(transaction.transfers[0].tokenSymbol),
          icon: transaction.transfers[0].tokenLogo,
          amount: getWeiAmount(
            web3,
            String(transaction.transfers[0].value),
            Number(transaction.transfers[0].tokenDecimal),
            false
          )
        });
      } else {
        tokenDetailsList.push({
          name: activeNetwork.nativeCurrency.name,
          symbol: activeNetwork.nativeCurrency.symbol,
          icon: activeNetwork.nativeCurrency.logo,
          amount: getWeiAmount(
            web3,
            String(transaction.transfers[0].value),
            Number(activeNetwork.nativeCurrency.decimals),
            false
          )
        });
      }
    });
    setTokenDetailsList(tokenDetailsList);
  }, [
    activeNetwork.nativeCurrency.decimals,
    activeNetwork.nativeCurrency.logo,
    activeNetwork.nativeCurrency.name,
    activeNetwork.nativeCurrency.symbol,
    batchIdentifiers,
    currentBatchIdentifier,
    web3
  ]);

  const isDemoMode = useDemoMode();

  const [setMemberHasSigned] = useMutation(SET_MEMBER_SIGN_STATUS, {
    context: {
      clientName: SUPPORTED_GRAPHS.BACKEND,
      chainId: activeNetwork.chainId
    }
  });

  const { from } = transactionInfo;

  // find out whether member has signed document
  const { loading, data, refetch } = useQuery(MEMBER_SIGNED_QUERY, {
    variables: {
      clubAddress: address,
      address: from
    },
    context: {
      clientName: SUPPORTED_GRAPHS.BACKEND,
      chainId: activeNetwork.chainId
    },
    skip: !address || !from || !activeNetwork.chainId
  });

  useEffect(() => {
    if (address && from && activeNetwork.chainId) {
      refetch();
    }
  }, [address, from, loading, activeNetwork.chainId]);

  const [adaptiveBackground, setAdaptiveBackground] = useState<string>('');
  const [blockExplorerLink, setblockExplorerLink] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showTransactionDetails, setShowTransactionDetails] =
    useState<boolean>(false);
  const [showDetailSection, setShowDetailSection] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [storedInvestmentDetails, setStoredInvestmentDetails] = useState<
    Record<string, number | string>
  >({});
  const [disableDropDown, setDisableDropDown] = useState(false);
  const [isDistributionTableExpanded, setIsDistributionTableExpanded] =
    useState(isDemoMode);
  const [tokensTableRows, setTokensTableRows] = useState([]);
  const [memberDetails, setMemberDetails] = useState<memberDetail[]>([]);
  const [activeAddresses, setActiveAddresses] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const { clubMembers, isFetchingMembers } = useClubTokenMembers();

  /**
   * Get addresses of all club members
   */
  useEffect(() => {
    const activeAddresses: string[] = [];
    clubMembers.forEach((member) => activeAddresses.push(member.memberAddress));
    setActiveAddresses(activeAddresses);
  }, [JSON.stringify(clubMembers)]);

  // prepare member data here
  useEffect(() => {
    if (!clubMembers || !batchIdentifiers || !currentBatchIdentifier) return;
    if (clubMembers.length && batchIdentifiers[currentBatchIdentifier].length) {
      const memberDetails = clubMembers.map(
        ({ ownershipShare, clubTokens, memberAddress, ...rest }) => {
          return {
            ...rest,
            ownershipShare,
            address: memberAddress,
            clubTokenHolding: +clubTokens,
            distributionShare: +numberWithCommas(ownershipShare.toFixed(4)),
            receivingTokens: batchIdentifiers[currentBatchIdentifier].map(
              ({ tokenAmount, tokenSymbol, icon }: any) => {
                return {
                  amount: (+ownershipShare * +tokenAmount) / 100,
                  tokenSymbol,
                  tokenIcon: icon
                };
              }
            )
          };
        }
      );

      setMemberDetails(memberDetails);
    } else {
      setMemberDetails([]);
    }
  }, [
    isFetchingMembers,
    JSON.stringify(clubMembers),
    batchIdentifiers,
    currentBatchIdentifier
  ]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchValue(e.target.value);
  };

  const toggleEditDistribution = (): void => {
    setIsEditing(!isEditing);
  };

  const clearSearchValue = (e: React.MouseEvent<HTMLElement>): void => {
    e.preventDefault();
    setSearchValue('');
  };

  useEffect(() => {
    if (!batchIdentifiers || !currentBatchIdentifier) return;
    const rows: any = batchIdentifiers[currentBatchIdentifier].map((token) => {
      return {
        title: token.tokenName,
        value: `${removeTrailingDecimalPoint(String(token.tokenAmount))} ${
          token.tokenSymbol
        }`,
        externalLink: blockExplorerLink
      };
    });
    setTokensTableRows(rows);
  }, [batchIdentifiers, currentBatchIdentifier, blockExplorerLink, web3]);

  // we use this function to determine what happens when done button is hit from investmentDetails component
  const handleClick = () => {
    setEditMode(!editMode);
    amplitudeLogger(TRANSACTION_DETAIL_ADD, {
      flow: Flow.CLUB_MANAGE
    });
  };

  const handleAddDetails = () => {
    setShowDetailSection(true);
    setEditMode(true);
  };

  useEffect(() => {
    // Update with new details as the user selects different transactions
    setStoredInvestmentDetails({
      // @ts-expect-error TS(2322): Type 'string | undefined' is not assignable to typ... Remove this comment to see the full error message
      companyName: metadata?.companyName,
      // @ts-expect-error metadata.RoundCategory | undefined' is not assignable to type 'string | number'.
      investmentRound: metadata?.roundCategory,
      // @ts-expect-error TS(2322): Type 'string | undefined' is not assignable to typ... Remove this comment to see the full error message
      numberShares: metadata?.numberShares,
      // @ts-expect-error TS(2322): Type 'string | undefined' is not assignable to typ... Remove this comment to see the full error message
      numberTokens: metadata?.numberTokens,
      // @ts-expect-error TS(2322): Type 'string | undefined' is not assignable to typ... Remove this comment to see the full error message
      fullyDilutedOwnershipStake: metadata?.fullyDilutedOwnershipStake,
      // @ts-expect-error TS(2322): Type 'string | null' is not assignable to type 'st... Remove this comment to see the full error message
      investmentDate: metadata?.acquisitionDate
        ? new Date(metadata?.acquisitionDate).toISOString()
        : null,
      // @ts-expect-error TS(2322): Type 'string | undefined' is not assignable to typ... Remove this comment to see the full error message
      currentInvestmentValue: metadata?.preMoneyValuation,
      // @ts-expect-error TS(2322): Type 'string | undefined' is not assignable to typ... Remove this comment to see the full error message
      costBasis: metadata?.postMoneyValuation
    });
  }, [metadata, blockTimestamp]);

  useEffect(() => {
    setblockExplorerLink(
      `${activeNetwork.blockExplorer.baseUrl}/tx/${transactionInfo?.transactionHash}`
    );
  }, [transactionInfo?.transactionHash]);

  // text and icon to show based on category
  useEffect(() => {
    switch (selectedCategory) {
      case 'EXPENSE':
        setAdaptiveBackground('bg-blue-darkGunMetal');
        break;
      case 'INVESTMENT':
        setAdaptiveBackground('bg-blue-gunMetal');
        setShowTransactionDetails(true);
        break;
      case 'DEPOSIT':
        setAdaptiveBackground('bg-blue-oxfordBlue');
        break;
      case 'INVESTMENT_TOKEN':
        setAdaptiveBackground('bg-blue-darkGunMetal');
        break;
      case 'OFF_CHAIN_INVESTMENT':
        setAdaptiveBackground('bg-blue-darkGunMetal');
        setShowTransactionDetails(true);
        break;
      case 'DISTRIBUTION':
        setAdaptiveBackground('bg-green-distribution');
        break;
      case 'OTHER':
        setAdaptiveBackground('bg-blue-darkGunMetal');
        break;
      default:
        setAdaptiveBackground('');
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
      false as boolean
    );
    if (detailsHaveValues) {
      setShowDetailSection(true);
    } else {
      setShowDetailSection(false);
    }
  }, [storedInvestmentDetails]);

  const [annotationMutation, { loading: loadingNoteAnnotation }] = useMutation(
    ANNOTATE_TRANSACTIONS
  );

  // save note/memo for a given transaction
  const saveTransactionNote = (noteValue: string) => {
    const inlineAnnotationData = [
      {
        memo: noteValue,
        transactionId: hash
      }
    ];
    annotationMutation({
      variables: {
        transactionAnnotationList: inlineAnnotationData,
        chainId: activeNetwork.chainId,
        input: getInput(`${erc20Token.address}:${account}`)
      },
      context: {
        clientName: SUPPORTED_GRAPHS.BACKEND,
        chainId: activeNetwork.chainId
      }
    });
    if (!loadingNoteAnnotation) {
      refetchTransactions();
    }
  };

  const handleSetMemberHasSigned = async (event: any) => {
    event.preventDefault();

    const { data } = await setMemberHasSigned({
      variables: {
        clubAddress: address,
        address: from,
        hasSigned: true
      }
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
        setIsDistributionTableExpanded(false);
      }}
      customWidth={`w-full sm:${
        isDistributionTableExpanded ? 'w-10/12' : 'w-564'
      }`}
      customClassName="p-0 duration-300"
      showCloseButton={false}
      outsideOnClick={true}
      showHeader={false}
      overflow="overflow-y-scroll "
      overflowYScroll={false}
      isMaxHeightScreen={true}
      overflowXScroll={false}
      maxHeight={false}
    >
      <>
        {showModal && (
          <div className="relative">
            {isDemoMode && <div className="absolute inset-0 z-10" />}
            <div
              className={`flex rounded-t-2xl items-center flex-col relative py-10 px-5 ${adaptiveBackground} last:rounded-b-2xl`}
            >
              <div
                onMouseLeave={(): void => toggleDropDown(true)}
                onMouseEnter={(): void => toggleDropDown(false)}
              >
                <div className="mb-8">
                  <CategoryPill
                    isOwner={isOwner}
                    category={category}
                    outgoing={
                      transactionInfo?.isOutgoingTransaction
                        ? transactionInfo.isOutgoingTransaction
                        : false
                    }
                    readonly={category === 'DISTRIBUTION' ? true : readOnly}
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
                    contractAddress={address}
                    tokenDetails={tokenDetailsList}
                    isAnnotationsModalShown={isAnnotationsModalShown}
                    transactionType={
                      transactionInfo.isOutgoingTransaction
                        ? 'outgoing'
                        : 'incoming'
                    }
                    isTransactionAnnotated={false}
                    addresses={[
                      transactionInfo.isOutgoingTransaction
                        ? transactionInfo.to
                        : transactionInfo.from
                    ]}
                    onModal={true}
                    category={category}
                    companyName={metadata?.companyName}
                    round={metadata?.roundCategory}
                    numClubMembers={clubMembers.length}
                  />
                )}

                {category !== 'OFF_CHAIN_INVESTMENT' ? (
                  <div className="text-gray-lightManatee text-sm mt-6 flex items-center justify-center">
                    <a
                      className="flex cursor-pointer items-center"
                      href={`${blockExplorerLink}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img
                        className="pr-2"
                        src={`/images/actionIcons/checkMark.svg`}
                        alt=""
                      />{' '}
                      Completed on {timestamp}
                      <OpenExternalLinkIcon className="text-gray-syn4 ml-2 w-3 h-3" />
                    </a>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Show this component only when manager has not marked member signature status 
        
        Adding essential check for isOwner. Members should not see this*/}

            {!data?.Financial_memberSigned &&
              !loading &&
              category === 'DEPOSIT' &&
              isOwner && (
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
            {category === 'DEPOSIT' ||
            category === 'UNCATEGORIZED' ||
            category === null ||
            (!isOwner && !note && !showDetailSection) ? null : (
              <div
                className={`${
                  isDistributionTableExpanded
                    ? 'flex flex-col space-y-6 pt-6 pb-0 px-5'
                    : 'flex flex-col space-y-6 pt-6 pb-6 px-5'
                }`}
              >
                {/* note */}
                {!showNote && isOwner ? (
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
                    {!note && !isOwner ? null : (
                      <ActivityNote
                        saveTransactionNote={saveTransactionNote}
                        setShowNote={setShowNote}
                        isOwner={isOwner}
                        currentTransaction={currentTransaction}
                        setCurrentTransaction={setCurrentTransaction}
                      />
                    )}
                  </div>
                )}

                {/* details */}
                {(category === 'INVESTMENT' ||
                  category === 'OFF_CHAIN_INVESTMENT') && (
                  <div>
                    {/* Checks if the stored investment details has empty values */}
                    {!showDetailSection && !editMode && isOwner && (
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
                        isManager={isOwner}
                        blockTimestamp={Number(blockTimestamp)}
                        onSuccessfulAnnotation={() => {
                          refetchTransactions();
                        }}
                      />
                    ) : null}
                  </div>
                )}
              </div>
            )}

            {category === 'DISTRIBUTION' && (
              <>
                <div
                  className={`${
                    isDistributionTableExpanded
                      ? 'max-h-screen opacity-100 ease-in'
                      : 'max-h-0 opacity-0 ease-out'
                  } duration-500 overflow-hidden transition-all`}
                >
                  <DistributionMembersTable
                    isEditing={false}
                    hideSearch={false}
                    hideEdit={true}
                    membersDetails={memberDetails}
                    tokens={batchIdentifiers[currentBatchIdentifier]}
                    handleIsEditingChange={toggleEditDistribution}
                    handleSearchChange={handleSearchChange}
                    searchValue={searchValue}
                    clearSearchValue={clearSearchValue}
                    activeAddresses={activeAddresses}
                    handleActiveAddressesChange={setActiveAddresses}
                    extraClasses={`px-10 -pt-10 pb-10 no-scroll-bar`}
                    fadeGradientColorHEX="#131416"
                  />
                </div>
                <div
                  className={`${
                    !isDistributionTableExpanded
                      ? 'max-h-screen opacity-100 ease-in'
                      : 'max-h-0 opacity-0 ease-out'
                  } duration-500 overflow-hidden transition-all`}
                >
                  <div className="px-10 mb-2">Tokens distributed</div>
                  <SimpleTable rows={tokensTableRows} extraClasses="mx-10" />
                </div>
                <button
                  className="space-x-2 flex justify-center w-full items-center px-10 text-blue-neptune pb-8"
                  onClick={() => {
                    setIsDistributionTableExpanded(
                      !isDistributionTableExpanded
                    );
                  }}
                >
                  <img
                    src={
                      isDistributionTableExpanded
                        ? '/images/minimize-blue.svg'
                        : '/images/maximize-blue.svg'
                    }
                    alt="Resize icon"
                  />
                  <div>
                    {isDistributionTableExpanded
                      ? 'View summary'
                      : 'View by members'}
                  </div>
                </button>
              </>
            )}
          </div>
        )}
      </>
    </Modal>
  );
};

export default ActivityModal;
