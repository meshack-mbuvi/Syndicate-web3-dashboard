import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { OldClubERC20Contract } from '@/ClubERC20Factory/clubERC20/oldClubERC20';
import { ProgressModal } from '@/components/progressModal';
import ConfirmMemberDetailsModal from '@/containers/managerActions/mintAndShareTokens/ConfirmMemberDetailsModal';
import MemberDetailsModal from '@/containers/managerActions/mintAndShareTokens/MemberDetailsModal';
import { setERC20Token } from '@/helpers/erc20TokenDetails';
import { useClubDepositsAndSupply } from '@/hooks/useClubDepositsAndSupply';
import { AppState } from '@/state';
import { getWeiAmount } from '@/utils/conversions';
import { isDev } from '@/utils/environment';
import { formatAddress } from '@/utils/formatAddress';
import {
  numberInputRemoveCommas,
  numberWithCommas
} from '@/utils/formattedNumbers';
import { ClubStillOpenModal } from '@/containers/managerActions/mintAndShareTokens/ClubStillOpenModal';
import { MintPolicyContract } from '@/ClubERC20Factory/policyMintERC20';
import { CONTRACT_ADDRESSES } from '@/Networks';
import { ProgressState } from '@/components/progressCard';
import { useRouter } from 'next/router';

interface Props {
  show: boolean;
  handleShow: (show: boolean) => void;
  existingMembers: any;
}

export const MintAndShareTokens: React.FC<Props> = ({
  show,
  handleShow,
  existingMembers
}) => {
  const {
    erc20TokenSliceReducer: {
      erc20Token: {
        symbol,
        owner,
        maxTotalSupply,
        tokenDecimals,
        address,
        memberCount,
        maxMemberCount,
        startTime,
        currentMintPolicyAddress
      },
      erc20TokenContract,
      isNewClub
    },
    initializeContractsReducer: {
      syndicateContracts: { timeRequirements }
    },
    web3Reducer: {
      web3: { web3, account, activeNetwork }
    },
    initializeContractsReducer: { syndicateContracts }
  } = useSelector((state: AppState) => state);
  const dispatch = useDispatch();

  const router = useRouter();
  const {
    query: { clubAddress }
  } = router;

  const [confirm, setConfirm] = useState(false);
  const [minting, setMinting] = useState(false);
  const [minted, setMinted] = useState(false);
  const [preview, setPreview] = useState(false);
  const [mintFailed, setMintFailed] = useState(false);
  const [transactionHash, setTransactionHash] = useState('');
  const [userRejectedMint, setUserRejectedMint] = useState(false);

  const [memberAddress, setMemberAddress] = useState('');
  const [memberAddressError, setMemberAddressError] = useState('');
  const [amountToMint, setAmountToMint] = useState('0');
  const [amountToMintError, setAmountToMintError] = useState<
    string | React.ReactElement
  >('');
  const [totalSupplyPostMint, setTotalSupplyPostMint] = useState(0);
  const [inputFieldsDisabled, setInputFieldsDisabled] = useState(false);
  const [ownershipShare, setOwnershipShare] = useState(0);
  const [showClubStillOpenModal, setShowClubStillOpenModal] = useState(false);

  const { totalSupply } = useClubDepositsAndSupply(address);

  // progress states for closing club post mint (after re-opening)
  const [confirmCloseClub, setConfirmCloseClub] = useState(false);
  const [closingClub, setClosingClub] = useState(false);
  const [clubSuccessfullyClosed, setClubSuccessfullyClosed] = useState(false);
  const [closeClubFailed, setCloseClubFailed] = useState(false);
  const [closeClubRejected, setCloseClubRejected] = useState(false);

  let clubReopenedForMint = false;
  if (typeof window !== 'undefined') {
    const mintingForClosedClubDetails = JSON.parse(
      localStorage.getItem('mintingForClosedClub')
    );

    if (mintingForClosedClubDetails?.mintingForClosedClub) {
      const { mintingForClosedClub, clubAddress } = mintingForClosedClubDetails;
      clubReopenedForMint = mintingForClosedClub && clubAddress === address;
    }
  }

  useEffect(() => {
    if (totalSupply) {
      const newTotalSupply = +totalSupply + +amountToMint;
      const memberPercentShare = +amountToMint / newTotalSupply;
      setOwnershipShare(+memberPercentShare * 100);
    }
  }, [totalSupply, amountToMint]);

  const currentClubTokenSupply = +maxTotalSupply - +totalSupply;

  // add check for number of members
  useEffect(() => {
    if (memberCount === maxMemberCount) {
      setMemberAddressError(
        `The maximum number of members (${maxMemberCount}) for this club has been reached.`
      );
      setInputFieldsDisabled(true);
    } else {
      setMemberAddressError('');
      setInputFieldsDisabled(false);
    }
  }, [maxMemberCount, memberCount]);

  const handleAddressChange = (e) => {
    const addressValue = e.target.value;

    setMemberAddress(addressValue);

    if (!addressValue.trim()) {
      setMemberAddressError('Member address is required.');
      setMemberAddress('');
    } else if (addressValue && !web3.utils.isAddress(addressValue)) {
      setMemberAddressError('Please provide a valid Ethereum address.');
    } else if (addressValue.toLocaleLowerCase() === owner.toLocaleLowerCase()) {
      setMemberAddressError('Club owner cannot be a member.');
    } else if (
      web3.utils.isAddress(addressValue) &&
      existingMembers.filter(
        (member) => member.memberAddress === addressValue.toLocaleLowerCase()
      ).length > 0
    ) {
      setMemberAddressError('Address is already a member.');
    } else {
      setMemberAddressError('');
    }
  };

  const handleAmountChange = (e) => {
    const amount = numberInputRemoveCommas(e);
    if (+amount > +currentClubTokenSupply) {
      setAmountToMintError(
        <span>
          Amount exceeds available club token supply of{' '}
          <button
            onClick={() => {
              setMaxRemainingSupply();
            }}
          >
            <u>
              {numberWithCommas(currentClubTokenSupply)} {symbol}
            </u>
          </button>
        </span>
      );
    } else if (!amount || +amount <= 0) {
      setAmountToMintError('Amount is required.');
    } else {
      setAmountToMintError('');
    }
    setAmountToMint(amount >= 0 ? amount : '');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPreview(true);
  };

  const clearFieldErrors = () => {
    if (!inputFieldsDisabled) {
      setMemberAddressError('');
    }
    setAmountToMintError('');
    setAmountToMint('0');
    setMemberAddress('');
  };

  useEffect(() => {
    if (amountToMint) {
      setTotalSupplyPostMint(+totalSupply + +amountToMint);
    } else {
      setTotalSupplyPostMint(+totalSupply);
    }
  }, [amountToMint, totalSupply]);

  const refreshClubDetails = () => dispatch(setERC20Token(erc20TokenContract));

  // refresh club details whenever a change in member count
  // is detected.
  useEffect(() => {
    refreshClubDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memberCount]);

  const handleCloseSuccessModal = () => {
    setConfirm(false);
    setPreview(false);
    setMinted(false);
    setMinting(false);
    setMintFailed(false);
    refreshClubDetails();

    // clear modal states
    clearFieldErrors();

    if (clubReopenedForMint) {
      if (!showClubStillOpenModal) {
        setShowClubStillOpenModal(true);
      } else {
        setShowClubStillOpenModal(false);
        setCloseClubFailed(false);
        setClubSuccessfullyClosed(false);
      }
    }

    if (clubSuccessfullyClosed) {
      localStorage.removeItem('mintingForClosedClub');
    }
  };

  // states for closing club after re-opening it
  // for the purpose of minting club tokens.
  const onCloseTxConfirm = (transactionHash: string) => {
    setConfirmCloseClub(false);
    setTransactionHash(transactionHash);
    setClosingClub(true);
  };
  const onCloseTxReceipt = () => {
    setClosingClub(false);
    setClubSuccessfullyClosed(true);
    refreshClubDetails();
  };

  const handleCloseClubPostMint = async () => {
    setConfirmCloseClub(true);
    try {
      // adding 30 minutes since current time will be in the past by the time
      // the transaction is confirmed.
      const newEndTime = new Date().getTime() + 1800000;

      /* set max token supply to current total supply.
       * this prevents more deposits from new members or existing members while the club
       * still remains open.*/
      const _tokenCap = getWeiAmount(web3, String(totalSupply), 18, true);

      if (isNewClub) {
        await timeRequirements.closeTimeWindow(
          account,
          clubAddress as string,
          onTxConfirm,
          onTxReceipt,
          onTxFail
        );
      } else if (
        currentMintPolicyAddress.toLowerCase() ==
        CONTRACT_ADDRESSES[
          activeNetwork.chainId
        ]?.guardMixinManager.toLowerCase()
      ) {
        // txn 1/(2 eventually)
        await timeRequirements.updateTimeRequirements(
          account,
          address,
          startTime,
          ~~(newEndTime / 1000),
          onTxConfirm,
          onTxReceipt,
          onTxFail
        );
        // TODO: [TOKEN-GATING] update the tokenCap txn (2/2) after token-gating branches merged with updateTotalSupply
      } else if (
        currentMintPolicyAddress.toLowerCase() ==
          CONTRACT_ADDRESSES[activeNetwork.chainId]?.mintPolicy.toLowerCase() ||
        currentMintPolicyAddress.toLowerCase() ==
          CONTRACT_ADDRESSES[
            activeNetwork.chainId
          ]?.policyMintERC20.toLowerCase()
      ) {
        const mintPolicy = new MintPolicyContract(
          currentMintPolicyAddress,
          web3,
          activeNetwork
        );

        // using the endMint function on the mint policy
        // will lock club settings and prevent subsequent changes to club settings.
        await mintPolicy.modifyERC20(
          account,
          address,
          startTime / 1000,
          parseInt((newEndTime / 1000).toString()),
          +maxMemberCount,
          _tokenCap,
          onCloseTxConfirm,
          onCloseTxReceipt
        );
      } else {
        // TODO: [AMPLITUDE] add amplitude error specific to mint policy case
        throw new Error('No matching mint policy');
      }

      setClubSuccessfullyClosed(true);
    } catch (error) {
      setCloseClubFailed(true);
      setConfirmCloseClub(false);
      setClosingClub(false);
      // TODO: [AMPLITUDE] add amplitude error for closing club
      const { code } = error;
      if (code == 4001) {
        setCloseClubRejected(true);
      } else {
        setCloseClubRejected(false);
      }
    }
  };

  // progress states for closing club
  if (confirmCloseClub) {
    return (
      <ProgressModal
        {...{
          isVisible: true,
          title: 'Confirm in wallet',
          description:
            'Confirm the modification of club settings in your wallet.',
          state: ProgressState.CONFIRM
        }}
      />
    );
  } else if (closingClub) {
    return (
      <ProgressModal
        {...{
          isVisible: true,
          title: 'Closing your club',
          description:
            'This could take anywhere from seconds to hours depending on network congestion and the gas fees you set. You can safely leave this page while you wait.',
          etherscanHash: transactionHash,
          transactionType: 'transaction',
          state: ProgressState.PENDING
        }}
      />
    );
  } else if (closeClubFailed) {
    return (
      <ProgressModal
        {...{
          isVisible: true,
          title: 'Your club could not be closed',
          description: '',
          buttonLabel: 'Close',
          buttonOnClick: handleCloseSuccessModal,
          buttonFullWidth: true,
          state: ProgressState.FAILURE,
          etherscanHash: closeClubRejected ? null : transactionHash,
          transactionType: 'transaction'
        }}
      />
    );
  } else if (clubSuccessfullyClosed) {
    return (
      <ProgressModal
        {...{
          isVisible: true,
          title: 'Your club is now closed to deposits',
          buttonLabel: 'Done',
          buttonOnClick: handleCloseSuccessModal,
          buttonFullWidth: false,
          state: ProgressState.SUCCESS
        }}
      />
    );
  }

  // progress states for minting club tokens.
  if (confirm) {
    return (
      <ProgressModal
        {...{
          isVisible: true,
          title: 'Confirm in wallet',
          description: 'Please confirm the club token mint in your wallet.',
          state: ProgressState.CONFIRM
        }}
      />
    );
  } else if (minting) {
    return (
      <ProgressModal
        {...{
          isVisible: true,
          title: 'Adding member',
          description:
            'This could take anywhere from seconds to hours depending on network congestion and the gas fees you set. You can safely leave this page while you wait.',
          transactionHash: transactionHash,
          transactionType: 'transaction',
          state: ProgressState.PENDING
        }}
      />
    );
  } else if (minted) {
    return (
      <ProgressModal
        {...{
          isVisible: true,
          title: 'Member added successfully',
          description: `${formatAddress(
            memberAddress,
            6,
            4
          )} has been added as a member of this club.`,
          buttonLabel: clubReopenedForMint ? 'Continue' : 'Done',
          buttonOnClick: handleCloseSuccessModal,
          buttonFullWidth: true,
          state: ProgressState.SUCCESS,
          transactionHash: transactionHash,
          transactionType: 'transaction'
        }}
      />
    );
  } else if (mintFailed) {
    return (
      <ProgressModal
        {...{
          isVisible: true,
          title: 'Member addition failed',
          description: '',
          buttonLabel: 'Close',
          buttonOnClick: handleCloseSuccessModal,
          buttonFullWidth: true,
          state: ProgressState.FAILURE,
          transactionHash: userRejectedMint ? null : transactionHash,
          transactionType: 'transaction'
        }}
      />
    );
  }

  const onTxConfirm = () => {
    setMinting(true);
    setConfirm(false);
  };

  const onTxReceipt = () => {
    setMinting(false);
    setMinted(true);
    refreshClubDetails();
  };

  const onTxFail = (error) => {
    const { message } = error;
    // this error is triggered on Polygon after transaction success.
    // we don't need to show the failure modal.
    if (message.indexOf('Transaction was not mined within 50 blocks') > -1) {
      setMintFailed(false);
    } else {
      setMintFailed(true);
      setMinting(false);
    }
    setConfirm(false);
    const { code } = error;
    if (code == 4001) {
      setUserRejectedMint(true);
    } else {
      setUserRejectedMint(false);
    }
  };

  const handleMinting = async () => {
    setConfirm(true);

    // Simulate call from owner mint module and then execute it if it succeeds
    let useOwnerMintModule;
    try {
      useOwnerMintModule =
        !!(await syndicateContracts.OwnerMintModule.OwnerMintModuleContract.methods
          .ownerMint(
            erc20TokenContract.address,
            memberAddress,
            getWeiAmount(web3, amountToMint, tokenDecimals, true)
          )
          .estimateGas({
            from: owner
          }));
    } catch (err) {
      useOwnerMintModule = false;
    }

    if (useOwnerMintModule) {
      await syndicateContracts.OwnerMintModule.ownerMint(
        getWeiAmount(web3, amountToMint, tokenDecimals, true),
        erc20TokenContract.address,
        memberAddress,
        owner,
        onTxConfirm,
        onTxReceipt,
        onTxFail,
        setTransactionHash
      );
    } else {
      // If owner mint module simulated call fails, try to fall back to calling club directly
      if (isDev) {
        await erc20TokenContract.mintTo(
          memberAddress,
          getWeiAmount(web3, amountToMint, tokenDecimals, true),
          owner,
          onTxConfirm,
          onTxReceipt,
          onTxFail,
          setTransactionHash
        );
      } else {
        const oldErc20TokenContract = new OldClubERC20Contract(
          erc20TokenContract.address,
          web3,
          activeNetwork
        );

        await oldErc20TokenContract.controllerMint(
          memberAddress,
          getWeiAmount(web3, amountToMint, tokenDecimals, true),
          owner,
          onTxConfirm,
          onTxReceipt,
          onTxFail,
          setTransactionHash
        );
      }
    }
  };

  const setMaxRemainingSupply = () => {
    setAmountToMintError('');
    setAmountToMint(currentClubTokenSupply.toString());
  };

  return (
    <div>
      <MemberDetailsModal
        {...{
          show,
          memberAddress,
          amountToMint,
          amountToMintError,
          memberAddressError,
          symbol,
          handleShow,
          clearFieldErrors,
          handleAddressChange,
          handleSubmit,
          handleAmountChange,
          setMaxRemainingSupply,
          inputFieldsDisabled
        }}
      />

      <ConfirmMemberDetailsModal
        {...{
          preview,
          symbol,
          memberAddress,
          amountToMint,
          ownershipShare,
          totalSupply,
          totalSupplyPostMint,
          handleShow,
          setPreview,
          handleMinting
        }}
      />

      <ClubStillOpenModal
        {...{
          showClubStillOpenModal,
          setShowClubStillOpenModal,
          handleCloseClubPostMint
        }}
      />
    </div>
  );
};
