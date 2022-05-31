import { Spinner } from '@/components/shared/spinner';
import { BlockExplorerLink } from '@/components/syndicates/shared/BlockExplorerLink';
import { AppState } from '@/state';
import { clearERC721Claimed } from '@/state/claimedERC721/slice';
import { showWalletModal } from '@/state/wallet/actions';
import { Status } from '@/state/wallet/types';
import { getWeiAmount } from '@/utils/conversions';
import { formatAddress } from '@/utils/formatAddress';
import { MinusCircleIcon, PlusCircleIcon } from '@heroicons/react/outline';
import { BigNumber } from 'bignumber.js';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const ClaimCard: React.FC<{
  handleMintUpdate?: (amount) => void;
  openseaLink: string;
  rawNativeBalance: string;
  startTime: number;
}> = ({ handleMintUpdate, openseaLink, rawNativeBalance, startTime }) => {
  const dispatch = useDispatch();

  const {
    initializeContractsReducer: { syndicateContracts },
    erc721MerkleProofSliceReducer: { erc721MerkleProof },
    erc721AirdropInfoSliceReducer: { erc721AirdropInfo },
    claimedERC721SliceReducer: { erc721Claimed },
    web3Reducer: {
      web3: { account, status, activeNetwork, web3 }
    },
    erc721TokenSliceReducer: { erc721Token }
  } = useSelector((state: AppState) => state);

  const [claimAvailable, setClaimAvailable] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string>();
  const [claimFailed, setClaimFailed] = useState(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [successfulClaim, setSuccessfulClaim] = useState<boolean>(false);
  const [claimStarted, setClaimStarted] = useState<boolean>(false);
  const [claimEnded, setClaimEnded] = useState<boolean>(false);
  const [claimAmount, setClaimAmount] = useState<number>(1);
  const [claimError, setClaimError] = useState<string>('');
  const [claimNativeValue, setClaimNativeValue] = useState<string>(
    erc721Token.nativePrice
  );
  const [claimValue, setClaimValue] = useState<string>(erc721Token.nativePrice);
  const [timeLeft, setTimeLeft] = useState<string>('soon');
  const [fullyClaimed, setFullyClaimed] = useState<boolean>(false);

  useEffect(() => {
    if (status == Status.DISCONNECTED) {
      dispatch(clearERC721Claimed());
    }
  }, [status]);

  const connectWallet = () => {
    dispatch(showWalletModal());
  };

  const tryAgain = () => {
    setClaimFailed(false);
  };

  const viewCollection = () => {
    window.open(openseaLink, '_blank');
  };

  const updateClaimAmount = (increase) => {
    if (increase) {
      setClaimAmount((claimAmount) => claimAmount + 1);
    } else if (claimAmount > 1) {
      setClaimAmount((claimAmount) => claimAmount - 1);
    }
  };

  useEffect(() => {
    if (erc721Token.nativePrice && claimAmount) {
      const amount = String(
        new BigNumber(erc721Token.nativePrice).times(claimAmount)
      );
      setClaimNativeValue(amount);
      setClaimValue(getWeiAmount(web3, amount, 18, false));
    }
  }, [erc721Token.nativePrice, claimAmount, rawNativeBalance]);

  useEffect(() => {
    if (erc721Token.maxPerAddress - erc721Token.amountMinted === 0) {
      setFullyClaimed(true);
    } else if (
      claimAmount > erc721Token.maxSupply - erc721Token.currentSupply ||
      claimAmount > erc721Token.maxPerAddress
    ) {
      setClaimError('Max Claim Exceeded');
    } else if (claimValue > getWeiAmount(web3, rawNativeBalance, 18, false)) {
      setClaimError(
        `Insufficient ${activeNetwork.nativeCurrency.symbol} balance`
      );
    } else {
      setClaimError('');
    }
  }, [
    claimAmount,
    claimNativeValue,
    claimValue,
    rawNativeBalance,
    erc721Token.amountMinted,
    erc721Token.maxPerAddress,
    erc721Token.maxSupply
  ]);

  useEffect(() => {
    if (erc721Token.merkleClaimEnabled) {
      // Convert time now from milliseconds to seconds and round-down/floor
      // https://stackoverflow.com/questions/5971645/what-is-the-double-tilde-operator-in-javascript
      const now = ~~(Date.now() / 1000);

      if (erc721AirdropInfo.startTime > now) {
        setClaimStarted(false);
        setClaimEnded(false);
      }
      if (
        erc721AirdropInfo.startTime < now &&
        erc721AirdropInfo.endTime > now
      ) {
        setClaimStarted(true);
        setClaimEnded(false);
      }
      if (erc721AirdropInfo.endTime < now) {
        setClaimStarted(true);
        setClaimEnded(true);
      }
    } else if (
      erc721Token.publicSingleClaimEnabled ||
      erc721Token.publicUtilityClaimEnabled
    ) {
      if (startTime) {
        const now = ~~(Date.now() / 1000);
        if (startTime > now) {
          setClaimStarted(false);
          setClaimEnded(false);
        } else {
          setClaimStarted(true);
          setClaimEnded(false);
        }
      } else {
        setClaimStarted(true);
        setClaimEnded(false);
      }

      if (erc721Token.currentSupply >= erc721Token.publicSupply) {
        setClaimEnded(true);
      }
    }
  }, [
    erc721AirdropInfo.startTime,
    erc721AirdropInfo.endTime,
    erc721Token.publicSingleClaimEnabled,
    erc721Token.publicSupply,
    erc721Token.currentSupply,
    startTime,
    timeLeft
  ]);

  useEffect(() => {
    setTimeLeft(() => moment(startTime * 1000).fromNow());
  }, [startTime]);

  useEffect(() => {
    if (erc721MerkleProof?.account) {
      setClaimAvailable(true);
    } else {
      setClaimAvailable(false);
    }
  }, [erc721MerkleProof?.account]);

  useEffect(() => {
    setClaimAvailable(!erc721Claimed?.claimed);
  }, [erc721Claimed?.claimed]);

  const onTxConfirm = () => {
    setSubmitting(true);
  };

  const onTxReceipt = async () => {
    setSubmitting(false);
    setSuccessfulClaim(true);
    if (handleMintUpdate) {
      handleMintUpdate(claimAmount);
    }
  };

  const onTxFail = () => {
    setSubmitting(false);
    setSuccessfulClaim(false);
    setClaimFailed(true);
  };

  const claimNFT = async () => {
    setSubmitting(true);
    try {
      const { accountIndex, merkleProof, treeIndex } = erc721MerkleProof;
      const {
        MerkleDistributorModuleERC721,
        PublicOnePerAddressModule,
        PublicMintWithFeeModule
      } = syndicateContracts;
      if (erc721Token.merkleClaimEnabled) {
        await MerkleDistributorModuleERC721.claim(
          account,
          erc721Token.address,
          accountIndex,
          treeIndex,
          merkleProof,
          onTxConfirm,
          onTxReceipt,
          onTxFail,
          setTransactionHash
        );
      } else if (erc721Token.publicSingleClaimEnabled) {
        await PublicOnePerAddressModule.mint(
          account,
          erc721Token.address,
          onTxConfirm,
          onTxReceipt,
          onTxFail,
          setTransactionHash
        );
      } else if (erc721Token.publicUtilityClaimEnabled) {
        await PublicMintWithFeeModule.mint(
          account,
          erc721Token.address,
          claimNativeValue,
          claimAmount,
          onTxConfirm,
          onTxReceipt,
          onTxFail,
          setTransactionHash
        );
      }

      setTransactionHash(transactionHash);
    } catch (error) {
      setSuccessfulClaim(false);
      setClaimFailed(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-syn8 rounded-2.5xl px-8 pt-10 pb-4 ">
      {successfulClaim ||
      erc721Claimed.claimed ||
      claimFailed ||
      fullyClaimed ? (
        <div className="text-center">
          <div className="flex justify-center items-center w-full mb-4">
            <img
              className="h-16 w-16"
              src={
                successfulClaim || erc721Claimed.claimed || fullyClaimed
                  ? '/images/syndicateStatusIcons/checkCircleGreen.svg'
                  : '/images/syndicateStatusIcons/transactionFailed.svg'
              }
              alt="checkmark"
            />
          </div>
          <div className="mb-4 text-2xl">
            {successfulClaim || erc721Claimed.claimed || fullyClaimed
              ? ` ${claimAmount > 1 ? claimAmount : ''} NFT${
                  claimAmount > 1 ? 's' : ''
                } claimed`
              : claimFailed
              ? 'Claim failed'
              : null}
          </div>
          {successfulClaim && (
            <div className="text-base text-gray-lightManatee text-center mb-6">
              You just minted an NFT of {erc721Token.name}. It’s in your wallet.
            </div>
          )}

          <button
            className={`flex items-center justify-center w-full rounded-lg text-base text-black px-8 py-4 mb-6 text-black font-medium ${
              !openseaLink && !claimFailed
                ? 'bg-gray-syn7 text-white cursor-default'
                : 'bg-white'
            }`}
            onClick={
              claimFailed ? tryAgain : openseaLink ? viewCollection : null
            }
            disabled={
              status == Status.DISCONNECTED ||
              !claimAvailable ||
              (!openseaLink && !claimFailed)
            }
          >
            {successfulClaim || erc721Claimed.claimed || fullyClaimed ? (
              <span className="flex items-center">
                View collection on Opensea
                <img
                  className="h-4 w-4 ml-2 text-white"
                  src="/images/nftClaim/opensea-black.svg"
                  alt="checkmark"
                />
              </span>
            ) : (
              'Try Again'
            )}
          </button>
          {transactionHash && (
            <div className="pb-8 text-base flex justify-center items-center hover:opacity-80">
              <BlockExplorerLink
                resourceId={transactionHash}
                resource="transaction"
                suffix=" transaction"
              />
            </div>
          )}
        </div>
      ) : submitting ? (
        <div className="h-fit-content rounded-2-half text-center">
          <div className="pb-8">
            <Spinner width="w-16" height="h-16" margin="m-0" />
          </div>
          <div className="pb-6 text-2xl">{`Claiming ${
            claimAmount > 1 ? claimAmount : ''
          } NFT${claimAmount > 1 ? 's' : ''}`}</div>
          {transactionHash && (
            <div className="pb-8 text-base flex justify-center items-center hover:opacity-80">
              <BlockExplorerLink
                resourceId={transactionHash}
                resource="transaction"
                suffix="transaction"
              />
            </div>
          )}
        </div>
      ) : (
        <div>
          {claimStarted && !claimEnded ? (
            <div>
              {erc721Token.publicUtilityClaimEnabled &&
              status !== Status.DISCONNECTED ? (
                <div>
                  {erc721Token.maxPerAddress > 1 ? (
                    <div className="text-lg text-center mb-6">
                      <div className="h3 mb-4">Choose amount to mint:</div>
                      <div className="flex justify-center space-x-6 items-center h-14 select-none">
                        <button
                          className={`h-full flex items-center w-full justify-end cursor-pointer`}
                          onClick={() => {
                            updateClaimAmount(false);
                          }}
                        >
                          <MinusCircleIcon
                            className={`h-4 w-4  ${
                              claimAmount > 1
                                ? 'text-gray-syn4'
                                : 'text-gray-syn6'
                            }`}
                          ></MinusCircleIcon>
                        </button>
                        <div
                          className={`h1 ${claimError ? 'text-red-error' : ''}`}
                        >
                          {claimAmount}
                        </div>
                        <button
                          className={`h-full flex items-center w-full cursor-pointer`}
                          onClick={() => {
                            updateClaimAmount(true);
                          }}
                        >
                          <PlusCircleIcon
                            className={`h-4 w-4 text-gray-syn4 h`}
                          ></PlusCircleIcon>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-lg text-center mb-8">
                      Your wallet is eligible to claim this NFT
                    </div>
                  )}

                  <button
                    className={`w-full rounded-lg text-base text-black px-8 py-4 mb-4 font-medium ${
                      claimError
                        ? 'bg-gray-syn6 text-gray-syn4 cursor-default'
                        : 'bg-green'
                    }`}
                    onClick={claimError ? null : claimNFT}
                    disabled={claimError ? true : false}
                  >
                    {!claimError
                      ? `Claim ${claimAmount} NFT${claimAmount > 1 ? 's' : ''}`
                      : claimError}
                  </button>
                </div>
              ) : (
                <div>
                  <div className="text-lg text-center mb-8">
                    {status == Status.DISCONNECTED
                      ? 'Connect your wallet to claim this NFT'
                      : !claimAvailable
                      ? `Your connected wallet (${formatAddress(
                          account,
                          6,
                          4
                        )}) isn’t eligible to claim this NFT`
                      : 'Your wallet is eligible to claim this NFT'}
                  </div>
                  <button
                    className={`w-full rounded-lg text-base text-black px-8 py-4 mb-4 font-medium ${
                      status == Status.DISCONNECTED
                        ? 'bg-white'
                        : !claimAvailable
                        ? 'bg-gray-syn7 text-white cursor-default'
                        : 'bg-green'
                    }`}
                    onClick={
                      status == Status.DISCONNECTED
                        ? connectWallet
                        : !claimAvailable
                        ? null
                        : claimNFT
                    }
                    disabled={!claimAvailable}
                  >
                    {status == Status.DISCONNECTED
                      ? 'Connect wallet'
                      : !claimAvailable
                      ? 'Connect a different wallet'
                      : 'Claim'}
                  </button>
                </div>
              )}
              {status != Status.DISCONNECTED
                ? // <div className="text-sm text-gray-shuttle text-center">
                  //   Having trouble claiming your NFT? Join the Poolsuite Discord to
                  //   get some help.
                  // </div>
                  null
                : null}
            </div>
          ) : !claimStarted ? (
            <div>
              {erc721AirdropInfo.startTime ? (
                <div className="text-lg text-center mb-6">
                  Claim starts{' '}
                  {moment(erc721AirdropInfo.startTime * 1000).fromNow()}
                </div>
              ) : startTime ? (
                <div className="text-lg text-center mb-6">
                  Claim starts {timeLeft}
                </div>
              ) : null}
            </div>
          ) : claimEnded ? (
            <div>
              <div className="text-lg text-center mb-8">
                {`Claim ended ${
                  moment(erc721AirdropInfo.endTime * 1000).fromNow() !=
                  'Invalid date'
                    ? moment(erc721AirdropInfo.endTime * 1000).fromNow()
                    : ''
                }`}
              </div>
              <button
                className={`flex items-center justify-center w-full rounded-lg text-base text-black px-8 py-4 mb-6 text-black font-medium ${
                  !openseaLink
                    ? 'bg-gray-syn7 text-white cursor-default'
                    : 'bg-white'
                }`}
                onClick={openseaLink ? viewCollection : null}
                disabled={!openseaLink}
              >
                <span className="flex items-center">
                  View collection on Opensea
                  <img
                    className="h-4 w-4 ml-2 text-white"
                    src="/images/nftClaim/opensea-black.svg"
                    alt="checkmark"
                  />
                </span>
              </button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default ClaimCard;
