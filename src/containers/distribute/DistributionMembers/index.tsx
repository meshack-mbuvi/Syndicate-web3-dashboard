import { ClubERC20Contract } from '@/ClubERC20Factory/clubERC20';
import { estimateGas } from '@/ClubERC20Factory/shared/getGasEstimate';
import { amplitudeLogger, Flow } from '@/components/amplitude';
import {
  ERROR_MGR_DISTRIBUTION,
  MGR_MAKE_DISTRIBUTE_EVENT
} from '@/components/amplitude/eventNames';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import { CtaButton } from '@/components/CTAButton';
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
import { CONTRACT_ADDRESSES } from '@/Networks';
import { AppState } from '@/state';
import { setERC20TokenContract } from '@/state/erc20token/slice';
import { Status } from '@/state/wallet/types';
import { isZeroAddress } from '@/utils';
import { getWeiAmount } from '@/utils/conversions';
import { numberWithCommas } from '@/utils/formattedNumbers';
import { mockActiveERC20Token } from '@/utils/mockdata';
import router, { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ERC20ABI from 'src/utils/abi/erc20';
import { v4 as uuidv4 } from 'uuid';
import DistributionHeader from '../DistributionHeader';

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
  tokens;
  handleExitClick: () => void;
};

const ReviewDistribution: React.FC<Props> = ({ tokens, handleExitClick }) => {
  const {
    web3Reducer: {
      web3: { status, account, web3, activeNetwork }
    },
    initializeContractsReducer: { syndicateContracts },
    erc20TokenSliceReducer: {
      erc20Token: { name, symbol, owner, address }
    },
    assetsSliceReducer: { loading }
  } = useSelector((state: AppState) => state);

  const [activeAddresses, setActiveAddresses] = useState([]);
  const [memberDetails, setMemberDetails] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [batchIdentifier, setBatchIdentifier] = useState('');
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] =
    useState(false);
  const [transactionHash, setTransactionHash] = useState('');

  const [shareDistributionNews, setShareDistributionNews] = useState(false);

  const [distributionERC20Address, setDistributionERC20Address] =
    useState<string>('');

  const dispatch = useDispatch();
  const isDemoMode = useDemoMode();
  const {
    query: { clubAddress }
  } = useRouter();

  const { loadingClubDeposits, totalDeposits } =
    useClubDepositsAndSupply(address);

  useEffect(() => {
    if (!activeNetwork) return;

    setDistributionERC20Address(
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
    const activeAddresses = [];
    clubMembers.forEach((member) => activeAddresses.push(member.memberAddress));
    setActiveAddresses(activeAddresses);
  }, [JSON.stringify(clubMembers)]);

  // prepare member data here
  useEffect(() => {
    if (clubMembers.length && tokens.length) {
      const memberDetails = clubMembers.map(
        ({ ownershipShare, clubTokens, memberAddress }) => {
          return {
            ownershipShare,
            memberName: memberAddress,
            clubTokenHolding: clubTokens,
            distributionShare: +ownershipShare,
            receivingTokens: tokens.map(
              ({ tokenAmount, symbol, logo, icon }) => {
                return {
                  amount: +ownershipShare * +tokenAmount,
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

    return () => {
      setMemberDetails([]);
    };
  }, [
    loadingClubDeposits,
    isFetchingMembers,
    JSON.stringify(clubMembers),
    JSON.stringify(tokens)
  ]);

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const toggleEditDistribution = () => {
    setIsEditing(!isEditing);
  };

  const clearSearchValue = (e) => {
    e.preventDefault();
    setSearchValue('');
  };

  const [steps, setSteps] = useState<step[]>();
  const [activeIndex, setActiveIndex] = useState(0);

  const [progressDescriptorTitle, setProgressDescriptorTitle] = useState('');
  const [progressDescriptorStatus, setProgressDescriptorStatus] =
    useState<ProgressDescriptorState>(ProgressDescriptorState.PENDING);
  const [progressDescriptorDescription, setProgressDescriptorDescription] =
    useState('');

  // flag to check whether there is pending transaction before closing modal
  const [isTransactionPending, setIsTransactionPending] = useState(false);

  useEffect(() => {
    if (!tokens.length) return;

    const steps = [];
    tokens.forEach((token) => {
      if (token.symbol == activeNetwork.nativeCurrency.symbol) {
        steps.push({
          ...token,
          title: `Distribute ${numberWithCommas(token.tokenAmount)} ${
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
          title: `Distribute ${numberWithCommas(token.tokenAmount)} ${
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
      handleAllowanceApproval(steps[activeIndex]).then(() => {
        updateSteps('status', '');
      });
      setTransactionHash('');
    } else {
      updateSteps('status', '');
    }
  }, [activeIndex]);

  const handleSaveAction = (e) => {
    e.preventDefault();
    toggleEditDistribution();
  };

  /**
   * This function reverts activeAddresses to the state before editing
   */
  const handleCancelAction = (e) => {
    e.preventDefault();

    // restore active indices from state
    setActiveAddresses(activeMembersBeforeEditing);
    toggleEditDistribution();
  };

  const updateSteps = (key, value) => {
    const updatedSteps = steps;
    updatedSteps[activeIndex][`${key}`] = value;
    setSteps(updatedSteps);
  };

  const incrementActiveIndex = () => {
    if (activeIndex !== steps.length - 1) {
      setActiveIndex(activeIndex + 1);
    }
  };

  const handleAllowanceApproval = async (token: {
    tokenAmount: string;
    contractAddress: string;
    tokenDecimal: number;
    symbol: string;
  }) => {
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

      const gasEstimate = await estimateGas(web3);

      await new Promise((resolve, reject) => {
        const _tokenContract = new web3.eth.Contract(
          ERC20ABI as AbiItem[],
          token.contractAddress
        );
        _tokenContract.methods
          .approve(distributionERC20Address, amountToApprove)
          .send({ from: account, gasPrice: gasEstimate })
          .on('transactionHash', (transactionHash) => {
            setProgressDescriptorTitle(`Approving ${token.symbol}`);
            setProgressDescriptorDescription(
              'This could take anywhere from seconds to hours depending on network congestion and the gas fees you set. '
            );

            setTransactionHash(transactionHash);
          })
          .on('receipt', async (receipt) => {
            await checkTokenAllowance(token);

            incrementActiveIndex();

            amplitudeLogger(MGR_MAKE_DISTRIBUTE_EVENT, {
              flow: Flow.MGR_DISTRIBUTION,
              distribution_amount: amountToApprove
            });
            resolve(receipt);
            setIsTransactionPending(false);
          })
          .on('error', (error) => {
            setIsTransactionPending(false);
            // user clicked reject.
            if (error?.code === 4001) {
              // break here
            }

            amplitudeLogger(ERROR_MGR_DISTRIBUTION, {
              flow: Flow.MGR_DISTRIBUTION,
              distribution_amount: amountToApprove
            });
            reject(error);
          });
      });

      // fallback for gnosisSafe <> walletConnect
      if (gnosisTxHash) {
        await checkTokenAllowance(token);
        setIsTransactionPending(false);
      }
    } catch (error) {
      updateSteps('isInErrorState', true);
      updateSteps('status', ProgressDescriptorState.FAILURE);

      setProgressDescriptorStatus(ProgressDescriptorState.FAILURE);
      setProgressDescriptorTitle(`Error Approving ${token.symbol}`);
      setProgressDescriptorDescription('');
      setIsTransactionPending(false);
    }
  };

  const checkTokenAllowance = async (token: {
    tokenDecimal: number;
    contractAddress: string;
  }) => {
    const _tokenContract = new web3.eth.Contract(
      ERC20ABI as AbiItem[],
      token.contractAddress
    );
    try {
      const allowanceAmount = await _tokenContract?.methods
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
      return 0;
    }
  };

  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleModalClose = () => {
    setIsModalVisible(false);
    clearErrorStepErrorStates();
  };

  const clearErrorStepErrorStates = () => {
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

  const onTxConfirm = (transactionHash) => {
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

  const onTxReceipt = () => {
    setIsConfirmationModalVisible(true);

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

  const onTxFail = (error?) => {
    setIsConfirmationModalVisible(true);

    const { tokenAmount, symbol } = steps[activeIndex];

    updateSteps('isInErrorState', true);
    updateSteps('status', ProgressDescriptorState.FAILURE);

    // Update progress state
    setProgressDescriptorTitle(
      `Error distributing ${numberWithCommas(tokenAmount)} ${symbol}`
    );
    if (
      error?.message?.indexOf('Transaction was not mined within 50 blocks') > -1
    ) {
      setProgressDescriptorDescription(
        'This could take anywhere from seconds to hours depending on network congestion and the gas fees you set. You can safely leave this page while you wait.'
      );
    } else {
      setProgressDescriptorDescription(
        'This could be due to an error approving on the blockchain or gathering approvals if you are using a Gnosis Safe wallet.'
      );
    }

    // User rejected transaction does not have transactionHash
    if (error.code == 4001) {
      setTransactionHash('');
    }

    setProgressDescriptorStatus(ProgressDescriptorState.FAILURE);
    setIsTransactionPending(false);
  };

  const handleCheckAndApproveAllowance = async (step) => {
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
   * Make either ETH or ERC20 distributions
   *
   * @param token an erc20 token to be distributed to members
   */
  const makeDistributions = async (token) => {
    try {
      setIsTransactionPending(true);
      setTransactionHash('');

      const amountToDistribute = getWeiAmount(
        web3,
        token.tokenAmount,
        token.tokenDecimal,
        true
      );

      if (token.symbol === activeNetwork.nativeCurrency.symbol) {
        await syndicateContracts.distributionsETH.multiMemberDistribute(
          account,
          address,
          amountToDistribute,
          activeAddresses,
          batchIdentifier,
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
          batchIdentifier,
          onTxConfirm,
          onTxReceipt,
          onTxFail
        );
      }
    } catch (error) {
      onTxFail(error);
    }
  };

  const handleDisclaimerConfirmation = (e?) => {
    e.preventDefault();
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

  const showDistributeDisclaimer = (e) => {
    e.preventDefault();
    setBatchIdentifier(uuidv4());

    setIsModalVisible(true);
  };

  const handleCloseConfirmModal = () => {
    // should not close modal if there is pending transaction.
    if (isTransactionPending) return;

    setIsConfirmationModalVisible(false);
    clearErrorStepErrorStates();
  };

  const handleClickAction = async (e) => {
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

  const handleViewDashboard = () => {
    router.replace(
      `/clubs/${clubAddress}/manage${'?chain=' + activeNetwork.network}`
    );
  };

  const socialURL = window.location.href;

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
        <>
          {memberDetails.length ? (
            <div className="flex mt-16 justify-between">
              <DistributionHeader
                titleText={
                  isEditing ? 'Edit Distribution' : 'Review Distribution'
                }
                subTitleText={`Members will automatically receive the asset distributions below, once the transaction is completed on-chain.`}
              />

              {isEditing ? (
                <div className="flex space-x-8">
                  <PrimaryButton
                    customClasses="border-none font-Slussen"
                    textColor="text-blue"
                    onClick={handleCancelAction}
                  >
                    Cancel
                  </PrimaryButton>
                  <PrimaryButton
                    customClasses={`border-none font-Slussen ${
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
              ) : (
                <CtaButton
                  greenCta={true}
                  fullWidth={false}
                  onClick={showDistributeDisclaimer}
                  disabled={activeAddresses.length == 0}
                >
                  Submit
                </CtaButton>
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
          />
        </>
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
          {steps?.[activeIndex].status !== '' && (
            <ProgressDescriptor
              title={progressDescriptorTitle}
              description={progressDescriptorDescription}
              state={progressDescriptorStatus}
              transactionHash={transactionHash}
            />
          )}

          {steps?.[activeIndex].action === 'distribute' &&
            (steps?.[activeIndex].status == '' ||
              steps?.[activeIndex].status ==
                ProgressDescriptorState.FAILURE) && (
              <div className="mt-6">
                <CtaButton onClick={handleClickAction}>
                  Distribute {`${steps?.[activeIndex]?.symbol}`}
                </CtaButton>
              </div>
            )}
        </>
      </ConfirmDistributionsModal>

      <ShareSocialModal
        isModalVisible={shareDistributionNews}
        handleModalClose={() => {
          setShareDistributionNews(false);
          handleExitClick();
        }}
        socialURL={socialURL}
        transactionHash={transactionHash}
        description={`Just made an investment distribution for ${name} (${symbol}) on Syndicate 🎉 Check our dashboard for details on how much you will be receiving.`}
        handleClick={handleViewDashboard}
        buttonLabel="View on dashboard"
      />
    </div>
  );
};

export default ReviewDistribution;
