import ArrowDown from '@/components/icons/arrowDown';
import { NumberField, TextField } from '@/components/inputs';
import Modal, { ModalStyle } from '@/components/modal';
import { Spinner } from '@/components/shared/spinner';
import { BlockExplorerLink } from '@/components/syndicates/shared/BlockExplorerLink';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { OldClubERC20Contract } from '@/ClubERC20Factory/clubERC20/oldClubERC20';
import { OwnerMintModuleContract } from '@/ClubERC20Factory/ownerMintModule';
import { ProgressModal, ProgressModalState } from '@/components/progressModal';
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
      erc20TokenContract
    },
    web3Reducer: {
      web3: { web3, account, activeNetwork }
    },
    initializeContractsReducer: { syndicateContracts }
  } = useSelector((state: AppState) => state);
  const dispatch = useDispatch();

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
      const mintPolicy = new MintPolicyContract(currentMintPolicyAddress, web3);

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

      setClubSuccessfullyClosed(true);
    } catch (error) {
      setCloseClubFailed(true);
      setConfirmCloseClub(false);
      setClosingClub(false);
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
          state: ProgressModalState.CONFIRM
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
          state: ProgressModalState.PENDING
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
          state: ProgressModalState.FAILURE,
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
          state: ProgressModalState.SUCCESS
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
          state: ProgressModalState.CONFIRM
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
          state: ProgressModalState.PENDING
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
          state: ProgressModalState.SUCCESS,
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
          state: ProgressModalState.FAILURE,
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
    setMinting(false);
    setMintFailed(true);
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

    // OwnerMintModule for policyMintERC20
    const OWNER_MINT_MODULE =
      CONTRACT_ADDRESSES[activeNetwork.chainId]?.OwnerMintModule;
    // OwnerMintModule for mintPolicy
    const OWNER_MINT_MODULE_2 = process.env.NEXT_PUBLIC_OWNER_MINT_MODULE_2;

    const policyMintERC20MintModule =
      await syndicateContracts.policyMintERC20.isModuleAllowed(
        erc20TokenContract.address,
        OWNER_MINT_MODULE
      );

    // Both ETH and USDC clubs should work with OwnerMintModule
    const useOwnerMintModule =
      policyMintERC20MintModule ||
      (await syndicateContracts.mintPolicy.isModuleAllowed(
        erc20TokenContract.address,
        OWNER_MINT_MODULE_2
      ));

    if (useOwnerMintModule) {
      // Use either OwnerMintModule for policyMintERC20 or one for mintPolicy
      // respectively
      const OwnerMintModule = policyMintERC20MintModule
        ? syndicateContracts.OwnerMintModule
        : new OwnerMintModuleContract(OWNER_MINT_MODULE_2, web3);

      await OwnerMintModule.ownerMint(
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
          web3
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
