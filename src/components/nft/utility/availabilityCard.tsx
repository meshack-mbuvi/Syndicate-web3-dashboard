import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { showWalletModal } from "@/state/wallet/actions";
import { AppState } from "@/state";
import { Status } from "@/state/wallet/types";
import { CheckIcon } from "@heroicons/react/solid";

const AvailabilityCard: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const {
    web3Reducer: { web3 },
    utilityNFTSliceReducer: { utilityNFT },
  } = useSelector((state: AppState) => state);

  const [unclaimedNFTs, setUnclaimedNFTs] = useState<number>(0);

  const { status } = web3;
  const { nftAddress } = router.query;

  /**
   * open variable is used to determine whether to show or hide
   *  the wallet connection modal.
   */
  const connectWallet = () => {
    dispatch(showWalletModal());
  };

  const goToClaim = () => {
    router.push(`/${nftAddress}/utility/claim`);
  };

  useEffect(() => {
    if (utilityNFT.membershipPasses.length) {
      utilityNFT.membershipPasses.map((membershipPass) => {
        if (!membershipPass.claimed) {
          setUnclaimedNFTs((item) => item + 1);
        }
      });
    }
  }, [utilityNFT.membershipPasses]);

  return (
    <div className="mb-8">
      <div className="bg-gray-syn8 rounded-2.5xl pt-6 pb-4 relative">
        <div className="px-8 mb-6 ">
          <div className="h4 leading-4 mb-4 text-sm uppercase mb-6">
            requirements
          </div>
          <div className="text-base align-middle leading-8 flex">
            {status === Status.CONNECTED && utilityNFT.claimAvailable ? (
              <span className="rounded-2xl bg-green-phthalo-green w-8 h-8  mr-4 flex items-center justify-center">
                <CheckIcon className="w-6 h-6 text-green" />
              </span>
            ) : (
              <span className="rounded-full border-1 border-gray-syn6 w-8 h-8 inline-block mr-4"></span>
            )}
            <div>Own an unused Rug Radio mint pass</div>
          </div>
        </div>
        <div className="border-b-1 border-gray-24 w-full mb-8"></div>
        <div className="px-8">
          {status !== Status.CONNECTED ? (
            <button
              className="w-full rounded-lg text-base text-black px-8 py-4 mb-4 font-medium bg-white"
              onClick={connectWallet}
            >
              {"Connect wallet"}
            </button>
          ) : utilityNFT.claimAvailable ? (
            <div>
              <div className="mb-8 text-center h3">
                You’re eligible to claim {unclaimedNFTs} NFT
                {unclaimedNFTs > 1 && "s"}
              </div>
              <button
                className="w-full rounded-lg text-base text-black px-8 py-4 mb-4 font-medium bg-green"
                onClick={goToClaim}
              >
                {"Continue"}
              </button>
            </div>
          ) : (
            <div className="h3 text-center mb-2 mt-2">
              You don’t meet the requirements to claim this NFT.
              {utilityNFT.membershipPasses?.length ? (
                <button
                  className=" w-full text-base mt-4 text-gray-syn3 underline"
                  onClick={goToClaim}
                >
                  {" "}
                  View Claimed{" "}
                </button>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AvailabilityCard;
