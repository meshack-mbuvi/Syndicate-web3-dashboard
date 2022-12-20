import { DealAllocationCard } from '@/features/deals/components/details/dealAllocationCard';
import DealPrecommitModal from '@/features/deals/components/precommit/allocateModal';
import DealPrecommitCompleteModal from '@/features/deals/components/precommit/completeModal';
import ERC20ABI from '@/utils/abi/erc20.json';
import { IDealDetails } from '@/hooks/deals/useDealsDetails';
import useMemberPrecommit from '@/hooks/deals/useMemberPrecommit';
import { AppState } from '@/state';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { getWeiAmount } from '@/utils/conversions';
import { CONTRACT_ADDRESSES } from '@/Networks';
import { estimateGas } from '@/ClubERC20Factory/shared/getGasEstimate';
import { getGnosisTxnInfo } from '@/ClubERC20Factory/shared/gnosisTransactionInfo';
import useTokenDetails from '@/hooks/useTokenDetails';
import { Status } from '@/components/statusChip';

const PrecommitContainer: React.FC<{
  dealDetails: IDealDetails;
  dealDetailsLoading: boolean;
}> = ({ dealDetails, dealDetailsLoading }) => {
  const {
    web3Reducer: {
      web3: { account, activeNetwork, web3 }
    },
    initializeContractsReducer: {
      syndicateContracts: { allowancePrecommitModuleERC20 }
    }
  } = useSelector((state: AppState) => state);

  const { precommit, precommitLoading } = useMemberPrecommit();

  const {
    dealName,
    dealTokenAddress,
    dealTokenSymbol,
    depositToken,
    minCommitAmount: minCommitAmountInWei
  } = dealDetails;

  const {
    symbol: depositTokenSymbol,
    decimals,
    logo: depositTokenLogo
  } = useTokenDetails(depositToken);
  const minCommitAmount = getWeiAmount(
    web3,
    minCommitAmountInWei,
    decimals,
    false
  );

  const [isPrecommitModalOpen, setPrecommitModalOpen] =
    useState<boolean>(false);
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

  const toggleModal = (): void => {
    if (isPrecommitModalOpen) {
      setShowWaitingOnWallet(false);
      setActiveStep(0);
    }
    setPrecommitModalOpen(!isPrecommitModalOpen);
  };

  const toggleSuccesModal = (): void => {
    setCompleteModalOpen(!isCompleteModalOpen);
  };

  const handleValidAmount = (amount: string): void => {
    setTokenAmount(amount);
    setTokenAmountInWei(getWeiAmount(web3, amount, decimals, true));
  };

  const onTxFail = (): void => {
    setShowWaitingOnWallet(false);
  };

  const onTxConfirm = (transactionHash?: string): void => {
    setTransactionHash(transactionHash ?? '');
  };

  const onTxReceipt = (receipt?: TransactionReceipt): void => {
    console.log('receipt', receipt);
    // TODO [WINGZ]: precommits - d/txn progress display
    setShowWaitingOnWallet(false);
    if (activeStepIndex === 1) {
      toggleSuccesModal();
      setPrecommitModalOpen(false);
    }
    setActiveStep(activeStepIndex + 1);
  };

  const checkAllowanceAllows = async (current: number): Promise<boolean> => {
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
    toggleModal();
  };

  // TODO [REFACTOR]: ERC20 base / helpers for allowances
  const handleAllowance = async (): Promise<void> => {
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
            onTxReceipt(receipt);
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
          onTxReceipt(receipt);
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
      await allowancePrecommitModuleERC20.precommit(
        dealTokenAddress,
        tokenAmountInWei,
        account,
        onTxConfirm,
        onTxReceipt,
        onTxFail
      );
    } catch {
      setError('Confirm details');
    }
  };

  const handleCancelPrecommit = async (): Promise<void> => {
    //TODO [WINGZ]: precommits - a/ withdraw flow: what to render on success / fail
    try {
      if (
        !account ||
        !web3 ||
        !allowancePrecommitModuleERC20 ||
        !dealTokenAddress
      )
        return;
      setShowWaitingOnWallet(true);
      await allowancePrecommitModuleERC20.cancelPrecommit(
        dealTokenAddress,
        account,
        onTxConfirm,
        onTxReceipt,
        onTxFail
      );
    } catch {
      setError('Unable to withdraw allocation');
    }
  };

  // TODO [WINGZ]: precommits
  // a/ withdraw flow:
  //    - what to render when canceling a precommit
  //    - after success or fail
  //    - should a user be able to re-commit?
  // b/ wallets: currently assuming that getting multi wallets + wallet providers is dependent on auth
  // d/ txn progress display: sharing etherscan link for transaction hash or render on fail errors?
  // e/ show loading if still processing from the graph(?) / when transaction is taking long

  return (
    <>
      {!dealDetailsLoading && !precommitLoading && (
        //TODO [WINGZ]: precommits - e/ re-render or spinner when processing from graph
        <DealAllocationCard
          dealName={dealName}
          //TODO [WINGZ]: reconcile types between graph status + type in StatusChip
          allocationStatus={precommit?.status ?? Status.ACTION_REQUIRED}
          precommitAmount={
            precommit && precommit?.amount
              ? getWeiAmount(web3, precommit.amount, decimals, false)
              : '0'
          } //TODO [WINGZ]: precommits - a/ should show canceled or new precommit?
          dealDepositTokenLogo={
            depositTokenLogo ?? '/images/prodTokenLogos/USDCoin.svg'
          }
          dealDepositTokenSymbol={depositTokenSymbol ?? ''}
          minimumCommitAmount={minCommitAmount}
          wallets={[]} // TODO [WINGZ]: precommits - b/auth wallets
          walletBalance={''} // TODO [WINGZ]: precommits - b/auth wallets
          walletProviderName={''} // TODO [WINGZ]: precommits - b/auth wallets
          connectedWallet={{ address: account, avatar: '' }} // TODO [WINGZ]: precommits - b/auth wallets
          handleBackThisDeal={handleBackThisDeal}
          handleValidAmount={handleValidAmount}
          handleCancelPrecommit={handleCancelPrecommit}
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
          wallets={[]} // TODO [WINGZ]: precommits - b/auth wallets
          walletBalance={''} // TODO [WINGZ]: precommits - b/auth wallets
          walletProviderName={''} // TODO [WINGZ]: precommits - b/auth wallets
          connectedWallet={{ address: account, avatar: '' }} // TODO [WINGZ]: precommits - b/auth wallets
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
          ensName={''} // TODO [WINGZ]: precommits - b/auth wallets
          toggleModal={toggleSuccesModal}
        />
      )}
    </>
  );
};

export default PrecommitContainer;
