import React, { useEffect, useState } from "react";
import { Spinner } from "@/components/shared/spinner";
import { EtherscanLink } from "@/components/syndicates/shared/EtherscanLink";
import { useSelector, useDispatch } from "react-redux";
import { AppState } from "@/state";
import { clearERC721Claimed } from "@/state/claimedERC721/slice";
import { Status } from "@/state/wallet/types";
import { formatAddress } from "@/utils/formatAddress";

const ClaimCard: React.FC<{
  handleMintUpdate?: () => void;
  openseaLink: string;
}> = ({ handleMintUpdate, openseaLink }) => {
  const dispatch = useDispatch();

  const {
    initializeContractsReducer: { syndicateContracts },
    erc721MerkleProofSliceReducer: { erc721MerkleProof },
    claimedERC721SliceReducer: { erc721Claimed },
    web3Reducer: {
      web3: { account, status },
    },
    erc721TokenSliceReducer: { erc721Token },
  } = useSelector((state: AppState) => state);

  const [claimAvailable, setClaimAvailable] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string>();
  const [claimFailed, setClaimFailed] = useState(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [successfulClaim, setSuccessfulClaim] = useState<boolean>(false);

  useEffect(() => {
    if (status == Status.DISCONNECTED) {
      dispatch(clearERC721Claimed());
    }
  }, [status]);

  const tryAgain = () => {
    setClaimFailed(false);
  };

  const viewCollection = () => {
    window.open(openseaLink, "_blank");
  };

  useEffect(() => {
    if (erc721MerkleProof?.account) {
      setClaimAvailable(true);
    } else {
      setClaimAvailable(false);
    }
  }, [erc721MerkleProof?.account]);

  const onTxConfirm = () => {
    setSubmitting(true);
  };

  const onTxReceipt = async () => {
    setSubmitting(false);
    setSuccessfulClaim(true);
    if (handleMintUpdate) {
      handleMintUpdate();
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
      const { MerkleDistributorModuleERC721 } = syndicateContracts;
      console.log(
        account,
        erc721Token.address,
        accountIndex,
        treeIndex,
        merkleProof,
      );
      await MerkleDistributorModuleERC721.claim(
        account,
        erc721Token.address,
        accountIndex,
        treeIndex,
        merkleProof,
        onTxConfirm,
        onTxReceipt,
        onTxFail,
        setTransactionHash,
      );
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
      {successfulClaim || erc721Claimed.claimed || claimFailed ? (
        <div className="text-center">
          <div className="flex justify-center items-center w-full mb-4">
            <img
              className="h-16 w-16"
              src={
                successfulClaim || erc721Claimed.claimed
                  ? "/images/syndicateStatusIcons/checkCircleGreen.svg"
                  : "/images/syndicateStatusIcons/transactionFailed.svg"
              }
              alt="checkmark"
            />
          </div>
          <div className="mb-4 text-2xl">
            {successfulClaim || erc721Claimed.claimed
              ? "NFT claimed"
              : claimFailed
              ? "Claim failed"
              : null}
          </div>
          {successfulClaim && (
            <div className="text-base text-gray-lightManatee text-center mb-6">
              You just minted an NFT of {erc721Token.name}. It’s in your wallet.
            </div>
          )}

          <button
            className={`flex items-center justify-center w-full rounded-lg text-base text-black px-8 py-4 mb-6 text-black font-medium ${
              !openseaLink
                ? "bg-gray-syn7 text-white cursor-default"
                : "bg-white"
            }`}
            onClick={
              claimFailed ? tryAgain : openseaLink ? viewCollection : null
            }
            disabled={
              status == Status.DISCONNECTED || !claimAvailable || !openseaLink
            }
          >
            {successfulClaim || erc721Claimed.claimed ? (
              <span className="flex items-center">
                View collection on Opensea
                <img
                  className="h-4 w-4 ml-2 text-white"
                  src="/images/nftClaim/opensea-black.svg"
                  alt="checkmark"
                />
              </span>
            ) : (
              "Try Again"
            )}
          </button>
          {transactionHash && (
            <div className="pb-8 text-base flex justify-center items-center hover:opacity-80">
              <EtherscanLink
                etherscanInfo={transactionHash}
                type="transaction"
                text="Etherscan transaction"
              />
            </div>
          )}
        </div>
      ) : submitting ? (
        <div className="h-fit-content rounded-2-half text-center">
          <div className="pb-8">
            <Spinner width="w-16" height="h-16" margin="m-0" />
          </div>
          <div className="pb-6 text-2xl">Claiming NFT</div>
          {transactionHash && (
            <div className="pb-8 text-base flex justify-center items-center hover:opacity-80">
              <EtherscanLink
                etherscanInfo={transactionHash}
                type="transaction"
                text="Etherscan transaction"
              />
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="text-lg text-center mb-8">
            {status == Status.DISCONNECTED
              ? "Connect your wallet to claim this NFT"
              : !claimAvailable
              ? `Your connected wallet (${formatAddress(
                  account,
                  6,
                  4,
                )}) isn’t eligible to claim this NFT`
              : "Your wallet is eligible to claim this NFT"}
          </div>
          <button
            className={`w-full rounded-lg text-base text-black px-8 py-4 mb-4 font-medium ${
              status == Status.DISCONNECTED || !claimAvailable
                ? "bg-gray-syn7 text-white cursor-default"
                : "bg-green"
            }`}
            onClick={
              status == Status.DISCONNECTED || !claimAvailable ? null : claimNFT
            }
            disabled={status == Status.DISCONNECTED || !claimAvailable}
          >
            {status == Status.DISCONNECTED
              ? "Connect wallet"
              : !claimAvailable
              ? "Connect a different wallet"
              : "Claim"}
          </button>
          {status != Status.DISCONNECTED
            ? // <div className="text-sm text-gray-shuttle text-center">
              //   Having trouble claiming your NFT? Join the Poolsuite Discord to
              //   get some help.
              // </div>
              null
            : null}
        </div>
      )}
    </div>
  );
};

export default ClaimCard;
