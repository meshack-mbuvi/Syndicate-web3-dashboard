import { estimateGas } from '@/ClubERC20Factory/shared/getGasEstimate';
import { amplitudeLogger, Flow } from '@/components/amplitude';
import {
  CLUB_DEPOSIT,
  DEPOSIT_CONTINUE_CLICK
} from '@/components/amplitude/eventNames';
import ErrorBoundary from '@/components/errorBoundary';
import FadeIn from '@/components/fadeIn/FadeIn';
import ArrowDown from '@/components/icons/arrowDown';
import { InfoIcon } from '@/components/iconWrappers';
import AutoGrowInputField from '@/components/inputs/autoGrowInput';
import Modal, { ModalStyle } from '@/components/modal';
import { Spinner } from '@/components/shared/spinner';
import { SkeletonLoader } from '@/components/skeletonLoader';
import StatusBadge from '@/components/syndicateDetails/statusBadge';
import HoldingsInfo from '@/components/syndicates/depositSyndicate/HoldingsInfo';
import { SuccessOrFailureContent } from '@/components/syndicates/depositSyndicate/SuccessOrFailureContent';
import TokenGatingRequirements from '@/components/syndicates/depositSyndicate/TokenGatingRequirements';
import { BlockExplorerLink } from '@/components/syndicates/shared/BlockExplorerLink';
import { L2 } from '@/components/typography';
import { setERC20Token } from '@/helpers/erc20TokenDetails';
import { useClubDepositsAndSupply } from '@/hooks/clubs/useClubDepositsAndSupply';
import { getMemberBalance } from '@/hooks/clubs/useClubOwner';
import useSyndicateClubInfo from '@/hooks/deposit/useSyndicateClubInfo';
import useFetchAirdropInfo from '@/hooks/useAirdropInfo';
import { useConnectedAccountDetails } from '@/hooks/useConnectedAccountDetails';
import { useDemoMode } from '@/hooks/useDemoMode';
import useFeatureFlag from '@/hooks/useFeatureFlag';
import useFetchMerkleProof from '@/hooks/useMerkleProof';
import useModal from '@/hooks/useModal';
import { useNativeBalance } from '@/hooks/useNativeBalance';
import { useERC20TokenBalance } from '@/hooks/useTokenBalance';
import useFetchTokenClaim from '@/hooks/useTokenClaim';
import useWindowSize from '@/hooks/useWindowSize';
import { CONTRACT_ADDRESSES } from '@/Networks';
import { AppState } from '@/state';
import { Status } from '@/state/wallet/types';
import ERC20ABI from '@/utils/abi/erc20.json';
import { getWeiAmount } from '@/utils/conversions';
import {
  floatedNumberWithCommas,
  truncateDecimals
} from '@/utils/formattedNumbers';
import { CheckIcon } from '@heroicons/react/solid';
import { isEmpty } from 'lodash';
import Image from 'next/image';
import React, { useCallback, useEffect, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Floater from 'react-floater';
import { useDispatch, useSelector } from 'react-redux';
import Tooltip from 'react-tooltip-lite';
import { AbiItem } from 'web3-utils';
import BeforeGettingStarted from '../../beforeGettingStarted';
import ConnectWalletAction from '../shared/connectWalletAction';

import useFetchAccountHoldingsAndDetails from '@/hooks/useFetchAccountHoldingsAndDetails';
import useMeetsTokenGatedRequirements from '@/hooks/useMeetsTokenGatedRequirements';
import { FEATURE_FLAGS } from '@/pages/_app';
import { setTokenGatingDetails } from '@/state/erc20token/slice';

const DepositSyndicate: React.FC = () => {
  // HOOK DECLARATIONS
  const dispatch = useDispatch();

  const {
    initializeContractsReducer: { syndicateContracts },
    web3Reducer: {
      web3: { account, web3, status, activeNetwork }
    },
    erc20TokenSliceReducer: {
      erc20Token,
      depositDetails: {
        mintModule,
        nativeDepositToken,
        depositToken,
        depositTokenDecimals,
        depositTokenLogo,
        depositTokenSymbol
      },
      isNewClub,
      activeModuleDetails,
      tokenGatingDetails,
      depositTokenPriceInUSD,
      erc20TokenContract
    }
  } = useSelector((state: AppState) => state);

  const {
    address,
    maxTotalDeposits,
    memberCount,
    depositsEnabled,
    claimEnabled,
    symbol,
    totalSupply,
    maxTotalSupply,
    loading,
    maxMemberCount
  } = erc20Token;

  const { loadingClubDeposits, totalDeposits } =
    useClubDepositsAndSupply(address);

  const { loading: merkleLoading, merkleProof: myMerkleProof } =
    useFetchMerkleProof();
  const { tokenClaimLoading: claimLoading, isTokenClaimed } =
    useFetchTokenClaim();
  const { airdropInfoLoading, airdropInfo } = useFetchAirdropInfo();

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [metamaskConfirmPending, setMetamaskConfirmPending] =
    useState<boolean>(false);
  const [approved, setApproved] = useState<boolean>(false);
  const [allowanceApprovalError, setAllowanceApprovalError] =
    useState<string>('');
  const [approvedAllowanceAmount, setApprovedAllowanceAmount] =
    useState<string>('0');
  const [successfulDeposit, setSuccessfulDeposit] = useState<boolean>(false);
  const [successfulClaim, setSuccessfulClaim] = useState<boolean>(false);

  const [depositTokenContract, setDepositTokenContract] = useState<any>({});
  const [submittingAllowanceApproval, setSubmittingAllowanceApproval] =
    useState<boolean>(false);

  const [sufficientAllowanceSet, setSufficientAllowanceSet] =
    useState<boolean>(false);
  const [currentMemberAllowance, setCurrentMemberAllowance] =
    useState<string>('0');
  const [insufficientBalance, setInsufficientBalance] =
    useState<boolean>(false);
  const [copied, setCopied] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string>('');
  const [depositError, setDepositError] = useState<string | React.ReactElement>(
    ''
  );
  const [clubWideErrors, setClubWideErrors] = useState('');
  const [imageSRC, setImageSRC] = useState('');
  const [isTextRed, setIsTextRed] = useState(false);
  const [depositFailed, setDepositFailed] = useState<boolean>(false);
  const [claimFailed, setClaimFailed] = useState<boolean>(false);
  const [showDepositProcessingModal, toggleDepositProcessingModal] = useModal();
  const [ownershipShare, setOwnershipShare] = useState<number>(0);
  const [fullyDilutedShare, setFullyDilutedShare] = useState<number>(0);
  const [memberTokens, setMemberTokens] = useState(0);
  const [depositAmount, setDepositAmount] = useState<string>('');
  const [depositAmountFinalized, setDepositAmountFinalized] =
    useState<string>('');
  const [claimBalanceValue, setClaimBalanceValue] = useState('');
  const [claimBalanceDecimalValue, setClaimBalanceDecimalValue] = useState('');
  const [invalidClaim, setInvalidClaim] = useState<boolean>(false);
  const [transactionTooLong, setTransactionTooLong] = useState<boolean>(false);
  const [checkSuccess, setCheckSuccess] = useState(false);
  const [newClubTokensSupply, setNewClubTokensSupply] = useState(0);
  const [loadingTokenGatingRequirements, setLoadingTokenGating] =
    useState(true);
  const [meetsNewClubRequirements, setMeetsNewClubRequirements] =
    useState(false);
  const isNewTokenGatedClub =
    isNewClub && activeModuleDetails?.activeMintModuleReqs?.isTokenGated;

  // Checks if Deposit Token/USD is switched in the deposit card
  const [depositTokenSwitched, setDepositTokenSwitched] = useState(false);
  const [isDemoTooltipOpen, setIsDemoTooltipOpen] = useState(false);

  const TRANSACTION_TOO_LONG_MSG =
    'This transaction is taking a while. You can speed it up by spending more gas via your wallet.';

  //  tokens for the connected wallet account
  const {
    accountTokens,
    memberOwnership,
    memberDeposits,
    refetchMemberData,
    startPolling,
    stopPolling
  } = useConnectedAccountDetails();

  const { loading: loadingTokenHoldings, data: tokenBalanceHoldings } =
    useFetchAccountHoldingsAndDetails();
  const { getTokenReqDetails } = useMeetsTokenGatedRequirements();

  const { isReady, isTreatmentOn: isClubMixinGuardTreatmentOn } =
    useFeatureFlag(FEATURE_FLAGS.CLUBS_MIXIN_GUARDED, {
      clubsMixinGuardedAllowlisted: true
    });

  useEffect(() => {
    // calculate member ownership for the intended deposits
    if (isNaN(+depositAmountFinalized) || !depositAmountFinalized) return;
    if (totalSupply && !checkSuccess) {
      // converting to Wei here to multiply because of a weird js precision issue when multiplying.
      // for instance, 0.0003 * 10000 returns 2.9999 instead of 3.
      const memberTokens = nativeDepositToken
        ? (+getWeiAmount(depositAmountFinalized, depositTokenDecimals, true) *
            activeNetwork.nativeCurrency.exchangeRate) /
          10 ** depositTokenDecimals
        : +depositAmountFinalized;
      const newTotalSupply = +totalSupply + +memberTokens;
      const memberPercentShare = memberTokens / newTotalSupply;
      const memberDilutedShare = memberTokens / +maxTotalSupply;

      setOwnershipShare(+memberPercentShare * 100);
      setFullyDilutedShare(memberDilutedShare * 100);
      setNewClubTokensSupply(newTotalSupply);
      setMemberTokens(memberTokens);
    }

    return (): void => {
      setOwnershipShare(0);
    };
  }, [
    depositAmount,
    totalSupply,
    depositAmountFinalized,
    depositTokenSwitched,
    depositTokenPriceInUSD
  ]);

  useEffect(() => {
    if (depositTokenSwitched) {
      const switchedAmount = nativeDepositToken
        ? truncateDecimals(
            // @ts-expect-error TS(2532): Object is possibly 'undefined'.
            ((parseFloat(depositAmount) / depositTokenPriceInUSD) * 100) / 100,
            4
          )
        : (
            Math.floor(
              // @ts-expect-error TS(2532): Object is possibly 'undefined'.
              (parseFloat(depositAmount) / depositTokenPriceInUSD) * 100
            ) / 100
          ).toString();
      setDepositAmountFinalized(switchedAmount.toString());
    } else {
      setDepositAmountFinalized(depositAmount);
    }
  }, [
    depositTokenSwitched,
    depositAmount,
    nativeDepositToken,
    depositTokenPriceInUSD
  ]);

  useEffect(() => {
    const [claimValue, claimDecimalValue] = floatedNumberWithCommas(
      myMerkleProof?._amount
    ).split('.');

    setClaimBalanceValue(claimValue);
    setClaimBalanceDecimalValue(claimDecimalValue);

    // @ts-expect-error TS(2532): Object is possibly 'undefined'.
    const newTotalSupply = +totalSupply + +myMerkleProof?._amount;
    const memberPercentShare = +myMerkleProof?._amount / newTotalSupply;

    setOwnershipShare(+memberPercentShare * 100);
    setMemberTokens(+myMerkleProof?._amount);
  }, [myMerkleProof?._amount, totalSupply]);

  useEffect(() => {
    // Convert time now from milliseconds to seconds and round-down/floor
    // https://stackoverflow.com/questions/5971645/what-is-the-double-tilde-operator-in-javascript
    const now = ~~(Date.now() / 1000);

    if (
      isTokenClaimed ||
      !airdropInfo.id ||
      airdropInfo.startTime > now ||
      airdropInfo.endTime < now
    ) {
      setInvalidClaim(true);
    } else {
      setInvalidClaim(false);
    }
  }, [isTokenClaimed, airdropInfo]);

  useEffect(() => {
    if (
      syndicateContracts &&
      erc20Token?.name &&
      depositToken &&
      !nativeDepositToken &&
      !isEmpty(web3)
    ) {
      // set up current deposit ERC20Contract and
      // and save it to the local state
      const ERC20Contract = new web3.eth.Contract(
        ERC20ABI as AbiItem[],
        depositToken
      );
      setDepositTokenContract(ERC20Contract);

      checkClubWideErrors();
    }
  }, [
    depositToken,
    erc20Token?.name,
    syndicateContracts,
    nativeDepositToken,
    web3
  ]);

  const onTxConfirm = (): void => {
    setMetamaskConfirmPending(false);
    setSubmitting(true);
  };

  const onTxReceipt = (): void => {
    startPolling(1000); // start polling for member stakes
    setMetamaskConfirmPending(false);
    if (claimEnabled) {
      setSubmitting(false);
      setSuccessfulClaim(true);
      dispatch(setERC20Token(erc20TokenContract));
    } else {
      setCheckSuccess(true);
    }
    setTimeout(() => refetchMemberData(), 4000);
  };

  const [, setpreviousAccountTokens] = useState(accountTokens);
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    if (!account || !address || isEmpty(web3)) return;

    void getMemberBalance(address, account, web3, activeNetwork).then(
      (balance) => {
        if (balance) {
          setIsMember(true);
        } else {
          setIsMember(false);
        }
      }
    );
  }, [account, address]);

  // since the subgraph might give us old data on refetch,
  // we need to compare old and new data as we continue to poll.
  useEffect(() => {
    if (isDemoMode || !checkSuccess) return;
    setpreviousAccountTokens((prevState: any) => {
      if (
        (isMember && +prevState > 0 && +prevState < +accountTokens) ||
        (!isMember && +prevState < +accountTokens)
      ) {
        setSuccessfulDeposit(true);
        setCheckSuccess(false);
        setSubmitting(false);

        dispatch(setERC20Token(erc20TokenContract));
      }
      return accountTokens;
    });
  }, [accountTokens, checkSuccess, nativeDepositToken]);

  const [transactionRejected, setTransactionRejected] = useState(false);
  const [transactionFailed, setTransactionFailed] = useState(false);

  const onTxFail = (error: any): void => {
    // if transaction errored because of a timeout, we do not need to
    // show the error state.
    if (error?.message.includes('Be aware that it might still be mined')) {
      return;
    }
    setMetamaskConfirmPending(false);
    setSubmitting(false);
    if (claimEnabled) {
      setSuccessfulClaim(false);
      setClaimFailed(true);
    } else {
      setTransactionRejected(true);
    }
  };

  const claimClubTokens = async (): Promise<void> => {
    setMetamaskConfirmPending(true);
    setTransactionRejected(false);
    setTransactionFailed(false);
    setSubmitting(true);
    try {
      const { amount, accountIndex, merkleProof, treeIndex } = myMerkleProof;
      const { MerkleDistributorModule } = syndicateContracts;
      await MerkleDistributorModule.claim(
        account,
        address,
        amount,
        accountIndex,
        treeIndex,
        merkleProof,
        onTxConfirm,
        onTxReceipt,
        onTxFail,
        setTransactionHash
      );
      setTransactionHash(transactionHash);
    } catch (error) {
      setSuccessfulClaim(false);
      setClaimFailed(true);
    } finally {
      setSubmitting(false);
    }
  };

  const SINGLE_TOKEN_MINT_MODULE_ADDR =
    CONTRACT_ADDRESSES[activeNetwork.chainId]?.SingleTokenMintModule;
  const NATIVE_MINT_MODULE =
    CONTRACT_ADDRESSES[activeNetwork.chainId]?.NativeMintModule;
  const DEPOSIT_TOKEN_MINT_MODULE =
    CONTRACT_ADDRESSES[activeNetwork.chainId]?.DepositTokenMintModule;

  /**
   * This methods is used to invest in LP(syndicate)
   * The account that is investing is obtained from the connected wallet from
   * which funds will be transferred.
   * The syndicate address is obtained from the page params
   * @param {object} data contains amount, and accredited
   */
  const investInSyndicate = async (amount: string): Promise<void> => {
    setCurrentTransaction(2);
    setMetamaskConfirmPending(true);
    setTransactionRejected(false);
    setTransactionFailed(false);

    try {
      if (mintModule?.toLowerCase() === NATIVE_MINT_MODULE?.toLowerCase()) {
        await syndicateContracts.NativeMintModule?.deposit(
          getWeiAmount(amount, depositTokenDecimals, true),
          erc20TokenContract?.clubERC20Contract._address,
          account,
          onTxConfirm,
          onTxReceipt,
          onTxFail,
          setTransactionHash
        );
      } else if (
        mintModule?.toLowerCase() ===
        SINGLE_TOKEN_MINT_MODULE_ADDR?.toLowerCase()
      ) {
        await syndicateContracts.SingleTokenMintModule?.deposit(
          getWeiAmount(amount, depositTokenDecimals, true),
          erc20TokenContract?.clubERC20Contract._address,
          account,
          onTxConfirm,
          onTxReceipt,
          onTxFail,
          setTransactionHash
        );
      } else if (
        mintModule?.toLowerCase() === DEPOSIT_TOKEN_MINT_MODULE?.toLowerCase()
      ) {
        await syndicateContracts.DepositTokenMintModule?.deposit(
          getWeiAmount(amount, depositTokenDecimals, true),
          erc20TokenContract?.clubERC20Contract._address,
          account,
          onTxConfirm,
          onTxReceipt,
          onTxFail,
          setTransactionHash
        );
      }

      if (approved) {
        setApproved(false);
      }

      // reset allowance error
      if (allowanceApprovalError) {
        setAllowanceApprovalError('');
      }
      // reset approval amount
      if (approvedAllowanceAmount) {
        setApprovedAllowanceAmount('0');
      }

      // refetch member stats
      if (activeNetwork.chainId) {
        refetchMemberData();
      }

      amplitudeLogger(CLUB_DEPOSIT, {
        flow: Flow.CLUB_DEPOSIT,
        transaction_status: 'Success',
        deposit_amount: amount,
        deposit_token: depositTokenSymbol
      });
    } catch (error) {
      const { code, message } = error as { code: number; message: string };

      // we don't want to dismiss the modal when the user rejects
      // the transaction.
      if (code === 4001) {
        setTransactionRejected(true);
        setSubmitting(false);
        setSuccessfulDeposit(false);
      } else if (message.includes('Be aware that it might still be mined')) {
        setTransactionTooLong(true);
      } else {
        setDepositFailed(true);
        setSubmitting(false);
        setSuccessfulDeposit(false);
      }
      setMetamaskConfirmPending(false);

      amplitudeLogger(CLUB_DEPOSIT, {
        flow: Flow.CLUB_DEPOSIT,
        transaction_status: 'Failure',
        deposit_amount: amount,
        deposit_token: depositTokenSymbol
      });
    }
  };

  useEffect(() => {
    if (!isNewTokenGatedClub) {
      setLoadingTokenGating(false);
    } else {
      if (loadingTokenHoldings || !tokenBalanceHoldings) return;
      const details = getTokenReqDetails(tokenBalanceHoldings.tokenHoldings);
      // @ts-expect-error TS(2345): Argument of type '{ meetsRequirements: boolean; requiredTokenDetails... Remove this comment to see the full error message
      dispatch(setTokenGatingDetails(details));
      setLoadingTokenGating(false);
      setMeetsNewClubRequirements(details?.meetsRequirements ?? false);
    }
  }, [
    isNewClub,
    isNewTokenGatedClub,
    loadingTokenHoldings,
    tokenBalanceHoldings,
    activeModuleDetails?.hasActiveModules
  ]);

  /**
   *
   * @returns {string} balance of the user for the deposit ERC20 token
   */
  const erc20Balance = useERC20TokenBalance(
    account,
    !isEmpty(web3)
      ? new web3.eth.Contract(ERC20ABI as AbiItem[], depositToken)
      : null,
    depositTokenDecimals
  );

  const nativeBalance = useNativeBalance(account);

  const { syndicateClubLogo } = useSyndicateClubInfo();

  const [disableMax, setDisableMax] = useState(false);

  // Interesting note for future: This doesn't really give the max value of Native Token/ERC20 when clicked.
  // It only gives the max value of Native Token/ERC20 truncated to 2 decimal points (there could be a little bit left over)
  const _erc20Balance = truncateDecimals(+erc20Balance?.toString(), 2);

  const _nativeBalance = truncateDecimals(+nativeBalance?.toString(), 2);

  useEffect(() => {
    if (+depositAmount === _erc20Balance || nativeDepositToken) {
      setDisableMax(true);
    } else {
      if (+depositAmount === _nativeBalance) {
        setDisableMax(true);
      } else {
        setDisableMax(false);
      }
    }
  }, [_erc20Balance, depositAmount, erc20Balance, nativeDepositToken]);

  const handleSetMax = (): void => {
    if (
      !nativeDepositToken &&
      erc20Balance &&
      +depositAmount !== _erc20Balance
    ) {
      if (depositTokenSwitched) {
        const maxDepositAmountAdjustedToUSD = Math.min(
          erc20Balance,
          // @ts-expect-error TS(2532): Object is possibly 'undefined'.
          erc20Balance * depositTokenPriceInUSD
        );
        setDepositAmount(maxDepositAmountAdjustedToUSD.toString());
      } else {
        setDepositAmount(erc20Balance.toString());
      }
    } else if (
      nativeDepositToken &&
      nativeBalance &&
      +depositAmount !== _nativeBalance
    ) {
      setDepositAmount(nativeBalance.toString());
    }
  };

  const addGrayToDecimalInput = (str: any) => {
    const [wholeNumber, decimalPart] = str.split('.');
    return (
      <div className="flex">
        {wholeNumber ? <p className="text-white">{wholeNumber}</p> : null}
        {decimalPart ? <p className="text-gray-syn4">.{decimalPart}</p> : null}
      </div>
    );
  };

  const [currentTransaction, setCurrentTransaction] = useState(1);
  // Ordered steps
  const depositSteps: {
    title: string;
    info?: string;
  }[] = [
    {
      title: `Approve ${depositTokenSymbol}`,
      info: `Before depositing, you need to allow the protocol to use your ${depositTokenSymbol}.`
    },
    { title: 'Complete deposit' }
  ];

  // check if approval is required for current amount.
  // if approval is not required, run the deposit function.
  // if not, set allowance to the deposit amount.
  useEffect(() => {
    if (depositAmount) {
      if (
        parseFloat(currentMemberAllowance) >= parseFloat(depositAmount) ||
        nativeDepositToken
      ) {
        // allowance already exists. Proceed with deposit
        setSufficientAllowanceSet(true);
        setCurrentTransaction(1);
      } else {
        // sufficient allowance needs to be set. Proceed with approval first.
        setSufficientAllowanceSet(false);
        setCurrentTransaction(0);
      }
    }
  }, [depositAmount, currentMemberAllowance, nativeDepositToken]);

  useEffect(() => {
    checkClubWideErrors();
  }, [totalDeposits, maxTotalDeposits, memberDeposits, account]);

  const isDemoMode = useDemoMode();
  const { width } = useWindowSize();

  /** ====== ADDITIONAL METHODS ======== */

  // method to check the allowance amount approved by a member.
  const checkCurrentMemberAllowance = useCallback(async () => {
    if (syndicateContracts && account && depositTokenContract) {
      try {
        const memberAllowanceAmount = await depositTokenContract?.methods
          .allowance(account.toString(), mintModule)
          .call({ from: account });

        const currentMemberAllowanceAmount = getWeiAmount(
          memberAllowanceAmount.toString(),
          depositTokenDecimals,
          false
        );

        setCurrentMemberAllowance(currentMemberAllowanceAmount);
      } catch (error) {
        setSufficientAllowanceSet(false);
      }
    }
  }, [syndicateContracts, account, depositTokenContract, successfulDeposit]);

  // check current member token allowance
  useEffect(() => {
    checkCurrentMemberAllowance();
  }, [checkCurrentMemberAllowance]);

  const isHoldingsCardColumn =
    +memberDeposits >= 10000 && ((width > 868 && width < 1025) || width < 500);

  useEffect(() => {
    // @ts-expect-error TS(2532): Object is possibly 'undefined'.
    const remainingClubTokensBalance = +maxTotalSupply - +totalSupply;

    setIsTextRed(false);

    let message;

    if (depositTokenSwitched) {
      if (
        // @ts-expect-error TS(2532): Object is possibly 'undefined'.
        +depositAmount / depositTokenPriceInUSD > remainingClubTokensBalance &&
        !insufficientBalance
      ) {
        message = (
          <>
            <span>The amount you entered is too high. This club is </span>
            <span className="underline">
              {floatedNumberWithCommas(
                remainingClubTokensBalance,
                nativeDepositToken ? true : false
              )}{' '}
              {depositTokenSymbol}
            </span>
            <span> away from reaching its maximum deposit.</span>
          </>
        );
        setDepositError(message);
        setClubWideErrors('');
        setIsTextRed(true);
      } else {
        setDepositError('');
        setClubWideErrors('');
      }
    } else {
      if (+depositAmount > remainingClubTokensBalance && !insufficientBalance) {
        message = (
          <>
            <span>The amount you entered is too high. This club is </span>
            <span className="underline">
              {floatedNumberWithCommas(
                remainingClubTokensBalance,
                nativeDepositToken ? true : false
              )}{' '}
              {depositTokenSymbol}
            </span>
            <span> away from reaching its maximum deposit.</span>
          </>
        );
        setDepositError(message);
        setClubWideErrors('');
        setIsTextRed(true);

        return;
      } else {
        setDepositError('');
        setClubWideErrors('');
      }
    }

    // with the introduction of cap table management, there can be inconsistencies between the amount
    // of club tokens and deposit tokens.
    if (
      newClubTokensSupply > +maxTotalSupply &&
      !insufficientBalance &&
      depositAmount
    ) {
      message = (
        <>
          <span>The amount you entered is too high. This club is </span>
          <span className="underline">
            {floatedNumberWithCommas(
              remainingClubTokensBalance,
              nativeDepositToken ? true : false
            )}{' '}
            {symbol}
          </span>
          <span> away from reaching its maximum tokens supply.</span>
        </>
      );
      setDepositError(message);
      setClubWideErrors('');
      setIsTextRed(true);
    } else {
      setDepositError('');
      setClubWideErrors('');
      setIsTextRed(false);
    }
  }, [
    newClubTokensSupply,
    maxTotalSupply,
    symbol,
    totalSupply,
    insufficientBalance,
    depositAmount
  ]);

  // method to handle approval of allowances by a member.
  const handleAllowanceApproval = async (
    event: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
    event.preventDefault();
    if (!web3) return;

    setMetamaskConfirmPending(true);
    setTransactionRejected(false);
    setTransactionFailed(false);

    // update current transaction step
    setCurrentTransaction(1);

    // set amount to approve.
    const amountToApprove = getWeiAmount(
      depositAmount.toString(),
      depositTokenDecimals,
      true
    );

    try {
      let gnosisTxHash;
      const gasEstimate = await estimateGas(web3);

      await new Promise((resolve, reject) => {
        const _depositTokenContract = new web3.eth.Contract(
          ERC20ABI as AbiItem[],
          depositToken
        );
        _depositTokenContract.methods
          .approve(mintModule, amountToApprove)
          .send({ from: account, gasPrice: gasEstimate })
          .on('transactionHash', (transactionHash: any) => {
            // user clicked on confirm
            // show loading state
            setSubmittingAllowanceApproval(true);
            setMetamaskConfirmPending(false);

            // Stop waiting if we are connected to gnosis safe via walletConnect
            if (web3._provider.wc?._peerMeta.name === 'Gnosis Safe Multisig') {
              gnosisTxHash = transactionHash;
              resolve(transactionHash);
            }
          })
          .on('receipt', async (receipt: any) => {
            // sometimes the returned values from the attached event do not have
            // value key, hence the will be undefined.
            // call this function does the job of checking whether the allowance
            // was approved successfully or not.
            await checkCurrentMemberAllowance();
            setSubmittingAllowanceApproval(false);
            setSufficientAllowanceSet(true);
            resolve(receipt);

            // update current transaction step
            setCurrentTransaction(2);
          })
          .on('error', (error: any) => {
            // user clicked reject.
            if (error?.code === 4001) {
              setTransactionRejected(true);
              setSubmittingAllowanceApproval(false);
              setMetamaskConfirmPending(false);
            } else if (
              error?.message.includes('Be aware that it might still be mined')
            ) {
              setTransactionTooLong(true);
            } else {
              setTransactionFailed(true);
              setSubmittingAllowanceApproval(false);
              setMetamaskConfirmPending(false);
            }
            reject(error);
          });
      });

      // fallback for gnosisSafe <> walletConnect
      if (gnosisTxHash) {
        // await getGnosisTxnInfo(gnosisTxHash, this.activeNetwork);
        await checkCurrentMemberAllowance();
        setSubmittingAllowanceApproval(false);
      }
    } catch (error) {
      setMetamaskConfirmPending(false);
      setSubmittingAllowanceApproval(false);
      setMetamaskConfirmPending(false);
    }
  };

  // method to close the success modal as well as the success state
  // card.
  const closeSuccessModal = () => {
    setSuccessfulDeposit(false);
    setSubmitting(false);
    setMetamaskConfirmPending(false);
    setDepositFailed(false);
    setTransactionFailed(false);
    setTransactionRejected(false);
    // clear deposit amount
    setDepositAmount('');
    if (showDepositProcessingModal) {
      toggleDepositProcessingModal();
    }
    stopPolling();
    if (activeNetwork.chainId) {
      refetchMemberData();
    }
  };

  const closeClaimCard = () => {
    if (successfulClaim) {
      setInvalidClaim(true);
    }

    setSuccessfulClaim(false);
    setSubmitting(false);
    setMetamaskConfirmPending(false);
    setClaimFailed(false);
    setTransactionFailed(false);
    setTransactionRejected(false);
  };

  // method to handle copying of transaction links
  const handleOnCopy = () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  /** ===========METHODS END ================== */

  // check member account balance for deposit token.
  // we'll disable the continue button and style the input field accordingly
  // if the deposit amount is less than the account balance
  useEffect(() => {
    if (nativeDepositToken) {
      checkNativeBalance();
    } else {
      checkERC20TokenBalance();
    }
  }, [
    depositAmount,
    erc20Token,
    erc20TokenContract,
    erc20Balance,
    nativeBalance,
    nativeDepositToken,
    depositTokenSwitched
  ]);

  // eslint-disable-next-line @typescript-eslint/require-await
  const checkNativeBalance = async () => {
    try {
      if (depositTokenSwitched) {
        if (
          // @ts-expect-error TS(2532): Object is possibly 'undefined'.
          +nativeBalance * depositTokenPriceInUSD < +depositAmount ||
          nativeBalance === 0
        ) {
          setInsufficientBalance(true);
          setDepositError('');
        } else {
          setInsufficientBalance(false);
        }
      } else {
        if (+nativeBalance < +depositAmount || nativeBalance === 0) {
          setInsufficientBalance(true);
          setDepositError('');
        } else {
          setInsufficientBalance(false);
        }
      }
      return nativeBalance;
    } catch {
      return 0;
    }
  };

  // eslint-disable-next-line @typescript-eslint/require-await
  const checkERC20TokenBalance = async () => {
    if (!erc20TokenContract?.address) return;

    try {
      if (depositTokenSwitched) {
        if (
          // @ts-expect-error TS(2532): Object is possibly 'undefined'.
          +erc20Balance * depositTokenPriceInUSD < +depositAmount ||
          erc20Balance === 0
        ) {
          setInsufficientBalance(true);
          setDepositError('');
        } else {
          setInsufficientBalance(false);
        }
      } else {
        if (+erc20Balance < +depositAmount || erc20Balance === 0) {
          setInsufficientBalance(true);
          setDepositError('');
        } else {
          setInsufficientBalance(false);
        }
      }
      return erc20Balance;
    } catch {
      return 0;
    }
  };

  const checkClubWideErrors = () => {
    let message;
    if (+totalDeposits === +maxTotalDeposits) {
      message = 'The maximum deposit amount for this club has been reached.';
      setClubWideErrors(message);
      setDepositError('');
      setImageSRC('/images/deposit/depositReached.svg');
    } else if (!(+memberDeposits > 0) && memberCount === maxMemberCount) {
      message = `The maximum number of members (${maxMemberCount}) for this club has been reached.`;
      setClubWideErrors(message);
      setDepositError('');
      setImageSRC('/images/deposit/userAttention.svg');
      // @ts-expect-error TS(2532): Object is possibly 'undefined'.
    } else if (+totalSupply >= +maxTotalSupply) {
      message = `The maximum club tokens supply of ${floatedNumberWithCommas(
        maxTotalSupply
      )} ${symbol} has been reached.`;
      setClubWideErrors(message);
      setDepositError('');
      setImageSRC('/images/deposit/depositReached.svg');
    } else {
      setDepositError('');
      setClubWideErrors('');
    }
  };

  const handleSetDeposit = (value: any) => {
    setDepositAmount(value);
    const remainingErc20Balance = +maxTotalDeposits - +totalDeposits;
    setIsTextRed(false);

    let message;

    if (depositTokenSwitched) {
      // @ts-expect-error TS(2532): Object is possibly 'undefined'.
      if (+value / depositTokenPriceInUSD > remainingErc20Balance) {
        message = (
          <>
            <span>The amount you entered is too high. This club is </span>
            <span className="underline">
              {remainingErc20Balance} {depositTokenSymbol}
            </span>
            <span> away from reaching its maximum deposit.</span>
          </>
        );
        setDepositError(message);
        setClubWideErrors('');
        setIsTextRed(true);
      } else {
        setDepositError('');
        setClubWideErrors('');
      }
    } else {
      if (+value > remainingErc20Balance) {
        message = (
          <>
            <span>The amount you entered is too high. This club is </span>
            <span className="underline">
              {remainingErc20Balance} {depositTokenSymbol}
            </span>
            <span> away from reaching its maximum deposit.</span>
          </>
        );
        setDepositError(message);
        setClubWideErrors('');
        setIsTextRed(true);
      } else {
        setDepositError('');
        setClubWideErrors('');
      }
    }
  };

  const handleCloseSuccessModal = () => {
    dispatch(setERC20Token(erc20TokenContract));
    toggleDepositProcessingModal();
  };

  // set deposit button text based on current step.
  let depositButtonText;
  if (submittingAllowanceApproval && depositAmount) {
    depositButtonText = (
      <div className="flex justify-center items-center">
        <div className="mr-2">
          <Spinner
            width="w-4"
            height="h-4"
            margin="m-0"
            color="text-gray-syn4"
          />
        </div>
        <span>{`Approving ${depositTokenSymbol}`}</span>
      </div>
    );
  } else if (sufficientAllowanceSet && depositAmount) {
    depositButtonText = 'Continue';
  } else if (!depositAmount) {
    depositButtonText = 'Enter an amount to deposit';
  } else if (
    !sufficientAllowanceSet &&
    !submittingAllowanceApproval &&
    depositAmount
  ) {
    depositButtonText = 'Continue';
  }

  const isOpenWithRequirementsMet =
    !loading &&
    depositsEnabled &&
    (isNewClub ? meetsNewClubRequirements : true);
  return (
    <ErrorBoundary>
      <div className="w-full mt-4 sm:mt-0 top-44">
        <div className={`rounded-2-half bg-gray-syn8`}>
          <StatusBadge
            merkleLoading={merkleLoading}
            depositsEnabled={depositsEnabled}
            // @ts-expect-error TS(2532): Object is possibly 'undefined'.
            depositExceedTotal={+totalSupply === +maxTotalSupply}
            claimEnabled={claimEnabled && !invalidClaim ? claimEnabled : false}
          />

          {status !== Status.DISCONNECTED &&
          !checkSuccess &&
          (loading ||
            merkleLoading ||
            claimLoading ||
            airdropInfoLoading ||
            loadingClubDeposits ||
            loadingTokenHoldings ||
            loadingTokenGatingRequirements) ? (
            <div className="h-fit-content rounded-2-half pt-6 px-8 pb-16">
              <SkeletonLoader
                width="1/3"
                height="5"
                borderRadius="rounded-full"
              />
              <div className="flex justify-between items-center mt-5 h-20 flex-wrap">
                <div className="w-1/2">
                  <SkeletonLoader
                    width="full"
                    height="8"
                    borderRadius="rounded-lg"
                  />
                </div>

                <div className="flex flex-row justify-between w-1/4 space-x-1">
                  <SkeletonLoader
                    width="8"
                    height="6"
                    borderRadius="rounded-full"
                  />
                  <SkeletonLoader
                    width="full"
                    height="6"
                    borderRadius="rounded-full"
                  />
                </div>
                <div className="w-full pt-1.5">
                  <SkeletonLoader
                    width="full"
                    height="10"
                    borderRadius="rounded-lg"
                  />
                </div>
                <div className="flex justify-center w-full pb-1.5">
                  <SkeletonLoader
                    width="2/3"
                    height="3"
                    borderRadius="rounded-full"
                  />
                </div>
              </div>
            </div>
          ) : status !== Status.DISCONNECTED &&
            isReady &&
            isClubMixinGuardTreatmentOn &&
            isNewTokenGatedClub &&
            !meetsNewClubRequirements &&
            depositsEnabled ? (
            <div>
              <TokenGatingRequirements
                gatingRequirementsMet={tokenGatingDetails?.meetsRequirements}
              />
            </div>
          ) : depositsEnabled ? (
            <FadeIn>
              {submitting ? (
                <div className="h-fit-content rounded-2-half text-center">
                  <div className="pt-10 pb-8">
                    <Spinner width="w-16" height="h-16" margin="m-0" />
                  </div>
                  <div className="pb-6">
                    <span className="text-2xl">{`Depositing ${floatedNumberWithCommas(
                      depositAmountFinalized,
                      nativeDepositToken ?? false
                    )} ${depositTokenSymbol}`}</span>
                  </div>
                  {transactionHash && (
                    <div className="pb-8 text-base flex justify-center items-center hover:opacity-80">
                      <BlockExplorerLink
                        resourceId={transactionHash}
                        resource="transaction"
                      />
                    </div>
                  )}
                </div>
              ) : successfulDeposit || depositFailed ? (
                <SuccessOrFailureContent
                  {...{
                    closeCard: closeSuccessModal,
                    successfulDeposit,
                    depositAmount: depositAmountFinalized,
                    transactionHash,
                    handleOnCopy,
                    copied,
                    memberPercentShare: memberOwnership,
                    clubTokenSymbol: symbol,
                    accountClubTokens: accountTokens.toString()
                  }}
                />
              ) : showDepositProcessingModal && depositFailed ? (
                <SuccessOrFailureContent
                  {...{
                    closeCard: closeSuccessModal,
                    successfulDeposit,
                    depositAmount: depositAmountFinalized,
                    transactionHash,
                    handleOnCopy,
                    copied,
                    memberPercentShare: memberOwnership,
                    clubTokenSymbol: symbol,
                    accountClubTokens: accountTokens.toString()
                  }}
                />
              ) : status === Status.DISCONNECTED && !isDemoMode ? (
                <div className="py-6 px-8">
                  <ConnectWalletAction />
                </div>
              ) : (
                <div className="h-fit-content rounded-2-half pt-6 px-8 pb-4">
                  <p className="h4 uppercase text-sm">
                    {+memberDeposits > 0 || +accountTokens > 0
                      ? 'deposit more'
                      : 'join this club'}
                  </p>
                  <div className="flex justify-between items-center mt-5 h-20 flex-wrap">
                    <div className="flex items-center">
                      <AutoGrowInputField
                        value={depositAmount}
                        onChangeHandler={(value: string): void =>
                          handleSetDeposit(value)
                        }
                        placeholder={'0'}
                        decimalSeparator="."
                        decimalScale={2}
                        hasError={isTextRed || insufficientBalance}
                        disabled={Boolean(clubWideErrors)}
                      />
                      {clubWideErrors ? (
                        <div className="h-4">
                          <Image
                            src="/images/deposit/lockedIcon.svg"
                            height={16}
                            width={16}
                          />
                        </div>
                      ) : null}
                      {!clubWideErrors &&
                      !depositError &&
                      !nativeDepositToken ? (
                        <div>
                          <button
                            className={`px-4 py-1.5 text-gray-syn4 bg-gray-syn7 rounded-full ${
                              disableMax ? 'cursor-not-allowed' : ''
                            }`}
                            onClick={handleSetMax}
                          >
                            Max
                          </button>
                        </div>
                      ) : null}
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center p-0 h-6 ">
                        {clubWideErrors ? (
                          <>
                            {depositTokenSwitched ? (
                              <>
                                <Image
                                  src="/images/prodTokenLogos/usd-coin-usdc.svg"
                                  height={24}
                                  width={24}
                                  className="filter grayscale opacity-40"
                                />
                                <p className="ml-2 text-base text-gray-syn5">
                                  USD
                                </p>
                                <button
                                  className="ml-2 cursor-pointer flex items-center"
                                  onClick={() => setDepositTokenSwitched(false)}
                                >
                                  <Image
                                    src="/images/upDownArrow.svg"
                                    height={16}
                                    width={16}
                                  />
                                </button>
                              </>
                            ) : (
                              <>
                                <Image
                                  src={
                                    depositTokenLogo ||
                                    '/images/token-gray-4.svg'
                                  }
                                  height={24}
                                  width={24}
                                  className="filter grayscale opacity-40"
                                />
                                <p className="ml-2 text-base text-gray-syn5">
                                  {depositTokenSymbol}
                                </p>
                                <button
                                  className="ml-2 cursor-pointer flex items-center"
                                  onClick={() => setDepositTokenSwitched(true)}
                                >
                                  <Image
                                    src="/images/upDownArrow.svg"
                                    height={16}
                                    width={16}
                                  />
                                </button>
                              </>
                            )}
                          </>
                        ) : (
                          <>
                            {depositTokenSwitched ? (
                              <>
                                <Image
                                  src="/images/USD.svg"
                                  height={24}
                                  width={24}
                                />
                                <p className="ml-2 text-base">USD</p>
                                <button
                                  className="ml-2 cursor-pointer flex items-center"
                                  onClick={() => setDepositTokenSwitched(false)}
                                >
                                  <Image
                                    src="/images/upDownArrow.svg"
                                    height={16}
                                    width={16}
                                  />
                                </button>
                              </>
                            ) : (
                              <>
                                <Image
                                  src={
                                    depositTokenLogo ||
                                    '/images/token-gray-4.svg'
                                  }
                                  height={24}
                                  width={24}
                                />
                                <p className="ml-2 text-base">
                                  {depositTokenSymbol}
                                </p>
                                <button
                                  className="ml-2 cursor-pointer flex items-center"
                                  onClick={() => setDepositTokenSwitched(true)}
                                >
                                  <Image
                                    src="/images/upDownArrow.svg"
                                    height={16}
                                    width={16}
                                  />
                                </button>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Error state for insufficientBalance */}
                  {insufficientBalance && (
                    <span className="text-red-error text-sm">
                      Insufficient balance.
                    </span>
                  )}

                  {/* Either the USD or deposit token value is displayed below the input amount in the deposit card */}
                  {depositTokenSwitched ? (
                    <p className="text-gray-syn4">
                      ~{' '}
                      {floatedNumberWithCommas(
                        // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                        parseFloat(depositAmount) / depositTokenPriceInUSD,
                        nativeDepositToken ?? false
                      )}{' '}
                      {depositTokenSymbol}
                    </p>
                  ) : (
                    <p className="text-gray-syn4">
                      ~{' '}
                      {floatedNumberWithCommas(
                        // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                        parseFloat(depositAmount) * depositTokenPriceInUSD
                      )}{' '}
                      USD
                    </p>
                  )}

                  {/* Show token approval text (ex: USDC approved)  */}
                  {+currentMemberAllowance >= +depositAmount &&
                    +depositAmount > 0 &&
                    +memberDeposits == 0 &&
                    !nativeDepositToken && (
                      <div className="flex items-center w-full justify-center mt-6">
                        <Image
                          src="/images/checkCircleGreen.svg"
                          height={16}
                          width={16}
                        />
                        <p className="ml-2 text-sm text-green">
                          {depositTokenSymbol} approved
                        </p>
                      </div>
                    )}

                  {depositError && (
                    <div className="font-whyte text-sm text-red-error mt-4">
                      {depositError}
                    </div>
                  )}

                  {/* Demo Mode Overlay */}
                  {isDemoTooltipOpen ? (
                    <div className="fixed top-0 bottom-0 left-0 right-0 bg-black bg-opacity-60" />
                  ) : null}

                  {!clubWideErrors ? (
                    <div className="mt-6 flex justify-center">
                      {isDemoMode ? (
                        <Floater
                          content={
                            <div className="text-green-volt text-sm">
                              <p>
                                Approve and sign transactions directly via your
                                wallet.
                              </p>
                              <p className="mt-4">
                                Action disabled in demo mode.
                              </p>
                            </div>
                          }
                          disableHoverToClick
                          event="hover"
                          eventDelay={0}
                          placement="bottom"
                          open={isDemoTooltipOpen}
                          styles={{
                            floater: {
                              filter: 'none'
                            },
                            container: {
                              backgroundColor: '#293300',
                              borderRadius: 5,
                              color: '#fff',
                              filter: 'none',
                              minHeight: 'none',
                              width: 310,
                              padding: 12,
                              textAlign: 'center'
                            },
                            arrow: {
                              color: '#293300',
                              length: 8,
                              spread: 10
                            },
                            options: { zIndex: 250 },
                            wrapper: {
                              cursor: 'pointer'
                            }
                          }}
                        >
                          <button
                            className={`w-full rounded-lg text-base px-8 py-4 ${
                              Boolean(depositError) ||
                              !depositAmount ||
                              submittingAllowanceApproval ||
                              submitting ||
                              insufficientBalance ||
                              depositAmount === '0.00' ||
                              isDemoMode
                                ? 'bg-gray-syn6 text-gray-syn4'
                                : 'bg-white text-black'
                            } ${isDemoMode ? 'cursor-pointer' : ''}`}
                            onMouseEnter={() => setIsDemoTooltipOpen(true)}
                            onMouseLeave={() => setIsDemoTooltipOpen(false)}
                          >
                            {depositButtonText}
                          </button>
                        </Floater>
                      ) : (
                        <button
                          className={`w-full rounded-lg text-base px-8 py-4 ${
                            Boolean(depositError) ||
                            !depositAmount ||
                            submittingAllowanceApproval ||
                            submitting ||
                            insufficientBalance ||
                            +depositAmount === 0 ||
                            isDemoMode
                              ? 'bg-gray-syn6 text-gray-syn4'
                              : 'bg-white text-black'
                          } ${
                            Boolean(depositError) ||
                            insufficientBalance ||
                            +depositAmount === 0 ||
                            !depositAmount
                              ? 'cursor-not-allowed'
                              : 'cursor-pointer'
                          }`}
                          onClick={(
                            e: React.MouseEvent<HTMLButtonElement>
                          ): void => {
                            if (submittingAllowanceApproval) {
                              toggleDepositProcessingModal();
                              return;
                            }

                            if (!sufficientAllowanceSet) {
                              setDepositAmountFinalized(depositAmount);
                              void handleAllowanceApproval(e);
                            } else {
                              void investInSyndicate(depositAmountFinalized);
                            }

                            void amplitudeLogger(DEPOSIT_CONTINUE_CLICK, {
                              flow: Flow.CLUB_DEPOSIT
                            });
                            toggleDepositProcessingModal();
                          }}
                          disabled={
                            insufficientBalance ||
                            +depositAmount === 0 ||
                            !depositAmount ||
                            Boolean(depositError) ||
                            isDemoMode
                          }
                        >
                          {depositButtonText}
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="font-whyte text-sm text-red-error flex mb-8 items-center mt-4">
                      <div className="h-4">
                        <Image src={imageSRC} height={24} width={24} />
                      </div>
                      <div className="ml-4">{clubWideErrors}</div>
                    </div>
                  )}

                  {!clubWideErrors && (
                    <div className="mt-4 flex w-full justify-center">
                      <p className="text-sm text-gray-syn5">
                        Your wallet balance:{' '}
                        {nativeDepositToken ? (
                          <>{floatedNumberWithCommas(nativeBalance, true)} </>
                        ) : (
                          <>{floatedNumberWithCommas(erc20Balance)} </>
                        )}
                        {depositTokenSymbol}{' '}
                        {nativeDepositToken ? (
                          <>
                            (~{' '}
                            {floatedNumberWithCommas(
                              nativeBalance * (depositTokenPriceInUSD || 1)
                            )}{' '}
                            USD)
                          </>
                        ) : (
                          <>
                            (~{' '}
                            {floatedNumberWithCommas(
                              erc20Balance * (depositTokenPriceInUSD || 1)
                            )}{' '}
                            USD)
                          </>
                        )}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </FadeIn>
          ) : claimEnabled && !invalidClaim ? (
            <FadeIn>
              {submitting ? (
                <div className="h-fit-content rounded-2-half text-center">
                  <div className="pt-10 pb-8">
                    <Spinner width="w-16" height="h-16" margin="m-0" />
                  </div>
                  <div className="pb-6">
                    <span className="text-2xl">
                      Claiming {claimBalanceValue}
                      {claimBalanceDecimalValue && (
                        <span className="text-gray-lightManatee">
                          .{claimBalanceDecimalValue}
                        </span>
                      )}{' '}
                      {symbol}
                    </span>
                  </div>
                  {transactionHash && (
                    <div className="pb-8 text-base flex justify-center items-center hover:opacity-80">
                      <BlockExplorerLink
                        resourceId={transactionHash}
                        resource="transaction"
                        prefix="View on "
                      />
                    </div>
                  )}
                </div>
              ) : successfulClaim || claimFailed ? (
                <SuccessOrFailureContent
                  {...{
                    closeCard: closeClaimCard,
                    successfulClaim,
                    claimFailed,
                    depositAmount: depositAmountFinalized,
                    transactionHash,
                    handleOnCopy,
                    copied,
                    memberPercentShare: memberOwnership,
                    clubTokenSymbol: symbol,
                    accountClubTokens: accountTokens.toString()
                  }}
                />
              ) : status === Status.DISCONNECTED ? (
                <div className="py-6 px-8">
                  <ConnectWalletAction />
                </div>
              ) : parseInt(claimBalanceValue) > 0 ||
                parseInt(claimBalanceDecimalValue) > 0 ? (
                <div className="h-fit-content rounded-2-half pt-6 px-8 pb-4">
                  <p className="h4 uppercase text-sm">
                    {claimEnabled && 'You will receive'}
                  </p>
                  <div className="flex justify-between items-center mt-4 flex-wrap">
                    <div className="text-5xl leading-14">
                      {claimBalanceValue}
                      {claimBalanceDecimalValue && (
                        <span className="text-gray-lightManatee">
                          .{claimBalanceDecimalValue}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center p-0 h-6 text-base">
                      {symbol}
                    </div>
                  </div>
                  <div className="mt-8 flex justify-center">
                    {(parseInt(claimBalanceValue) > 0 ||
                      parseInt(claimBalanceDecimalValue) > 0) && (
                      <button
                        className={`w-full rounded-lg text-base text-black px-8 py-4 bg-green`}
                        onClick={claimClubTokens}
                      >
                        Claim
                      </button>
                    )}
                  </div>
                  <div className="text-center text-sm text-gray-shuttle mt-4">
                    Club tokens are non-transferable and represent your
                    ownership share in this club.
                  </div>
                </div>
              ) : (
                <div className="h-fit-content rounded-2-half py-10 px-8">
                  <div className="text-center text-base text-gray-lightManatee">
                    The wallet you’re connected with has no {symbol} tokens
                    available to claim. <br></br> <br></br> If you expect that a
                    claim is available, try connecting a different wallet.
                  </div>
                </div>
              )}
            </FadeIn>
          ) : null}
        </div>
      </div>

      {/* We show holding component when user has made initial deposit */}
      {((status !== Status.DISCONNECTED &&
        (+memberDeposits > 0 || +accountTokens > 0) &&
        !loading &&
        account) ||
        isDemoMode) && (
        <div className="bg-gray-syn8 rounded-2xl mt-6 px-8 py-6">
          <L2 extraClasses="pb-5">Your Holdings</L2>
          {loading ? (
            <SkeletonLoader height="9" width="full" borderRadius="rounded-md" />
          ) : (
            <div className={`flex ${isHoldingsCardColumn ? 'flex-col' : ''}`}>
              <div
                className={
                  isHoldingsCardColumn
                    ? ''
                    : (width < 1380 || width < 868) &&
                      +memberDeposits >= 1000 &&
                      +memberDeposits < 10000
                    ? 'mr-6'
                    : 'mr-8'
                }
              >
                <HoldingsInfo
                  title="Amount deposited"
                  amount={floatedNumberWithCommas(memberDeposits)}
                  tokenName={depositTokenSymbol}
                  // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                  amountInUSD={memberDeposits * depositTokenPriceInUSD}
                />
              </div>
              <div className={isHoldingsCardColumn ? 'pt-5' : ''}>
                <HoldingsInfo
                  title="Club tokens (ownership share)"
                  amount={floatedNumberWithCommas(accountTokens)}
                  tokenName={symbol}
                  percentValue={floatedNumberWithCommas(memberOwnership)}
                  wrap="flex-wrap"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {status !== Status.DISCONNECTED &&
        (+memberDeposits === 0 || +accountTokens === 0) &&
        isReady &&
        isClubMixinGuardTreatmentOn &&
        isOpenWithRequirementsMet &&
        isNewTokenGatedClub && (
          <div className="mt-6">
            <TokenGatingRequirements
              gatingRequirementsMet={tokenGatingDetails?.meetsRequirements}
            />
          </div>
        )}

      <Modal
        {...{
          modalStyle: successfulDeposit ? ModalStyle.SUCCESS : ModalStyle.DARK,
          show: showDepositProcessingModal && !depositFailed,
          closeModal: () => handleCloseSuccessModal(),
          customWidth: 'w-11/12 sm:w-100',
          customClassName: 'pt-8 px-5 pb-5',
          showCloseButton: true,
          outsideOnClick: !metamaskConfirmPending,
          showHeader: false
        }}
      >
        <>
          {successfulDeposit ? (
            <div className="flex flex-col items-center">
              <img
                className="h-16 w-16"
                src="/images/syndicateStatusIcons/checkCircleGreen.svg"
                alt="checkmark"
              />
              <div className="pt-8">
                <span className="text-2xl">
                  Deposited{' '}
                  {floatedNumberWithCommas(
                    parseFloat(depositAmountFinalized),
                    nativeDepositToken ?? false
                  )}{' '}
                  {depositTokenSymbol}
                </span>
              </div>
              <div className="pt-4 px-3 text-center">
                <span className="text-base text-gray-syn4">
                  You now have {floatedNumberWithCommas(accountTokens)} {symbol}{' '}
                  which represents a {floatedNumberWithCommas(memberOwnership)}%
                  ownership share of this club.
                </span>
              </div>
              <CopyToClipboard
                text={`${activeNetwork.blockExplorer.baseUrl}/${activeNetwork.blockExplorer.resources.transaction}/${transactionHash}`}
                onCopy={handleOnCopy}
              >
                <div className="relative py-8 w-fit-content">
                  <div className="flex justify-center items-center cursor-pointer hover:opacity-80">
                    <div className="mr-2">
                      <Image
                        src="/images/actionIcons/copy-clipboard-white.svg"
                        height={12}
                        width={12}
                      />
                    </div>
                    <div>
                      <span className="text-base">Copy transaction link</span>
                    </div>
                  </div>
                  {copied && (
                    <div className=" absolute w-full flex justify-center items-center">
                      <span className="text-xs font-whyte-light">
                        Link copied
                      </span>
                    </div>
                  )}
                </div>
              </CopyToClipboard>

              <div className="px-5 w-full pb-5">
                <button
                  className="w-full rounded-lg text-base px-8 py-4 bg-white text-black"
                  onClick={() => {
                    closeSuccessModal();
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className="uppercase h4 pl-5">confirm deposit</p>
              <div className="mt-8 rounded-lg border-gray-syn6 border relative">
                <div className="py-4 px-5 border-gray-syn6 border-b">
                  <p className="text-base text-gray-syn4">Deposit amount</p>
                  <div className="flex items-center justify-between mt-1">
                    <div className="text-2xl">
                      <p>
                        {addGrayToDecimalInput(
                          floatedNumberWithCommas(
                            depositAmountFinalized.toString(),
                            nativeDepositToken ?? false
                          )
                        )}
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center p-0 h-6">
                        <Image
                          src={depositTokenLogo || '/images/token-gray-4.svg'}
                          height={24}
                          width={24}
                        />
                        <p className="ml-2 text-base">{depositTokenSymbol}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={`absolute p-2 bg-gray-syn8 border-gray-syn6 border rounded-lg`}
                  style={{ top: 'calc(50% - 24px)', left: 'calc(50% - 12px)' }}
                >
                  <ArrowDown />
                </div>
                <div className="py-4 px-5">
                  <div className="flex justify-between">
                    <p className="text-base text-gray-syn4">
                      Receiving club tokens
                    </p>
                    <Tooltip
                      content={
                        <div className="text-sm">
                          When you deposit into this club, you <br />
                          receive club tokens in return that
                          <br /> represent your ownership share of the
                          <br /> club.
                        </div>
                      }
                      arrow={false}
                      tipContentClassName="actionsTooltip"
                      background="#232529"
                      padding="12px 16px"
                      distance={13}
                    >
                      <InfoIcon
                        src={'/images/deposit/info.svg'}
                        iconSize="h-3.5"
                      />
                    </Tooltip>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <div className="text-2xl">
                      <p>{floatedNumberWithCommas(memberTokens)}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center p-0 h-6">
                        <Image
                          src={syndicateClubLogo as string}
                          height={24}
                          width={24}
                        />
                        <p className="ml-2 text-base">{symbol.slice(1)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-start mt-1">
                    <p className="text-sm text-gray-syn4">
                      {floatedNumberWithCommas(ownershipShare) === '< 0.01'
                        ? null
                        : '= '}
                      {floatedNumberWithCommas(ownershipShare)}% ownership share
                      ({floatedNumberWithCommas(fullyDilutedShare)}% fully
                      diluted)
                    </p>
                    <Tooltip
                      content={
                        <div className="flex flex-col space-y-2 text-sm">
                          <span>
                            Currently, this deposit would represent a <br />
                            {floatedNumberWithCommas(ownershipShare)}% ownership
                            share in this club.
                          </span>

                          <span>
                            Fully diluted (all available club tokens have
                            <br /> been minted), this deposit will represent a
                            <br />
                            {floatedNumberWithCommas(fullyDilutedShare)}%
                            ownership share in this club.
                          </span>
                        </div>
                      }
                      arrow={false}
                      tipContentClassName="actionsTooltip"
                      background="#232529"
                      padding="12px 16px"
                      distance={13}
                    >
                      <InfoIcon
                        src={'/images/deposit/info.svg'}
                        iconSize="h-3.5"
                      />
                    </Tooltip>
                  </div>
                </div>
              </div>

              {/* Show transaction steps if this is user's first deposit */}
              <div className="mt-8 px-5">
                {!(+memberDeposits > 0) &&
                  !nativeDepositToken &&
                  depositSteps.map((step, stepIdx) => {
                    const completedStep = currentTransaction > stepIdx + 1;
                    const inactiveStep = currentTransaction < stepIdx + 1;
                    return (
                      <div
                        className="flex flex-col mb-5 relative"
                        key={step.title}
                      >
                        {stepIdx !== depositSteps?.length - 1 ? (
                          <div
                            className={`-ml-px absolute mt-0.5 top-5 left-2.5 w-0.5 h-18  ${
                              completedStep ? 'bg-blue' : 'bg-gray-syn6'
                            }`}
                            aria-hidden="true"
                          />
                        ) : null}
                        <div className="relative flex group items-center">
                          <span
                            className="h-5 flex items-center"
                            aria-hidden="true"
                          >
                            {completedStep ? (
                              <span className="w-5 h-5 bg-blue rounded-full flex justify-center items-center">
                                <CheckIcon className="w-3 h-3 text-white" />
                              </span>
                            ) : (
                              <span
                                className={`relative z-5 w-5 h-5 flex items-center justify-center border-2 rounded-full ${
                                  inactiveStep
                                    ? 'border-gray-syn6'
                                    : 'border-blue'
                                }`}
                              />
                            )}
                          </span>
                          <span className="ml-4 min-w-0 flex flex-col">
                            <span
                              className={`text-base font-normal ${
                                inactiveStep ? 'text-gray-syn5' : 'text-white'
                              } leading-7 font-light transition-all`}
                            >
                              {step.title}
                            </span>
                          </span>
                        </div>
                        {step.info ? (
                          <div className="ml-9 text-gray-syn4 text-sm">
                            <p>{step.info}</p>
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
              </div>
              {(metamaskConfirmPending ||
                submitting ||
                submittingAllowanceApproval) &&
              !successfulDeposit ? (
                <div
                  className={`mt-6 rounded-custom flex flex-col items-center ${
                    metamaskConfirmPending
                      ? 'bg-blue-midnightExpress'
                      : 'bg-gray-syn7'
                  }`}
                >
                  {metamaskConfirmPending ||
                  submitting ||
                  submittingAllowanceApproval ? (
                    <div className="py-6">
                      <Spinner width="w-10" height="h-10" margin="m-0" />
                    </div>
                  ) : null}
                  <span className="font-whyte leading-normal pb-2">
                    {metamaskConfirmPending && !sufficientAllowanceSet
                      ? `Approve ${depositTokenSymbol} from your wallet`
                      : null}

                    {metamaskConfirmPending && sufficientAllowanceSet
                      ? 'Confirm deposit from your wallet'
                      : null}
                    {submittingAllowanceApproval
                      ? `Approving ${depositTokenSymbol}`
                      : submitting
                      ? `Depositing ${floatedNumberWithCommas(
                          depositAmountFinalized,
                          nativeDepositToken ?? false
                        )} ${depositTokenSymbol}`
                      : null}
                  </span>
                  <span
                    className={`leading-snug font-whyte text-sm ${
                      transactionTooLong
                        ? 'text-yellow-semantic'
                        : 'text-gray-syn4'
                    } px-5 text-center pb-5`}
                  >
                    {(submittingAllowanceApproval || submitting) &&
                    !transactionTooLong
                      ? 'This could take anywhere from seconds to hours depending on network congestion and the gas fees you set. You can safely leave this page while you wait.'
                      : null}
                    {(submitting || submittingAllowanceApproval) &&
                      transactionTooLong &&
                      TRANSACTION_TOO_LONG_MSG}
                    {metamaskConfirmPending && sufficientAllowanceSet
                      ? 'Deposits are irreversible.'
                      : null}
                  </span>
                  {submitting && transactionHash ? (
                    <div className="pb-4 text-base flex justify-center items-center hover:opacity-80">
                      <BlockExplorerLink
                        resourceId={transactionHash}
                        resource="transaction"
                      />
                    </div>
                  ) : null}
                </div>
              ) : (
                <div
                  className={`${
                    depositFailed || transactionFailed || transactionRejected
                      ? 'bg-red-error'
                      : ''
                  }   rounded-md bg-opacity-10 mt-4 py-6 flex flex-col justify-center px-5`}
                >
                  {(depositFailed ||
                    transactionRejected ||
                    transactionFailed) && (
                    <>
                      <div className="flex justify-center items-center w-full">
                        <Image
                          width={48}
                          height={48}
                          src={
                            '/images/syndicateStatusIcons/transactionFailed.svg'
                          }
                          alt="failed"
                        />
                      </div>
                      <div className={`mt-4 mb-6 text-center`}>
                        <span className="text-base">{`${
                          depositFailed
                            ? 'Deposit failed'
                            : `Transaction ${
                                transactionRejected ? 'rejected' : 'failed'
                              }`
                        }`}</span>
                      </div>
                    </>
                  )}
                  <button
                    className="w-full rounded-lg text-base py-4 bg-white text-black"
                    onClick={(e) => {
                      if (sufficientAllowanceSet) {
                        investInSyndicate(depositAmountFinalized);
                      } else {
                        handleAllowanceApproval(e);
                      }
                      setTransactionRejected(false);
                      setTransactionFailed(false);
                    }}
                  >
                    {depositFailed || transactionFailed || transactionRejected
                      ? 'Try again'
                      : sufficientAllowanceSet
                      ? 'Complete deposit'
                      : 'Continue'}
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      </Modal>

      <BeforeGettingStarted />
    </ErrorBoundary>
  );
};

export default DepositSyndicate;
