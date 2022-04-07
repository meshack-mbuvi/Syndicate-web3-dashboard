import { CtaButton } from "@/components/CTAButton";
import Layout from "@/components/layout";
import Modal, { ModalStyle } from "@/components/modal";
import { Spinner } from "@/components/shared/spinner";
import useOwnsGenesisNFT from "@/hooks/useOwnsGenesisNFT";
import { AppState } from "@/state";
import { showWalletModal } from "@/state/wallet/actions";
import { Status } from "@/state/wallet/types";
import { getCountDownDays } from "@/utils/dateUtils";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NFTChecker } from "../shared/NFTchecker";
import { NFTDetails } from "./NFTDetails";
import arrowRight from "/public/images/arrowRight-blue.svg";
import emptyCheck from "/public/images/empty-check.svg";
import checkMark from "/public/images/rugRadio/circleWithGreenCheckMark.svg";

export const ClaimComponent: React.FC = () => {
  const {
    web3Reducer: {
      web3: {
        status,
        account,
        ethereumNetwork: { invalidEthereumNetwork },
      },
    },
  } = useSelector((state: AppState) => state);

  const dispatch = useDispatch();

  const [showNFTchecker, setShowNFTchecker] = useState(false);
  const [showClaimComponent, setShowClaimComponent] = useState(false);

  const { loading, hasGenesisNFT, claimEnabled, claimStartTime, hasRugTokens } =
    useOwnsGenesisNFT();

  useEffect(() => {
    setShowClaimComponent(false);

    if (!account) {
      setShowClaimComponent(false);
      return;
    }

    const showClaim = localStorage.getItem("showClaim");

    if (!showClaim) {
      localStorage.setItem(
        "showClaim",
        JSON.stringify({ account, showClaimScreen: false }),
      );
    } else {
      const { account: wallet, showClaimScreen } = JSON.parse(showClaim);

      if (wallet === account && showClaimScreen) {
        setShowClaimComponent(true);
      } else {
        setShowClaimComponent(false);
      }
    }

    return () => {
      setShowClaimComponent(false);
    };
  }, [account]);

  // Initiate wallet connection process.
  const handleConnectWallet = (e) => {
    e.preventDefault();
    dispatch(showWalletModal());
  };

  const handleContinue = () => {
    setShowClaimComponent(true);

    localStorage.setItem(
      "showClaim",
      JSON.stringify({ account, showClaimScreen: true }),
    );
  };

  const handleClose = () => {
    setShowNFTchecker(false);
  };

  return (
    <Layout>
      <div className="w-full">
        <div className="container mx-auto">
          {showClaimComponent && (hasGenesisNFT || hasRugTokens) ? (
            <NFTDetails />
          ) : (
            <div className="w-full">
              <div className="container mx-auto space-y-14">
                <div className="w-100 max-w-480 space-y-20 mx-auto">
                  <div className="space-y-4">
                    <p className="h4 text-center">claim tokens</p>
                    <p className="h1 text-center">Rug Token Claim Dash</p>
                    {claimEnabled == false &&
                      status == Status.CONNECTED &&
                      !invalidEthereumNetwork &&
                      !loading && (
                        <p className="h3 text-center text-gray-syn4 font-whyte">
                          Starts in{" "}
                          {getCountDownDays(`${claimStartTime * 1000}`)}
                        </p>
                      )}
                  </div>
                  <div className="rounded-2.5xl">
                    <div className="px-8 py-6 bg-gray-syn8 border-b border-gray-syn7 rounded-t-2.5xl">
                      <div className="space-y-6">
                        <span className="h4">Requirements</span>
                        <div className="flex space-x-4">
                          <Image
                            src={
                              status === Status.DISCONNECTED || !hasGenesisNFT
                                ? emptyCheck
                                : checkMark
                            }
                            alt=""
                            height={32}
                            width={32}
                          />
                          <span className="flex items-center">
                            Own a RugRadio Genesis NFT or $RUG tokens
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="p-8 pb-3.5 bg-gray-syn8 rounded-b-2.5xl">
                      <div className="space-y-6 w-full">
                        {status === Status.DISCONNECTED ? (
                          <CtaButton onClick={handleConnectWallet}>
                            Connect wallet
                          </CtaButton>
                        ) : loading ? (
                          <Spinner height="h-6" width="w-6" />
                        ) : (
                          <CtaButton
                            onClick={handleContinue}
                            greenCta={hasGenesisNFT && claimEnabled}
                            disabled={!hasGenesisNFT && claimEnabled}
                          >
                            {hasGenesisNFT || hasRugTokens
                              ? claimEnabled
                                ? "Continue"
                                : "Claiming available soon"
                              : "Requirements not met"}
                          </CtaButton>
                        )}

                        <p className="small-body text-center text-gray-syn5">
                          Having trouble claiming your tokens? Join the
                          <a
                            className="border-gray-syn5 text-sm border-b mx-1"
                            href="https://discord.gg/ytrJGBwsb5"
                            target="_blank"
                            rel="noreferrer"
                          >
                            RugRadio Discord
                          </a>
                          to get some help.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex mx-auto">
                  <button
                    className="flex mx-auto text-blue"
                    onClick={() => setShowNFTchecker(true)}
                  >
                    <span className="mr-2">
                      Check how much RUG is available to claim for any Genesis
                      NFT{" "}
                    </span>
                    <span className="flex h-full">
                      <Image src={arrowRight} width={16} height={16} />
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal
        {...{
          show: showNFTchecker,
          modalStyle: ModalStyle.DARK,
          showCloseButton: false,
          customWidth: "w-full max-w-480",
          outsideOnClick: true,
          showHeader: false,
          closeModal: () => handleClose(),
          overflowYScroll: false,
          customClassName: "p-8 pt-6",
          overflow: "overflow-visible",
        }}
      >
        <NFTChecker />
      </Modal>
    </Layout>
  );
};
