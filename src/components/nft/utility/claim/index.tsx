import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { AppState } from '@/state';
import { Status } from '@/state/wallet/types';
import NFTCard from './nftCard';
import LoadingClaim from './loadingState';
import useUtilityNFT from '@/hooks/useUtilityNFT';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { EyeIcon, EyeOffIcon } from '@heroicons/react/solid';
import { BigNumber } from 'bignumber.js';
import ProcessingClaimModal from './processingClaimModal';

const ClaimUtilityNFT: React.FC = () => {
  const {
    web3Reducer: {
      web3: { status, account }
    },
    utilityNFTSliceReducer: { utilityNFT },

    initializeContractsReducer: { syndicateContracts }
  } = useSelector((state: AppState) => state);

  const router = useRouter();

  const { loading: utilityLoading } = useUtilityNFT();
  const [invalidMembership, setInvalidMembership] = useState<boolean>(false);
  const [hideClaimed, setHideClaimed] = useState<boolean>(false);
  const [selectedNFTCards, setSelectedNFTCards] = useState<Array<number>>([]);
  const [unclaimedNFTs, setUnclaimedNFTs] = useState<Array<number>>([]);

  const [transactionHash, setTransactionHash] = useState<string>();
  const [claimFailed, setClaimFailed] = useState(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [successfulClaim, setSuccessfulClaim] = useState<boolean>(false);
  const [showProcessingClaimModal, setShowProcessingClaimModal] =
    useState<boolean>(false);
  const [claimList, setClaimList] = useState<Array<number>>([]);

  const { nftAddress } = router.query;

  const handleSelected = async (childData) => {
    if (!selectedNFTCards.includes(childData)) {
      setSelectedNFTCards((oldArray) => [...oldArray, childData]);
    } else {
      setSelectedNFTCards(
        selectedNFTCards.filter((item) => item !== childData)
      );
    }
  };

  const handleClaimed = async (tokenID) => {
    setUnclaimedNFTs(unclaimedNFTs.filter((item) => item !== Number(tokenID)));
  };

  useEffect(() => {
    setUnclaimedNFTs([]);

    if (utilityNFT.membershipPasses.length) {
      utilityNFT.membershipPasses.map((membershipPass) => {
        if (!membershipPass.claimed) {
          setUnclaimedNFTs((items) => [
            ...items,
            Number(membershipPass.token_id)
          ]);
        }
      });
    }
  }, [utilityNFT.membershipPasses]);

  useEffect(() => {
    if (
      router.isReady &&
      nftAddress &&
      !utilityLoading &&
      utilityNFT.membershipToken
    ) {
      if (nftAddress === utilityNFT.membershipToken) {
        setInvalidMembership(false);
      } else {
        setInvalidMembership(true);
      }
    }
  }, [nftAddress, router.isReady, utilityLoading, utilityNFT.membershipToken]);

  const { RugUtilityMintModule } = syndicateContracts;

  const onTxConfirm = () => {
    setSubmitting(true);
  };

  const onTxReceipt = async (receipt, tokenIDs) => {
    setUnclaimedNFTs(unclaimedNFTs.filter((item) => !tokenIDs.includes(item)));
    setSelectedNFTCards(
      selectedNFTCards.filter((item) => !tokenIDs.includes(item))
    );

    setClaimList([]);
    setSubmitting(false);
    setSuccessfulClaim(true);
  };

  const onTxFail = () => {
    setClaimList([]);
    setSubmitting(false);
    setSuccessfulClaim(false);
    setClaimFailed(true);
  };

  const claimNFTs = async (NFTsToClaim) => {
    setClaimList(NFTsToClaim);
    setSubmitting(true);
    setShowProcessingClaimModal(true);
    try {
      await RugUtilityMintModule.redeemMany(
        account,
        NFTsToClaim,
        String(new BigNumber(utilityNFT.ethPrice).times(NFTsToClaim.length)),
        onTxConfirm,
        onTxReceipt,
        onTxFail,
        setTransactionHash
      );
      setTransactionHash(transactionHash);
    } catch (error) {
      setSuccessfulClaim(false);
      setClaimFailed(true);
      setClaimList([]);
    } finally {
      setSubmitting(false);
    }
  };

  const goToUtility = () => {
    router.push(`/${nftAddress}/utility`);
  };

  return (
    <div className="w-full flex flex-col justify-center items-center sm:px-8 md:px-25.5">
      {utilityLoading || invalidMembership || status === Status.DISCONNECTED ? (
        <LoadingClaim></LoadingClaim>
      ) : (
        <div className=" w-full flex flex-col justify-center items-center">
          <div className="text-center w-full mb-14">
            <div className="h4 leading-4 mb-4 text-sm uppercase">
              claim RugRadio Genesis nft
            </div>
            <div className="text-4.5xl h1 leading-11.5">
              You’re eligible to claim {unclaimedNFTs.length} NFT
              {unclaimedNFTs.length > 1 && 's'}
            </div>
            <div className="h3 text-gray-syn4 mt-4">
              Claim your NFTs in the early access member mint
            </div>
          </div>
          <div className="w-full">
            {unclaimedNFTs.length && !hideClaimed ? (
              <div className="w-full flex items-center flex-wrap justify-between mb-10">
                <div className="">
                  <button
                    onClick={() => {
                      setHideClaimed(!hideClaimed);
                    }}
                  >
                    {hideClaimed ? (
                      <div className="flex space-x-2 items-center">
                        <EyeIcon className="w-4 h-4"></EyeIcon>{' '}
                        <span>UnHide Claimed NFT</span>
                      </div>
                    ) : (
                      <div className="flex space-x-2 flex space-x-2 items-center">
                        <EyeOffIcon className="w-4 h-4"></EyeOffIcon>{' '}
                        <span>Hide Claimed NFTs</span>
                      </div>
                    )}
                  </button>
                </div>
                <div className="flex items-center flex-wrap ">
                  {selectedNFTCards.length ? (
                    <div className="flex items-center">
                      <div className="flex space-x-8 mr-8">
                        <div>
                          {selectedNFTCards.length} of {utilityNFT.totalClaims}{' '}
                          selected:
                        </div>
                      </div>
                      <div
                        className="flex justify-start cursor-pointer mr-8"
                        onClick={() => {
                          setSelectedNFTCards([]);
                        }}
                        aria-hidden={true}
                      >
                        <Image
                          src="/images/actionIcons/unselectAllCheckboxes.svg"
                          height={16}
                          width={16}
                        />
                        <span className="ml-2">Unselect all</span>
                      </div>

                      <button
                        className="rounded-lg text-base text-black px-8 py-4 font-medium bg-white opacity-95 hover:opacity-100"
                        onClick={() => {
                          claimNFTs(selectedNFTCards);
                        }}
                      >
                        Claim selected ({selectedNFTCards.length})
                      </button>

                      <span className="mx-8 border-1 border-gray-syn6 h-8"></span>
                    </div>
                  ) : null}
                  <button
                    className="rounded-lg text-base text-black px-8 py-4 font-medium bg-green opacity-95 hover:opacity-100"
                    onClick={() => {
                      claimNFTs(unclaimedNFTs);
                    }}
                  >
                    Claim all
                  </button>
                </div>
              </div>
            ) : !utilityNFT.membershipPasses?.length ? (
              <div className="flex justify-center">
                <button
                  className="rounded-lg text-base text-black px-8 py-4 font-medium bg-white opacity-95 hover:opacity-100"
                  onClick={goToUtility}
                >
                  Back
                </button>
              </div>
            ) : null}
            <div className="flex gap-5 justify-center flex-wrap">
              {utilityNFT.membershipPasses.map((membershipPass, i) => {
                return hideClaimed ? (
                  unclaimedNFTs.includes(Number(membershipPass.token_id)) ? (
                    <div key={i}>
                      <NFTCard
                        {...{
                          collectible: membershipPass
                        }}
                        collectibleSelected={selectedNFTCards.includes(
                          Number(membershipPass.token_id)
                        )}
                        handeleSelectedCollectibleId={handleSelected}
                        handleClaimedCollectible={handleClaimed}
                        claiming={claimList.includes(
                          Number(membershipPass.token_id)
                        )}
                        claimed={
                          membershipPass.claimed ||
                          !unclaimedNFTs.includes(
                            Number(membershipPass.token_id)
                          )
                        }
                      />
                    </div>
                  ) : null
                ) : (
                  <div key={i}>
                    <NFTCard
                      {...{
                        collectible: membershipPass
                      }}
                      collectibleSelected={selectedNFTCards.includes(
                        Number(membershipPass.token_id)
                      )}
                      handeleSelectedCollectibleId={handleSelected}
                      handleClaimedCollectible={handleClaimed}
                      claiming={claimList.includes(
                        Number(membershipPass.token_id)
                      )}
                      claimed={
                        membershipPass.claimed ||
                        !unclaimedNFTs.includes(Number(membershipPass.token_id))
                      }
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      <ProcessingClaimModal
        showModal={showProcessingClaimModal}
        closeModal={() => {
          setShowProcessingClaimModal(false);
        }}
        successfulClaim={successfulClaim}
        transactionHash={transactionHash}
        claimFailed={claimFailed}
        submitting={submitting}
        claimMany={claimList.length}
      ></ProcessingClaimModal>
    </div>
  );
};

export default ClaimUtilityNFT;
