import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AppState } from "@/state";
import { Status } from "@/state/wallet/types";
import NFTCard from "./nftCard";
import LoadingClaim from "./loadingState";
import useUtilityNFT from "@/hooks/useUtilityNFT";
import { useRouter } from "next/router";

const ClaimUtilityNFT: React.FC = () => {
  const {
    web3Reducer: {
      web3: { status },
    },
    utilityNFTSliceReducer: { utilityNFT },
  } = useSelector((state: AppState) => state);

  const router = useRouter();

  const { loading: utilityLoading } = useUtilityNFT();
  const [loading, setLoading] = useState<boolean>(true);
  const [invalidMembership, setInvalidMembership] = useState<boolean>(false);
  const [selectedNFTCards, setSelectedNFTCards] = useState<Array<number>>([])

  const { nftAddress } = router.query;

  const handleSelected = (childData) => {
    if (!(selectedNFTCards.includes(childData))) {
      setSelectedNFTCards(oldArray => [...oldArray, childData])
    } else {
      setSelectedNFTCards(selectedNFTCards.filter(item => item !== childData))
    }
    
  }

  useEffect(() => {
    if (
      router.isReady &&
      nftAddress &&
      !utilityLoading &&
      utilityNFT.membershipToken
    ) {
      setLoading(false);
      if (nftAddress === utilityNFT.membershipToken) {
        setInvalidMembership(false);
      } else {
        setInvalidMembership(true);
      }
    }
  }, [nftAddress, router.isReady, utilityLoading, utilityNFT.membershipToken]);

  return (
    <div className="w-full flex flex-col justify-center items-center sm:px-8 md:px-25.5">
      {utilityLoading ||
      invalidMembership ||
      loading ||
      status === Status.DISCONNECTED ? (
        <LoadingClaim></LoadingClaim>
      ) : (
        <div className=" w-full flex flex-col justify-center items-center">
          <div className="text-center w-full mb-14">
            <div className="h4 leading-4 mb-4 text-sm uppercase">
              claim RugRadio Genesis nft
            </div>
            <div className="text-4.5xl h1 leading-11.5">
              You’re eligible to claim {utilityNFT.totalClaims} NFT
              {utilityNFT.totalClaims > 1 && "s"}
            </div>
            <div className="h3 text-gray-syn4 mt-4">
              Claim your NFTs to reveal them.
            </div>
          </div>
          <div className="w-full">
            <div className="w-full flex justify-center mb-10">
              <div></div>
              <div className="flex items-center">
                <div className="flex space-x-8 mr-8">
                  <div>{selectedNFTCards.length} of {utilityNFT.totalClaims} selected:</div>
                </div>
                <button 
                  className="rounded-lg px-8 py-4 text-white font-medium bg-red-700 mr-8 opacity-95 hover:opacity-100"
                  onClick={() => {setSelectedNFTCards([])}}
                >
                    Unselect all
                </button>
                <button
                  className="rounded-lg text-base text-black px-8 py-4 font-medium bg-white opacity-95 hover:opacity-100"
                  /* onClick={() => {}} */
                >
                  Claim selected ({selectedNFTCards.length})
                </button>
                <span className="mx-8 border-1 border-gray-syn6 h-8"></span>
                <button
                  className="rounded-lg text-base text-black px-8 py-4 font-medium bg-green opacity-95 hover:opacity-100"
                  /* onClick={() => {}} */
                >
                  {"Claim all"}
                </button>
              </div>
            </div>
            <div className="flex gap-5 justify-center flex-wrap">
              {utilityNFT.membershipPasses.map((membershipPass, i) => {
                return (
                  <div key={i}>
                    <NFTCard
                      {...{
                        collectible: membershipPass,
                      }}
                      collectibleSelected={selectedNFTCards}
                      selectedCollectibleId={handleSelected}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClaimUtilityNFT;
