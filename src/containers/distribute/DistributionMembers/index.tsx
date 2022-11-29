import { ClubERC20Contract } from '@/ClubERC20Factory/clubERC20';
import { estimateGas } from '@/ClubERC20Factory/shared/getGasEstimate';
import { amplitudeLogger, Flow } from '@/components/amplitude';
import {
  DISTRIBUTION_SUBMIT_CLICK,
  DISTRIBUTION_TRANSACTION
} from '@/components/amplitude/eventNames';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import { CTAButton, CTAType } from '@/components/CTAButton';
import { ConfirmDistributionsModal } from '@/components/distributions/confirmModal';
import { DistributionsDisclaimerModal } from '@/components/distributions/disclaimerModal';
import { DistributionMembersTable } from '@/components/distributions/membersTable';
import { ShareSocialModal } from '@/components/distributions/shareSocialModal';
import {
  ProgressDescriptor,
  ProgressDescriptorState
} from '@/components/progressDescriptor';
import { Spinner } from '@/components/shared/spinner';
import { ClubHeader } from '@/components/syndicates/shared/clubHeader';
import { resetClubState, setERC20Token } from '@/helpers/erc20TokenDetails';
import { useClubDepositsAndSupply } from '@/hooks/clubs/useClubDepositsAndSupply';
import useClubTokenMembers from '@/hooks/clubs/useClubTokenMembers';
import { useDemoMode } from '@/hooks/useDemoMode';
import { useGraphSyncState } from '@/hooks/utils/useGraphState';
import { CONTRACT_ADDRESSES } from '@/Networks';
import { AppState } from '@/state';
import { IToken } from '@/state/assets/types';
import { setERC20TokenContract } from '@/state/erc20token/slice';
import { Status } from '@/state/wallet/types';
import { isZeroAddress } from '@/utils';
import ERC20ABI from '@/utils/abi/erc20.json';
import { getWeiAmount } from '@/utils/conversions';
import { numberWithCommas } from '@/utils/formattedNumbers';
import { mockActiveERC20Token } from '@/utils/mockdata';
import { Contract } from 'ethers';
import router, { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import DistributionHeader from '../DistributionHeader';
import { GraphStatusWarningModal } from './graphStatusWarning';

type step = {
  title: string;
  action: string;
  tokenDecimal: number;
  contractAddress: string;
  tokenAmount: string;
  maximumTokenAmount: string;
  symbol: string;
  isInErrorState: boolean;
  status: string;
};

type Props = {
  tokens: IToken[];
  handleExitClick: () => void;
};

export interface memberDetail {
  ensName: string;
  avatar?: string;
  address: string;
  createdAt: string;
  clubTokenHolding?: number;
  distributionShare: number;
  ownershipShare: number;
  receivingTokens: {
    amount: number;
    tokenSymbol: string;
    tokenIcon: string;
  }[];
}
[];

const ReviewDistribution: React.FC<Props> = ({
  tokens,
  handleExitClick
}: Props) => {
  const {
    web3Reducer: {
      web3: { status, account, web3, activeNetwork, ethersProvider }
    },
    initializeContractsReducer: { syndicateContracts },
    erc20TokenSliceReducer: {
      erc20Token: { name, symbol, owner, address }
    },
    assetsSliceReducer: { loading }
  } = useSelector((state: AppState) => state);

  const [activeAddresses, setActiveAddresses] = useState<string[]>([]);
  const [memberDetails, setMemberDetails] = useState<memberDetail[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] =
    useState(false);
  const [transactionHash, setTransactionHash] = useState('');
  const [batchIdentifier, setBatchIdentifier] = useState(uuidv4());

  const [shareDistributionNews, setShareDistributionNews] = useState(false);

  const [distributionERC20Address, setDistributionERC20Address] =
    useState<string>('');

  const [showGraphWarning, setShowGraphWarning] = useState(false);

  const { isDataStale, lastSyncedBlock, timeToSyncPendingBlocks } =
    useGraphSyncState();

  const dispatch = useDispatch();
  const isDemoMode = useDemoMode();

  const {
    query: { clubAddress }
  } = useRouter();

  const { loadingClubDeposits, totalDeposits } =
    useClubDepositsAndSupply(address);

  // update state variable to show graph warning if data is stale
  useEffect(() => {
    setShowGraphWarning(isDataStale);
    return (): void => {
      setShowGraphWarning(false);
    };
  }, [isDataStale]);

  useEffect(() => {
    if (!activeNetwork) return;

    setDistributionERC20Address(
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      CONTRACT_ADDRESSES[activeNetwork.chainId].distributionsERC20
    );
  }, [activeNetwork]);

  // fetch club members
  const { clubMembers, isFetchingMembers } = useClubTokenMembers();

  /**
   * Fetch club details
   */
  useEffect(() => {
    if (!clubAddress || status == Status.CONNECTING) return;

    if (
      !isZeroAddress(clubAddress as string) &&
      web3.utils.isAddress(clubAddress as string) &&
      syndicateContracts?.DepositTokenMintModule
    ) {
      const clubERC20tokenContract = new ClubERC20Contract(
        clubAddress as string,
        web3,
        activeNetwork
      );

      dispatch(setERC20TokenContract(clubERC20tokenContract));

      dispatch(setERC20Token(clubERC20tokenContract));
    } else if (isDemoMode) {
      // using "Active" as the default view.
      resetClubState(dispatch, mockActiveERC20Token);
    }
  }, [
    clubAddress,
    account,
    status,
    syndicateContracts?.DepositTokenMintModule
  ]);

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
    if (clubMembers.length && tokens.length) {
      const memberDetails = clubMembers.map(
        ({ ownershipShare, clubTokens, memberAddress, ...rest }) => {
          return {
            ...rest,
            ownershipShare,
            address: memberAddress,
            clubTokenHolding: +clubTokens,
            distributionShare: +numberWithCommas(ownershipShare.toFixed(4)),
            receivingTokens: tokens.map(
              ({ tokenAmount, symbol, logo, icon }: any) => {
                return {
                  amount: (+ownershipShare * +tokenAmount) / 100,
                  tokenSymbol: symbol,
                  tokenIcon: logo || icon || '/images/token-gray.svg'
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

    return (): void => {
      setMemberDetails([]);
    };
  }, [
    loadingClubDeposits,
    isFetchingMembers,
    JSON.stringify(clubMembers),
    JSON.stringify(tokens)
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

  const handleAckAndContinue = (): void => {
    setShowGraphWarning(false);
  };

  const [steps, setSteps] = useState<step[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const [progressDescriptorTitle, setProgressDescriptorTitle] = useState('');
  const [progressDescriptorStatus, setProgressDescriptorStatus] =
    useState<ProgressDescriptorState>(ProgressDescriptorState.PENDING);
  const [progressDescriptorDescription, setProgressDescriptorDescription] =
    useState('');

  // flag to check whether there is pending transaction before closing modal
  const [isTransactionPending, setIsTransactionPending] = useState(false);

  const TRANSACTION_TOO_LONG_MSG =
    'This transaction is taking a while. You can speed it up by spending more gas via your wallet.';

  useEffect(() => {
    if (!tokens.length) return;

    const steps: any[] = [];
    tokens.forEach((token: IToken) => {
      if (token.symbol == activeNetwork.nativeCurrency.symbol) {
        steps.push({
          ...token,
          title: `Distribute ${numberWithCommas(token.tokenAmount ?? 0)} ${
            token.symbol
          }`,
          isInErrorState: false,
          action: 'distribute',
          status: ''
        });

        return;
      }

      const tokenDetails = [
        {
          ...token,
          title: `Approve ${token.symbol}`,
          isInErrorState: false,
          action: 'approve',
          status: ProgressDescriptorState.PENDING
        },
        {
          ...token,
          title: `Distribute ${numberWithCommas(token.tokenAmount ?? 0)} ${
            token.symbol
          }`,
          isInErrorState: false,
          action: 'distribute',
          status: ''
        }
      ];

      steps.push(...tokenDetails);
    });

    setSteps(steps);
  }, [JSON.stringify(tokens)]);

  const [activeMembersBeforeEditing, setActiveMembersBeforeEditing] =
    useState(activeAddresses);

  useEffect(() => {
    if (isEditing) {
      // save current active indices to state
      setActiveMembersBeforeEditing(activeAddresses);
    }
  }, [isEditing]);

  /**
   * When activeIndex changes, determine whether we should check for allowance
   * and make approval of we should wait for admin to trigger distributions.
   * Note: Allowance approval is triggered automatically. The first step is triggered
   * by admin after clicking submit
   */
  useEffect(() => {
    if (activeIndex == 0 || !steps) return;

    if (steps?.[activeIndex]?.action == 'approve') {
      setProgressDescriptorTitle(
        `Approve ${steps[activeIndex].symbol} from your wallet`
      );
      setProgressDescriptorDescription(``);
      void handleAllowanceApproval(steps[activeIndex]).then(() => {
        updateSteps('status', '');
      });
      setTransactionHash('');
    } else {
      updateSteps('status', '');
    }
  }, [activeIndex]);

  const handleSaveAction = (e: MouseEvent): void => {
    e.preventDefault();
    toggleEditDistribution();
  };

  /**
   * This function reverts activeAddresses to the state before editing
   */
  const handleCancelAction = (e: MouseEvent): void => {
    e.preventDefault();

    // restore active indices from state
    setActiveAddresses(activeMembersBeforeEditing);
    toggleEditDistribution();
  };

  const updateSteps = (key: string, value: string | boolean): void => {
    const updatedSteps = steps;
    if (!updatedSteps[activeIndex]) return;

    // @ts-expect-error TS(2532): Object is possibly 'undefined'.
    updatedSteps[activeIndex][`${key}`] = value;
    setSteps(updatedSteps);
  };

  const incrementActiveIndex = (): void => {
    if (activeIndex !== steps.length - 1) {
      setActiveIndex(activeIndex + 1);
    }
  };

  const handleAllowanceApproval = async (token: {
    tokenAmount: string;
    contractAddress: string;
    tokenDecimal: number;
    symbol: string;
  }): Promise<void> => {
    updateSteps('isInErrorState', false);
    setIsTransactionPending(true);

    // set amount to approve.
    const amountToApprove = getWeiAmount(
      web3,
      token.tokenAmount,
      Number(token.tokenDecimal),
      true
    );

    try {
      let gnosisTxHash;

      const gasEstimate: string = await estimateGas(web3);

      await new Promise((resolve, reject) => {
        const _tokenContract: Contract = new web3.eth.Contract(
          ERC20ABI as AbiItem[],
          token.contractAddress
        );
        _tokenContract.methods
          .approve(distributionERC20Address, amountToApprove)
          .send({ from: account, gasPrice: gasEstimate })
          .on('transactionHash', (transactionHash: any) => {
            setProgressDescriptorTitle(`Approving ${token.symbol}`);
            setProgressDescriptorDescription(
              'This could take anywhere from seconds to hours depending on network congestion and the gas fees you set. '
            );

            setTransactionHash(transactionHash);
          })
          .on('receipt', async (receipt: any) => {
            await checkTokenAllowance(token);

            incrementActiveIndex();
            resolve(receipt);
            setIsTransactionPending(false);
          })
          .on('error', (error: any) => {
            setIsTransactionPending(false);

            reject(error);
          });
      });

      // fallback for gnosisSafe <> walletConnect
      if (gnosisTxHash) {
        await checkTokenAllowance(token);
        setIsTransactionPending(false);
      }
    } catch (error: any) {
      if (error?.message.includes('Be aware that it might still be mined')) {
        setProgressDescriptorTitle(`Transaction taking too long`);

        setProgressDescriptorDescription(TRANSACTION_TOO_LONG_MSG);
        setIsTransactionPending(false);
        return;
      } else {
        updateSteps('isInErrorState', true);
        updateSteps('status', ProgressDescriptorState.FAILURE);

        setProgressDescriptorTitle(`Error Approving ${token.symbol}`);
        setProgressDescriptorStatus(ProgressDescriptorState.FAILURE);
        setProgressDescriptorDescription('');
        setIsTransactionPending(false);
      }
    }
  };

  const checkTokenAllowance = async (token: {
    tokenDecimal: number;
    contractAddress: string;
  }): Promise<string> => {
    const _tokenContract = new web3.eth.Contract(
      ERC20ABI as AbiItem[],
      token.contractAddress
    );
    try {
      const allowanceAmount: string = await _tokenContract?.methods
        .allowance(account.toString(), distributionERC20Address)
        .call({ from: account });

      const currentAllowanceAmount = getWeiAmount(
        web3,
        allowanceAmount.toString(),
        token.tokenDecimal,
        false
      );

      return currentAllowanceAmount;
    } catch (error) {
      return '0';
    }
  };

  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleModalClose = (): void => {
    setIsModalVisible(false);
    clearErrorStepErrorStates();
  };

  const clearErrorStepErrorStates = (): void => {
    const updatedSteps = steps.map((step) => ({
      ...step,
      isInErrorState: false,
      status: ProgressDescriptorState.PENDING
    }));
    setSteps(updatedSteps);
    setProgressDescriptorStatus(ProgressDescriptorState.PENDING);
    setProgressDescriptorTitle('');
    setProgressDescriptorDescription('');
  };

  const onTxConfirm = (transactionHash: string): void => {
    const { tokenAmount, symbol } = steps[activeIndex];
    // Update progress state
    setProgressDescriptorTitle(
      `Distributing ${numberWithCommas(tokenAmount)} ${symbol}`
    );
    setProgressDescriptorDescription(
      `This could take anywhere from seconds to hours depending on network congestion and the gas fees you set.`
    );
    updateSteps('status', ProgressDescriptorState.PENDING);

    setTransactionHash(transactionHash);
  };

  const onTxReceipt = (): void => {
    setIsConfirmationModalVisible(true);
    const { symbol } = steps[activeIndex];

    amplitudeLogger(DISTRIBUTION_TRANSACTION, {
      flow: Flow.CLUB_DISTRIBUTE,
      transaction_status: 'Success',
      distribution_token: symbol
    });

    if (activeIndex == steps.length - 1) {
      setProgressDescriptorStatus(ProgressDescriptorState.SUCCESS);

      // share the good news
      setShareDistributionNews(true);
      setIsConfirmationModalVisible(false);
    } else {
      const nextIndex = activeIndex + 1;
      setProgressDescriptorTitle('');
      setActiveIndex(nextIndex);
    }

    setIsTransactionPending(false);
  };

  const onTxFail = (error?: { code: number; message: string }): void => {
    setIsConfirmationModalVisible(true);
    const { tokenAmount, symbol } = steps[activeIndex];

    amplitudeLogger(DISTRIBUTION_TRANSACTION, {
      flow: Flow.CLUB_DISTRIBUTE,
      transaction_status: 'Failure',
      distribution_token: symbol
    });

    // Update progress state
    setProgressDescriptorTitle(
      `Error distributing ${numberWithCommas(tokenAmount)} ${symbol}`
    );
    setProgressDescriptorDescription(
      'This could be due to an error approving on the blockchain or gathering approvals if you are using a Gnosis Safe wallet.'
    );
    updateSteps('isInErrorState', true);
    updateSteps('status', ProgressDescriptorState.FAILURE);

    // User rejected transaction does not have transactionHash
    if (error?.code == 4001) {
      setTransactionHash('');
    }

    setProgressDescriptorStatus(ProgressDescriptorState.FAILURE);
    setIsTransactionPending(false);
  };

  const handleCheckAndApproveAllowance = async (step: step): Promise<void> => {
    setIsTransactionPending(true);
    setProgressDescriptorDescription(`Approve ${step.symbol} from your wallet`);

    // check allowance, and proceed if enough allowance
    const allowance = await checkTokenAllowance(step);

    if (+allowance < +step.tokenAmount) {
      await handleAllowanceApproval(step);
      setIsTransactionPending(false);
    } else {
      updateSteps('status', '');
      incrementActiveIndex();
      setIsTransactionPending(false);
    }
  };

  /**
   * @dev this method is used to get a new batchId if we don't have one yet.
   * Otherwise, retrieve the existing one.
   *
   * @return { batchId } an identifier for the distribution.
   */
  const getBatchId = (): string => {
    if (!batchIdentifier) {
      // Generate a new one and save it to local state for subsequent use incase
      // the user encounters an error.
      const newBatchId = uuidv4();

      setBatchIdentifier(newBatchId);
      return newBatchId;
    } else {
      return batchIdentifier;
    }
  };

  const clearBatchIdentifier = (): void => {
    localStorage.removeItem('batchId');
  };

  /**
   * Make either ETH or ERC20 distributions
   *
   * @param token an erc20 token to be distributed to members
   */
  const makeDistributions = async (token: step): Promise<void> => {
    try {
      const batchIdentifier = getBatchId();

      setIsTransactionPending(true);
      setTransactionHash('');

      const amountToDistribute = getWeiAmount(
        web3,
        token.tokenAmount,
        +token.tokenDecimal,
        true
      );

      if (token.symbol === activeNetwork.nativeCurrency.symbol) {
        await syndicateContracts.distributionsETH.multiMemberDistribute(
          account,
          address,
          amountToDistribute,
          activeAddresses,
          `${batchIdentifier}`,
          onTxConfirm,
          onTxReceipt,
          onTxFail
        );
      } else {
        await syndicateContracts.distributionsERC20.multiMemberDistribute(
          account,
          address,
          token.contractAddress,
          amountToDistribute,
          activeAddresses,
          `${batchIdentifier}`,
          onTxConfirm,
          onTxReceipt,
          onTxFail
        );
      }
    } catch (error) {
      return;
    }
  };

  const handleDisclaimerConfirmation = (e?: MouseEvent): void => {
    e?.preventDefault();
    setIsModalVisible(false);

    // handle distributions
    setIsConfirmationModalVisible(true);
    const token = steps[activeIndex];

    if (token.action == 'distribute') {
      // no approval stage for ETH
      setProgressDescriptorStatus(ProgressDescriptorState.PENDING);
      setProgressDescriptorTitle(
        `Confirm ${token.symbol} distribution from your wallet`
      );
      setProgressDescriptorDescription('Distributions are irreversible');
      setTransactionHash('');
      updateSteps('status', ProgressDescriptorState.PENDING);

      makeDistributions(token);
    } else {
      clearErrorStepErrorStates();
      handleCheckAndApproveAllowance(steps[activeIndex]);
    }
  };

  const showDistributeDisclaimer = (e: MouseEvent): void => {
    e.preventDefault();
    setIsModalVisible(true);
    amplitudeLogger(DISTRIBUTION_SUBMIT_CLICK, {
      flow: Flow.CLUB_DISTRIBUTE
    });
  };

  const handleCloseConfirmModal = (): void => {
    // should not close modal if there is pending transaction.
    if (isTransactionPending) return;

    setIsConfirmationModalVisible(false);
    clearErrorStepErrorStates();
  };

  const handleClickAction = async (e: MouseEvent): Promise<void> => {
    e.preventDefault();

    const token = steps[activeIndex];
    updateSteps('status', ProgressDescriptorState.PENDING);
    updateSteps('isInErrorState', false);

    setProgressDescriptorStatus(ProgressDescriptorState.PENDING);
    setProgressDescriptorTitle(
      `Confirm ${token.symbol} distribution from your wallet`
    );
    setProgressDescriptorDescription('Distributions are irreversible');

    await makeDistributions(token);
  };

  // check whether there is any new change during editing.
  const activeMembersChanged =
    JSON.stringify(activeAddresses) !==
    JSON.stringify(activeMembersBeforeEditing);

  const handleViewDashboard = (): void => {
    void router.replace(
      `/clubs/${clubAddress as string}/manage${
        '?chain=' + activeNetwork.network
      }`
    );
  };

  // Share member link via social network.
  const socialURL = window.location.href.replace('/distribute', '');

  return (
    <div className="container mx-auto w-full">
      <div className="flex items-center justify-between mb-5">
        <ClubHeader
          {...{
            loading,
            name,
            symbol,
            owner,
            loadingClubDeposits,
            totalDeposits,
            managerSettingsOpen: false,
            clubAddress: address
          }}
        />
      </div>

      {isFetchingMembers ? (
        <Spinner />
      ) : (
        <div className="relative">
          {memberDetails.length ? (
            <div className="flex mt-5 md:mt-16 align-middle items-center justify-between">
              <DistributionHeader
                titleText={
                  isEditing ? 'Edit Distribution' : 'Review Distribution'
                }
                subTitleText={
                  isEditing
                    ? `Exclude member(s) from distributions for investments they did not participate in. Funds are distributed proportionally to remaining members by their ownership share.`
                    : `Members will automatically receive the asset distributions below, once the transaction is completed on-chain.`
                }
              />

              {isEditing ? (
                <>
                  <div className="md:flex ml-16 max-h-14 hidden space-x-8">
                    <PrimaryButton
                      customClasses="border-none"
                      textColor="text-blue"
                      onClick={handleCancelAction}
                    >
                      Cancel
                    </PrimaryButton>
                    <PrimaryButton
                      customClasses={`border-none ${
                        activeMembersChanged ? 'bg-white' : 'bg-gray-syn7'
                      } px-8 py-4`}
                      textColor={`${
                        activeMembersChanged ? 'text-black' : 'text-gray-syn4'
                      }`}
                      onClick={handleSaveAction}
                    >
                      Save
                    </PrimaryButton>
                  </div>

                  {/* Mobile positioning */}
                  <div className="fixed bottom-0 md:hidden z-10 left-0 w-full">
                    <div className="flex container justify-between bg-black w-full p-5 mx-auto">
                      <PrimaryButton
                        customClasses="border-none"
                        textColor="text-blue"
                        onClick={handleCancelAction}
                      >
                        Cancel
                      </PrimaryButton>
                      <PrimaryButton
                        customClasses={`border-none ${
                          activeMembersChanged ? 'bg-white' : 'bg-gray-syn7'
                        } px-8 py-4`}
                        textColor={`${
                          activeMembersChanged ? 'text-black' : 'text-white'
                        }`}
                        onClick={handleSaveAction}
                      >
                        Save
                      </PrimaryButton>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="hidden ml-16 md:block">
                    <CTAButton
                      type={CTAType.TRANSACTIONAL}
                      fullWidth={false}
                      onClick={showDistributeDisclaimer}
                      disabled={activeAddresses.length == 0 || showGraphWarning}
                    >
                      Submit
                    </CTAButton>
                  </div>
                  {/* Mobile positioning */}
                  <div className="fixed bottom-0 md:hidden z-10 left-0 w-full space-y-8">
                    <div className="flex container sm:hidden justify-center w-full bg-gray-syn8 px-auto py-6 mx-auto">
                      <CTAButton
                        type={CTAType.TRANSACTIONAL}
                        fullWidth={false}
                        onClick={showDistributeDisclaimer}
                        disabled={
                          activeAddresses.length == 0 || showGraphWarning
                        }
                        extraClasses={'w-full'}
                      >
                        Submit
                      </CTAButton>
                    </div>

                    {/* This has a different background. */}
                    <div className="sm:flex container hidden justify-center w-full p-6 pt-5 mx-auto">
                      <CTAButton
                        type={CTAType.TRANSACTIONAL}
                        fullWidth={false}
                        onClick={showDistributeDisclaimer}
                        disabled={activeAddresses.length == 0}
                        extraClasses={'w-full'}
                      >
                        Submit
                      </CTAButton>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : null}

          <DistributionMembersTable
            activeAddresses={activeAddresses}
            membersDetails={memberDetails}
            tokens={tokens}
            isEditing={isEditing}
            searchValue={searchValue}
            handleIsEditingChange={toggleEditDistribution}
            handleActiveAddressesChange={setActiveAddresses}
            handleSearchChange={handleSearchChange}
            clearSearchValue={clearSearchValue}
            ethersProvider={ethersProvider}
            isBlurred={showGraphWarning}
          />

          {showGraphWarning ? (
            <GraphStatusWarningModal
              onClick={handleAckAndContinue}
              titleWarningText={`Your cap table may not be up to date`}
              content={`If any modifications have been made to this club’s cap table (including membership, club token balances, and ownership shares) in the last ${timeToSyncPendingBlocks.trim()} (since block ${lastSyncedBlock}) they will not be reflected in this distribution.`}
            />
          ) : null}
        </div>
      )}

      <DistributionsDisclaimerModal
        {...{
          isModalVisible,
          handleModalClose,
          onClick: handleDisclaimerConfirmation
        }}
      />

      <ConfirmDistributionsModal
        activeStepIndex={activeIndex}
        isModalVisible={isConfirmationModalVisible}
        steps={steps}
        handleModalClose={handleCloseConfirmModal}
        showCloseButton={!isTransactionPending}
      >
        <>
          {steps?.[activeIndex]?.status !== '' && (
            <ProgressDescriptor
              title={progressDescriptorTitle}
              description={progressDescriptorDescription}
              state={progressDescriptorStatus}
              transactionHash={transactionHash}
            />
          )}
          {steps?.[activeIndex]?.action === 'distribute' &&
            (steps?.[activeIndex].status == '' ||
              steps?.[activeIndex].status ==
                ProgressDescriptorState.FAILURE) && (
              <div className="mt-6">
                <CTAButton onClick={handleClickAction} extraClasses="w-full">
                  Distribute {`${steps?.[activeIndex]?.symbol}`}
                </CTAButton>
              </div>
            )}
        </>
      </ConfirmDistributionsModal>

      <ShareSocialModal
        showCollectiveCTA={false}
        isModalVisible={shareDistributionNews}
        handleModalClose={(): void => {
          setShareDistributionNews(false);
          handleExitClick();
          clearBatchIdentifier();
        }}
        socialURL={socialURL}
        transactionHash={transactionHash}
        description={`Just made an investment distribution for ${name} (${symbol}) on Syndicate 🎉 Check our dashboard for details on how much you will be receiving.`}
        handleClick={handleViewDashboard}
        buttonLabel="Done"
      />
    </div>
  );
};

export default ReviewDistribution;
