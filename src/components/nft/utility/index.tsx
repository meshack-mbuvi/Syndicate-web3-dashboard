import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { AppState } from '@/state';
import AvailabilityCard from './availabilityCard';
import VerifyMintPassModal from './verifyMintPassModal';
import useUtilityNFT from '@/hooks/useUtilityNFT';
import { SkeletonLoader } from '@/components/skeletonLoader';
import { useRouter } from 'next/router';

const UtilityNFT: React.FC = () => {
  const {
    utilityNFTSliceReducer: { utilityNFT },
    web3Reducer: {
      web3: { activeNetwork }
    }
  } = useSelector((state: AppState) => state);

  const { loading: utilityLoading } = useUtilityNFT();

  const router = useRouter();
  const [showVerifyMintPassModal, setShowVerifyMintPassModal] =
    useState<boolean>(false);
  const [invalidMembership, setInvalidMembership] = useState<boolean>(false);

  const { nftAddress } = router.query;

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

  return (
    <div className="w-full flex flex-col justify-center items-center  sm:px-8 md:px-25.5">
      <div className="text-center w-full mb-14">
        <div className="h4 leading-4 mb-4 text-sm uppercase">claim nft</div>
        <div className="text-4.5xl h1 leading-11.5">RugRadio Genesis</div>
      </div>
      <div className="md:max-w-480 md:mb-0 sm:mb-8 md:w-100 sm:w-full mt-6">
        <div className="mb-10 flex justify-between">
          <div className="w-1/2">
            <div className="text-gray-lightManatee text-base leading-6 mb-2">
              Available to mint
            </div>
            <div className="text-gray-lightManatee text-2xl">
              <span className="text-white">1 per mint pass</span>
            </div>
          </div>
          <div className="w-1/2">
            <div className="text-gray-lightManatee text-base leading-6 mb-2">
              Mint price
            </div>
            {utilityLoading ? (
              <div>
                <SkeletonLoader width="full" height="9" margin="mb-3" />
              </div>
            ) : (
              <div className=" text-2xl flex space-x-4">
                <div className="text-white">
                  {utilityNFT.price} {activeNetwork.nativeCurrency.symbol}
                </div>
                <div className="text-gray-lightManatee">
                  ${utilityNFT.priceUSD}
                </div>
              </div>
            )}
          </div>
        </div>
        {utilityLoading ? (
          <div className="mb-8">
            <SkeletonLoader width="" height="88" margin="mb-3" />
          </div>
        ) : !invalidMembership ? (
          <AvailabilityCard></AvailabilityCard>
        ) : null}
        <div className="flex justify-center">
          <button
            className="text-white text-center underline cursor-pointer"
            onClick={() => setShowVerifyMintPassModal(true)}
          >
            Verify if any Rug Radio mint pass has been claimed
          </button>
        </div>
      </div>
      <VerifyMintPassModal
        showModal={showVerifyMintPassModal}
        closeModal={() => {
          setShowVerifyMintPassModal(false);
        }}
      ></VerifyMintPassModal>
    </div>
  );
};

export default UtilityNFT;
