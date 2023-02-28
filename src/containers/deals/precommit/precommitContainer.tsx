import { estimateGas } from '@/ClubERC20Factory/shared/getGasEstimate';
import { getGnosisTxnInfo } from '@/ClubERC20Factory/shared/gnosisTransactionInfo';
import { translateProviderName } from '@/components/navigation/header/wallet/accountMenuDropdown';
import { SkeletonLoader } from '@/components/skeletonLoader';
import DealActionConfirmModal from '@/features/deals/components/close/confirm';
import DealCloseModal from '@/features/deals/components/close/execute';
import { DealEndType } from '@/features/deals/components/close/types';
import { DealAllocationCard } from '@/features/deals/components/details/dealAllocationCard';
import DealPrecommitModal from '@/features/deals/components/precommit/allocateModal';
import DealPrecommitCompleteModal from '@/features/deals/components/precommit/completeModal';
import { Precommit, PrecommitStatus } from '@/hooks/deals/types';
import { IDealDetails } from '@/hooks/deals/useDealsDetails';
import useFetchEnsAssets from '@/hooks/useFetchEnsAssets';
import useFetchTokenBalance from '@/hooks/useFetchTokenBalance';
import useTokenDetails from '@/hooks/useTokenDetails';
import { CONTRACT_ADDRESSES } from '@/Networks';
import { AppState } from '@/state';
import ERC20ABI from '@/utils/abi/erc20.json';
import { getWeiAmount } from '@/utils/conversions';
import { formatAddress } from '@/utils/formatAddress';
import { floatedNumberWithCommas } from '@/utils/formattedNumbers';
import { useState } from 'react';
import { useSelector } from 'react-redux';

const PrecommitContainer: React.FC<{
  dealDetails: IDealDetails;
  dealDetailsLoading: boolean;
  precommit: Precommit | undefined;
  precommitLoading: boolean;
  setPrePollingPrecommitStatus: (state: PrecommitStatus) => void;
  setWaitingOnPrecommitGraph: (state: boolean) => void;
}> = ({
  dealDetails,
  dealDetailsLoading,
  precommit,
  precommitLoading,
  setPrePollingPrecommitStatus,
  setWaitingOnPrecommitGraph
}) => {
  const {
    web3Reducer: {
      web3: { account, activeNetwork, web3, ethersProvider, providerName }
    },
    initializeContractsReducer: {
      syndicateContracts: { allowancePrecommitModuleERC20 }
    }
  } = useSelector((state: AppState) => state);

  const [walletProviderName] = translateProviderName(providerName);

  const {
    dealName,
    dealTokenAddress,
    dealTokenSymbol,
    depositToken,
    dealDestination,
    minCommitAmount: minCommitAmountInWei
  } = dealDetails;

  const { data } = useFetchEnsAssets(dealDestination, ethersProvider);
  const destinationEnsName = data?.name
    ? data.name
    : formatAddress(dealDestination, 6, 4);

  const {
    symbol: depositTokenSymbol,
    decimals,
    logo: depositTokenLogo
  } = useTokenDetails(depositToken);

  const { accountHoldings } = useFetchTokenBalance(depositToken);

  const minCommitAmount =
    getWeiAmount(minCommitAmountInWei, decimals, false) ?? '0';

  const [isPrecommitModalOpen, setPrecommitModalOpen] =
    useState<boolean>(false);
  const [showDealActionConfirmModal, setShowDealActionConfirmModal] =
    useState<boolean>(false);
  const [openWithdrawModal, setOpenWithdrawModal] = useState<boolean>(false);

  // withdrawing deal
  const [isWithdrawingDeal, setIsWithdrawingDeal] = useState<boolean>(false);
  const [isConfirmingWithdraw, setIsConfirmingWithdraw] =
    useState<boolean>(false);
  const [successfullyWithdrawDeal, setSuccessfullyWithdrawDeal] =
    useState<boolean>(false);
  const [dealWithdrawFailed, setDealWithdrawFailed] = useState<boolean>(false);

  const [tokenAmountInWei, setTokenAmountInWei] =
    useState<string>(minCommitAmountInWei);
  const [tokenAmount, setTokenAmount] = useState<string>(minCommitAmount);
  const [activeStepIndex, setActiveStep] = useState<number>(0);

  // transactions
  const [showWaitingOnWalletLoadingState, setShowWaitingOnWallet] =
    useState<boolean>(false);
  const [, setTransactionHash] = useState<string>('');
  const [, setError] = useState<string>('');
  const [isCompleteModalOpen, setCompleteModalOpen] = useState<boolean>(false);

  const precommitAddress =
    CONTRACT_ADDRESSES[activeNetwork.chainId]?.AllowancePrecommitModuleERC20;
  const currentPrecommitStatus = precommit?.status ?? PrecommitStatus.NONE;

  const toggleModal = (): void => {
    if (isPrecommitModalOpen) {
      setShowWaitingOnWallet(false);
      setActiveStep(0);
    }
    setPrecommitModalOpen(!isPrecommitModalOpen);
  };

  const toggleSuccessModal = (): void => {
    setCompleteModalOpen(!isCompleteModalOpen);
  };

  const handleValidAmount = (amount: string): void => {
    setTokenAmount(amount);
    setTokenAmountInWei(getWeiAmount(amount, decimals, true));
  };

  const onTxFail = (): void => {
    setShowWaitingOnWallet(false);
    setDealWithdrawFailed(true);
  };

  const onTxConfirm = (transactionHash?: string): void => {
    setTransactionHash(transactionHash ?? '');
    setIsConfirmingWithdraw(false);
    setIsWithdrawingDeal(true);
  };

  const onTxPrecommitReceipt = (): void => {
    setShowWaitingOnWallet(false);
    setPrePollingPrecommitStatus(currentPrecommitStatus as PrecommitStatus);
    toggleSuccessModal();
    setPrecommitModalOpen(false);
    // start polling
    setWaitingOnPrecommitGraph(true);
  };

  const onTxAllowance = (): void => {
    setShowWaitingOnWallet(false);
    setActiveStep(activeStepIndex + 1);
  };

  const onCancelAllowanceTxReceipt = (): void => {
    setIsWithdrawingDeal(false);
    setSuccessfullyWithdrawDeal(true);
  };

  const onTxWithdrawalReceipt = async (): Promise<void> => {
    setShowWaitingOnWallet(false);
    setActiveStep(activeStepIndex + 1);
    setIsConfirmingWithdraw(true);
    // start polling
    setWaitingOnPrecommitGraph(true);
    await cancelAllowance();
    setIsWithdrawingDeal(false);
  };

  const checkAllowanceAllows = async (current: number): Promise<boolean> => {
    if (!web3) return false;
    // TODO [REFACTOR]: ERC20 base / helpers for allowances
    const depositTokenContract = new web3.eth.Contract(
      ERC20ABI as AbiItem[],
      depositToken
    );
    try {
      const allowanceAmount = await depositTokenContract.methods
        .allowance(account, precommitAddress)
        .call({ from: account });
      if (allowanceAmount >= current) {
        setActiveStep(activeStepIndex + 1);
        setShowWaitingOnWallet(false);
        return true;
      }
      return false;
    } catch {
      setError('Unable to get current allowance');
      return false;
    }
  };

  const handleBackThisDeal = async (): Promise<void> => {
    await checkAllowanceAllows(+tokenAmountInWei);
    setPrecommitModalOpen(!isPrecommitModalOpen);
  };

  const cancelAllowance = async (): Promise<void> => {
    if (!web3) return;
    setShowWaitingOnWallet(true);
    const depositTokenContract = new web3.eth.Contract(
      ERC20ABI as AbiItem[],
      depositToken
    );
    try {
      const allowanceAmount = await depositTokenContract.methods
        .allowance(account, precommitAddress)
        .call({ from: account });
      if (allowanceAmount > 0) {
        let gnosisTxHash;
        const gasEstimate = await estimateGas(web3);
        await new Promise((resolve, reject) => {
          depositTokenContract.methods
            .approve(precommitAddress, 0)
            .send({ from: account, gasPrice: gasEstimate })
            .on('transactionHash', (transactionHash: any) => {
              onTxConfirm(transactionHash);
              // Stop waiting if we are connected to gnosis safe via walletConnect
              if (
                web3._provider.wc?._peerMeta.name === 'Gnosis Safe Multisig'
              ) {
                setTransactionHash('');
                gnosisTxHash = transactionHash;
                resolve(transactionHash);
              } else {
                setTransactionHash(transactionHash);
              }
            })
            .on('receipt', (receipt: TransactionReceipt) => {
              onCancelAllowanceTxReceipt();
              resolve(receipt);
            })
            .on('error', (error: any) => {
              onTxFail();
              reject(error);
            });
        });
        // fallback for gnosisSafe <> walletConnect
        if (gnosisTxHash) {
          const receipt: any = await getGnosisTxnInfo(
            gnosisTxHash,
            activeNetwork
          );
          setTransactionHash(receipt.transactionHash);
          if (receipt.isSuccessful) {
            onCancelAllowanceTxReceipt();
          } else {
            setError('Transaction failed');
          }
        }
      }
    } catch {
      setError('Unable to cancel current allowance');
      setShowWaitingOnWallet(false);
    }
  };

  // TODO [REFACTOR]: ERC20 base / helpers for allowances
  const handleAllowance = async (): Promise<void> => {
    if (!web3) return;
    setShowWaitingOnWallet(true);
    const depositTokenContract = new web3.eth.Contract(
      ERC20ABI as AbiItem[],
      depositToken
    );

    const hasAllowance = await checkAllowanceAllows(+tokenAmountInWei);
    if (hasAllowance) return;

    try {
      let gnosisTxHash;
      const gasEstimate = await estimateGas(web3);

      await new Promise((resolve, reject) => {
        depositTokenContract.methods
          .approve(precommitAddress, +tokenAmountInWei)
          .send({ from: account, gasPrice: gasEstimate })
          .on('transactionHash', (transactionHash: any) => {
            onTxConfirm(transactionHash);
            // Stop waiting if we are connected to gnosis safe via walletConnect
            if (web3._provider.wc?._peerMeta.name === 'Gnosis Safe Multisig') {
              setTransactionHash('');
              gnosisTxHash = transactionHash;

              resolve(transactionHash);
            } else {
              setTransactionHash(transactionHash);
            }
          })
          .on('receipt', (receipt: TransactionReceipt) => {
            onTxAllowance();
            resolve(receipt);
          })
          .on('error', (error: any) => {
            onTxFail();
            reject(error);
          });
      });

      // fallback for gnosisSafe <> walletConnect
      if (gnosisTxHash) {
        const receipt: any = await getGnosisTxnInfo(
          gnosisTxHash,
          activeNetwork
        );
        setTransactionHash(receipt.transactionHash);
        if (receipt.isSuccessful) {
          onTxAllowance();
        } else {
          setError('Transaction failed');
        }
      }
    } catch (error) {
      setError('Transaction failed');
      setShowWaitingOnWallet(false);
    }
  };

  const handleRequestAllocation = async (): Promise<void> => {
    try {
      if (
        !account ||
        !web3 ||
        !allowancePrecommitModuleERC20 ||
        !dealTokenAddress ||
        !tokenAmountInWei
      )
        return;
      setShowWaitingOnWallet(true);
      setPrePollingPrecommitStatus(currentPrecommitStatus as PrecommitStatus);
      await allowancePrecommitModuleERC20.precommit(
        dealTokenAddress,
        tokenAmountInWei,
        account,
        onTxConfirm,
        onTxPrecommitReceipt,
        onTxFail
      );
    } catch {
      setError('Confirm details');
    }
  };

  const handleConfirmWithdraw = async (): Promise<void> => {
    try {
      if (
        !account ||
        !web3 ||
        !allowancePrecommitModuleERC20 ||
        !dealTokenAddress
      )
        return;
      setShowDealActionConfirmModal(false);
      setOpenWithdrawModal(true);
      setIsConfirmingWithdraw(true);
      setPrePollingPrecommitStatus(currentPrecommitStatus as PrecommitStatus);
      await allowancePrecommitModuleERC20.cancelPrecommit(
        dealTokenAddress,
        account,
        onTxConfirm,
        onTxWithdrawalReceipt,
        onTxFail
      );
    } catch {
      setError('Unable to withdraw precommit');
    }
  };

  const handleCloseModalClick = (): void => {
    setOpenWithdrawModal(false);
    setIsWithdrawingDeal(false);
    setSuccessfullyWithdrawDeal(false);
    setIsConfirmingWithdraw(false);
    setDealWithdrawFailed(false);
  };

  const handleCancelPrecommitModal = (): void => {
    setActiveStep(0);
    setShowWaitingOnWallet(true);
    setShowDealActionConfirmModal(true);
  };

  const handleCancelAndGoBackClick = (): void => {
    setShowDealActionConfirmModal(false);
  };

  return (
    <>
      <DealActionConfirmModal
        closeType={DealEndType.WITHDRAW}
        show={showDealActionConfirmModal}
        handleContinueClick={handleConfirmWithdraw}
        handleCancelAndGoBackClick={handleCancelAndGoBackClick}
      />
      <DealCloseModal
        {...{
          show: openWithdrawModal,
          closeModal: (): void => {
            handleCloseModalClick();
          },
          outsideOnClick: true,
          dealName,
          tokenLogo: '/images/prodTokenLogos/USDCoin.svg',
          tokenSymbol: 'USDC',
          tokenAmount: precommit
            ? floatedNumberWithCommas(getWeiAmount(precommit.amount, 6, false))
            : '0',
          destinationEnsName,
          destinationAddress: dealDestination,
          handleDealCloseClick: handleConfirmWithdraw,
          handleCancelAllowance: cancelAllowance,
          closeType: DealEndType.WITHDRAW,
          showWaitingOnExecutionLoadingState: isWithdrawingDeal,
          showWaitingOnWalletLoadingState: isConfirmingWithdraw,
          transactionFailed: dealWithdrawFailed,
          successfullyWithdrawnDeal: successfullyWithdrawDeal,
          activeStepIndex: activeStepIndex
        }}
      />

      {dealDetailsLoading || precommitLoading ? (
        <div className="space-y-12 mt-7">
          <div className="space-y-4">
            <SkeletonLoader width="1/3" height="5" />
            <SkeletonLoader width="full" height="12" />
          </div>
          <div className="space-y-4">
            <SkeletonLoader width="1/3" height="5" />
            <SkeletonLoader width="full" height="48" />
          </div>
        </div>
      ) : (
        <DealAllocationCard
          dealName={dealName}
          //TODO [ENG-4768]: reconcile types between graph status + type in StatusChip
          precommitStatus={
            (precommit?.status ?? PrecommitStatus.NONE) as PrecommitStatus
          }
          precommitAmount={
            precommit && precommit?.amount
              ? String(getWeiAmount(precommit.amount, decimals, false))
              : '0'
          }
          isDealClosed={dealDetails.isClosed}
          dealDepositTokenLogo={
            depositTokenLogo ?? '/images/prodTokenLogos/USDCoin.svg'
          }
          dealDepositTokenSymbol={depositTokenSymbol ?? ''}
          minimumCommitAmount={minCommitAmount}
          wallets={[{ address: account, avatar: '' }]} // TODO [ENG-4869]: precommits - b/auth wallets
          walletBalance={getWeiAmount(
            accountHoldings?.tokenHoldings?.[0]?.balance?.toString() ?? '0',
            decimals,
            false
          )} // TODO [ENG-4869]: precommits - b/auth wallets
          walletProviderName={walletProviderName} // TODO [ENG-4869]: precommits - b/auth wallets
          connectedWallet={{ address: account, avatar: '' }} // TODO [ENG-4869]: precommits - b/auth wallets
          handleBackThisDeal={handleBackThisDeal}
          handleValidAmount={handleValidAmount}
          handleCancelPrecommit={handleCancelPrecommitModal}
        />
      )}
      {isPrecommitModalOpen && (
        <DealPrecommitModal
          dealName={dealName}
          tokenAmount={+tokenAmount}
          depositTokenLogo={
            depositTokenLogo ?? '/images/prodTokenLogos/USDCoin.svg'
          }
          depositTokenSymbol={depositTokenSymbol}
          activeStepIndex={activeStepIndex}
          showWaitingOnWalletLoadingState={showWaitingOnWalletLoadingState}
          wallets={[{ address: account, avatar: '' }]} // TODO [ENG-4869]: precommits - b/auth wallets
          walletBalance={getWeiAmount(
            accountHoldings?.tokenHoldings?.[0]?.balance?.toString() ?? '0',
            decimals,
            false
          )} // TODO [ENG-4869]: precommits - b/auth wallets
          walletProviderName={walletProviderName} // TODO [ENG-4869: precommits - b/auth wallets
          connectedWallet={{ address: account, avatar: '' }} // TODO [ENG-4869]: precommits - b/auth wallets
          handleCreateAllowanceClick={handleAllowance}
          handleRequestAllocationClick={handleRequestAllocation}
          toggleModal={toggleModal}
        />
      )}
      {isCompleteModalOpen && (
        <DealPrecommitCompleteModal
          dealName={dealName}
          tokenAmount={+tokenAmount}
          dealTokenSymbol={dealTokenSymbol}
          depositTokenLogo={
            depositTokenLogo ?? '/images/prodTokenLogos/USDCoin.svg'
          }
          depositTokenSymbol={depositTokenSymbol}
          walletAddress={account}
          ensName={''} // TODO [ENG-4869] Auth
          toggleModal={toggleSuccessModal}
        />
      )}
    </>
  );
};

export default PrecommitContainer;
