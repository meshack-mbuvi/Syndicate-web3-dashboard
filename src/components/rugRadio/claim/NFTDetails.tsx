import { CtaButton } from "@/components/CTAButton";
import Modal, { ModalStyle } from "@/components/modal";
import NumberTreatment from "@/components/NumberTreatment";
import { Spinner } from "@/components/shared/spinner";
import { SkeletonLoader } from "@/components/skeletonLoader";
import { EtherscanLink } from "@/components/syndicates/shared/EtherscanLink";
import useRugRadioTokenCount from "@/hooks/useRugRadioTokens";
import { AppState } from "@/state";
import { fetchCollectiblesTransactions } from "@/state/assets/slice";
import { getCountDownDays } from "@/utils/dateUtils";
import { numberWithCommas } from "@/utils/formattedNumbers";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import Tooltip from "react-tooltip-lite";
import { BonusTokenClaim } from "../shared/bonusToken";
import { NFTChecker } from "../shared/NFTchecker";
import NFTComponent from "../shared/nftComponent";
import { TabComponent } from "../shared/tabComponent";
import RugRadioTokenWhiteIcon from "/public/images/rugRadio/rugradioToken-white.svg";

export const NFTDetails: React.FC = () => {
  const {
    web3Reducer: {
      web3: { account },
    },
    initializeContractsReducer: {
      syndicateContracts: { RugClaimModule, rugBonusClaimModule },
    },
    assetsSliceReducer: { collectiblesResult, allCollectiblesFetched },
  } = useSelector((state: AppState) => state);

  const [showNFTchecker, setShowNFTchecker] = useState(false);

  // utility modal state functions
  const [confirm, setConfirm] = useState(false);
  const [transactionHash, setTransactionHash] = useState("");
  const [userRejectedTransaction] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [processed, setProcessed] = useState(true);
  const [processingFailed, setProcessingFailed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [transactionRejected, setTransactionRejected] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [collectibles, setCollectibles] = useState([]);
  const [pageOffSet, setPageOffSet] = useState<number>(20);
  const [claimBonus, setClaimBonus] = useState(false);

  // Get both claimed and unclaimed tokens for all Genesis NFTs
  const {
    totalYieldTokens,
    totalAvailableToClaim,
    totalGeneratedTokens,
    loading,
    nextClaimTime,
    totalBonusToClaim,
  } = useRugRadioTokenCount(collectibles, processed);

  const handleClose = () => {
    setShowNFTchecker(false);
  };

  const dispatch = useDispatch();

  const genesisNFTContractAddress = process.env.NEXT_PUBLIC_GenesisNFT;
  useEffect(() => {
    if (!account || !genesisNFTContractAddress) return;

    dispatch(
      fetchCollectiblesTransactions({
        account,
        offset: "0",
        contractAddress: genesisNFTContractAddress,
      }),
    );
  }, [account, genesisNFTContractAddress]);

  useEffect(() => {
    setCollectibles(collectiblesResult);

    return () => {
      setCollectibles([]);
    };
  }, [JSON.stringify(collectiblesResult)]);

  // Show processing transaction when user confirms transaction on wallet.
  const onTxConfirm = () => {
    setProcessing(true);
    setConfirm(false);
  };

  const onTxReceipt = () => {
    setProcessing(false);
    setConfirm(false);
    setProcessed(true);

    // refresh
    dispatch(
      fetchCollectiblesTransactions({
        account,
        offset: "0",
        contractAddress: genesisNFTContractAddress,
      }),
    );
  };

  const onTxFail = (error) => {
    const { code } = error;
    setClaimBonus(false);

    if (code == 4001) {
      setTransactionRejected(true);
    } else {
      setTransactionRejected(false);
    }

    setProcessing(false);
    setConfirm(false);
    setShowModal(false);
    setProcessed(false);
    setShowErrorModal(true);
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
    setShowModal(false);
    setClaimBonus(false);
  };

  /**
   * Function to claim all NFTs for a give wallet
   */
  const handleClaimAll = async (event) => {
    event.preventDefault();
    setClaimBonus(false);

    const tokenIds = collectibles.map((collectible) => collectible.id);

    if (!tokenIds.length) return;

    setConfirm(true);
    setShowModal(true);

    await RugClaimModule.bulkClaimTokens(
      tokenIds,
      account,
      onTxConfirm,
      onTxReceipt,
      onTxFail,
      setTransactionHash,
    );
  };

  const handleClaimBonus = async (event) => {
    // claim bonus
    setClaimBonus(true);
    event.preventDefault();

    const tokenIds = collectibles.map((collectible) => collectible.id);

    if (!tokenIds.length) return;

    setConfirm(true);
    setShowModal(true);

    await rugBonusClaimModule.bulkClaimTokens(
      tokenIds,
      account,
      onTxConfirm,
      onTxReceipt,
      onTxFail,
      setTransactionHash,
    );
  };

  /**
   * Function to close transaction modal
   */
  const handleCloseSuccessModal = () => {
    setClaimBonus(false);
    setConfirm(false);
    setProcessing(false);
    modalContent = <></>;
    setProcessed(false);
    setProcessing(false);
    setProcessingFailed(false);
    setShowErrorModal(false);
    setShowModal(false);

    // refresh
    dispatch(
      fetchCollectiblesTransactions({
        account,
        offset: "0",
        contractAddress: genesisNFTContractAddress,
      }),
    );
  };

  const fetchMoreCollectibles = () => {
    setPageOffSet(pageOffSet + 20);
    dispatch(
      fetchCollectiblesTransactions({
        account,
        offset: pageOffSet.toString(),
        contractAddress: genesisNFTContractAddress,
      }),
    );
  };

  /**
   * Modal content depending on what state the process is in.
   */
  let modalContent = (
    <div className="space-y-10">
      <div>
        <Spinner width="w-10" height="h-10" margin="m-0" />
      </div>
      <div className="space-y-4 font-whyte">
        <p className="text-center text-xl">Confirm in wallet</p>
        <p className="text-gray-syn4 text-center text-base">
          Please confirm the token claim in your wallet.
        </p>
      </div>
    </div>
  );

  if (confirm) {
    modalContent = (
      <div className="space-y-10">
        <div>
          <Spinner width="w-10" height="h-10" margin="m-0" />
        </div>
        <div className="space-y-4 font-whyte">
          <p className="text-center text-xl">Confirm in wallet</p>
          <p className="text-gray-syn4 text-center text-base">
            Please confirm the token claim in your wallet.
          </p>
        </div>
      </div>
    );
  } else if (processing) {
    modalContent = (
      <div className="space-y-10">
        <div>
          <Spinner width="w-10" height="h-10" margin="m-0" />
        </div>
        <div className="space-y-4 font-whyte">
          <p className="text-center text-xl">
            Claiming {`${claimBonus ? "bonus RUG" : "RUG"}`}
          </p>

          <div className="text-base flex justify-center items-center hover:opacity-80">
            <EtherscanLink
              etherscanInfo={transactionHash}
              type="transaction"
              text="Etherscan transaction"
            />
          </div>
        </div>
      </div>
    );
  } else if (processed) {
    modalContent = (
      <div className="space-y-10">
        <div className="flex justify-center">
          <img
            className="h-16 w-16"
            src="/images/syndicateStatusIcons/checkCircleGreen.svg"
            alt="checkmark"
          />
        </div>
        <div className="space-y-4 font-whyte">
          <p className="text-center text-xl">{`${
            claimBonus ? "Bonus " : ""
          }RUG claimed`}</p>
          <p className="text-gray-syn4 text-center text-base leading-6">
            {`You just claimed ${numberWithCommas(
              claimBonus ? totalBonusToClaim : totalYieldTokens,
            )} RUG
            successfully. It’s in your wallet.`}
          </p>
          <div className="text-base flex justify-center items-center hover:opacity-80">
            <EtherscanLink
              etherscanInfo={transactionHash}
              type="transaction"
              text="Etherscan transaction"
            />
          </div>
        </div>
        <button
          className={`w-full primary-CTA hover:opacity-90 transition-all`}
          type="button"
          onClick={handleCloseSuccessModal}
        >
          Done
        </button>
      </div>
    );
  } else if (processingFailed) {
    modalContent = (
      <div className="space-y-10">
        <div className="flex justify-center">
          <img
            className="h-16 w-16"
            src="/images/syndicateStatusIcons/transactionFailed.svg"
            alt="checkmark"
          />
        </div>
        <div className="space-y-4 font-whyte">
          <p className="text-center text-xl">Tokens minting failed.</p>
          {!userRejectedTransaction ? (
            <div className="text-base flex justify-center items-center hover:opacity-80">
              <EtherscanLink
                etherscanInfo={transactionHash}
                type="transaction"
                grayIcon
              />
            </div>
          ) : (
            ""
          )}
        </div>
        <button
          className={`w-full primary-CTA hover:opacity-90 transition-all`}
          type="button"
          onClick={handleCloseSuccessModal}
        >
          Close
        </button>
      </div>
    );
  }

  const tabContents = {
    claim: {
      title: "Claim",
      content: (
        <>
          <p className="flex text-xl font-whyte">
            <span className="mr-2 flex">
              <Image
                src={RugRadioTokenWhiteIcon}
                width={16}
                height={16}
                alt="token icon"
              />{" "}
            </span>
            {numberWithCommas(totalYieldTokens)} RUG
          </p>
          <CtaButton
            onClick={handleClaimAll}
            greenCta={true}
            disabled={totalYieldTokens == 0}
          >
            {totalYieldTokens > 0
              ? "Claim yield"
              : `Next claim in ${getCountDownDays(`${nextClaimTime}`)}`}
          </CtaButton>

          {totalAvailableToClaim == 0 && (
            <p className="small-body text-center text-gray-syn5 leading-5">
              You must wait at least 24 hours between RUG claims.
            </p>
          )}
        </>
      ),
    },
    convert: {
      title: (
        <>
          <span className="mr-1.5">
            <Image
              src="/images/rugRadio/locked.svg"
              height={14}
              width={16}
              alt="Locked"
            />
          </span>

          <Tooltip
            content={<div>Coming soon</div>}
            arrow={false}
            tipContentClassName="actionsTooltip"
            background="#232529"
            padding="12px 16px"
            distance={13}
          >
            Convert
          </Tooltip>
        </>
      ),
      content: <>To be implemented</>,
    },
  };

  const loaderContent = (
    <>
      {[...Array(4)].map((_, idx) => (
        <div
          key={idx}
          className="col-span-12 lg:col-span-6 2xl:w-88 w-full max-w-480 h-full"
        >
          <>
            <div className="w-full">
              <SkeletonLoader
                borderRadius="rounded-t-2.5xl"
                width="full"
                height="full"
                customClass="border-r-1 border-l-1 border-t-1 border-gray-syn6 perfect-square-box"
                margin="m-0"
                animate={true}
              />
              <div className="rounded-b-2.5xl w-full p-7 border-b-1 border-r-1 border-l-1 border-gray-syn6">
                <div className="pb-4">
                  <SkeletonLoader
                    width="full"
                    height="6"
                    margin="m-0"
                    borderRadius="rounded-lg"
                    animate={true}
                  />
                </div>
                <SkeletonLoader
                  width="16"
                  height="4"
                  margin="m-0"
                  borderRadius="rounded-lg"
                  animate={true}
                />
                <div className="pt-2">
                  <SkeletonLoader
                    width="32"
                    height="5"
                    margin="m-0"
                    borderRadius="rounded-lg"
                    animate={true}
                  />
                </div>
              </div>
            </div>
          </>
        </div>
      ))}
    </>
  );
  return (
    <>
      <div className="w-full">
        <div className="w-full space-y-20">
          <div className="space-y-4">
            {loading ? (
              <div className="space-y-4 justify-center text-center">
                <div className="flex justify-center text-center">
                  <SkeletonLoader
                    width="32"
                    height="6"
                    margin="m-0"
                    borderRadius="rounded-lg"
                    animate={true}
                  />
                </div>
                <div className="flex justify-center text-center">
                  <SkeletonLoader
                    width="1/2"
                    height="10"
                    margin="m-0"
                    borderRadius="rounded-lg"
                    animate={true}
                  />
                </div>
              </div>
            ) : (
              <>
                <p className="h4 text-center leading-4">claim token</p>
                <p className="h1 text-center">
                  <NumberTreatment numberValue={totalAvailableToClaim} /> RUG
                  available to claim
                </p>
                <p className="h3 text-center text-gray-syn4 leading-7">
                  Your RugRadio Genesis NFTs have generated a total of{" "}
                  <NumberTreatment numberValue={totalGeneratedTokens} /> RUG.
                </p>
              </>
            )}
          </div>
          <div className="flex flex-col lg:flex-row w-full mx-auto justify-center space-y-5 space-x-5">
            <div className="max-w-480 mx-4 md:mx-auto w-full lg:hidden space-y-6">
              {loading ? (
                <div className="p-8 pt-6 space-y-8 bg-gray-syn8 rounded-2.5xl">
                  <div className="w-full flex space-x-6 leading-4">
                    <SkeletonLoader
                      width="full"
                      height="8"
                      margin="m-0"
                      borderRadius="rounded-lg"
                      animate={true}
                    />
                  </div>
                  <div
                    className={`block border-b-1 border-gray-syn7 -mx-8`}
                  ></div>

                  <div>
                    <SkeletonLoader
                      width="full"
                      height="4"
                      margin="m-0"
                      borderRadius="rounded-lg"
                      animate={true}
                    />
                    <div className="pt-2">
                      <SkeletonLoader
                        width="32"
                        height="5"
                        margin="m-0"
                        borderRadius="rounded-lg"
                        animate={true}
                      />
                    </div>
                    <div className="pt-2">
                      <SkeletonLoader
                        width="1/2"
                        height="5"
                        margin="m-0"
                        borderRadius="rounded-lg"
                        animate={true}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <TabComponent tabContents={tabContents} />
                  {+totalBonusToClaim > 0 ? (
                    <BonusTokenClaim
                      handleClaimBonus={handleClaimBonus}
                      bonusAmount={totalBonusToClaim}
                    />
                  ) : null}
                </>
              )}
            </div>
            <InfiniteScroll
              dataLength={collectiblesResult.length}
              next={fetchMoreCollectibles}
              hasMore={!allCollectiblesFetched}
              loader={
                <div className="mt-4 grid grid-cols-12 gap-4">
                  {loaderContent}
                </div>
              }
            >
              <div className="grid grid-cols-12 gap-4">
                {!loading && collectibles.length > 0 ? (
                  collectibles.map((collectible, index) => {
                    const { id, image, animation } = collectible;

                    let mediaType;

                    if (image && !animation) {
                      mediaType = "imageOnlyNFT";
                    } else if (animation) {
                      // animation could be a .mov or .mp4 video
                      const movAnimation = animation.match(/\.mov$/) != null;
                      const mp4Animation = animation.match(/\.mp4$/) != null;

                      if (movAnimation || mp4Animation) {
                        mediaType = "videoNFT";
                      }

                      // https://litwtf.mypinata.cloud/ipfs/QmVjgAD5gaNQ1cLpgKLeuXDPX8R1yeajtWUhM6nV7VAe6e/4.mp4
                      // details for the nft with id below are not returned correctly and hence does not render
                      // The animation link is a .html which is not captured.
                      // Until we find a better way to handle this, let's have the fix below
                      if (animation.match(/\.html$/) != null && id == "3216") {
                        mediaType = "htmlNFT";
                      }

                      // animation could be a gif
                      if (animation.match(/\.gif$/) != null) {
                        mediaType = "animatedNFT";
                      }

                      // add support for .wav and .mp3 files
                      const wavAnimation = animation.match(/\.wav$/) != null;
                      const mp3Animation = animation.match(/\.mp3$/) != null;
                      const soundtrack = wavAnimation || mp3Animation;

                      if (soundtrack) {
                        mediaType = "soundtrackNFT";
                      }
                    }
                    return (
                      <NFTComponent
                        {...{
                          ...{
                            collectible,
                            mediaType,
                            showCollectibles: true,
                            refresh: processed,
                          },
                        }}
                        key={index}
                      />
                    );
                  })
                ) : (
                  null
                )}
              </div>
            </InfiniteScroll>

            <div className="max-w-480 xl:w-full w-min ml-4 space-y-5 hidden lg:block">
              {loading ? (
                <>
                  {[1, 2].map((key, index) => (
                    <div
                      key={index}
                      className="p-8 pt-6 space-y-8 bg-gray-syn8 rounded-2.5xl"
                    >
                      <div className="w-full flex space-x-6 leading-4">
                        <SkeletonLoader
                          width="full"
                          height="8"
                          margin="m-0"
                          borderRadius="rounded-lg"
                          animate={true}
                        />
                      </div>
                      <div
                        className={`block border-b-1 border-gray-syn7 -mx-8`}
                      ></div>

                      <div>
                        <SkeletonLoader
                          width="full"
                          height="4"
                          margin="m-0"
                          borderRadius="rounded-lg"
                          animate={true}
                        />
                        <div className="pt-2">
                          <SkeletonLoader
                            width="32"
                            height="5"
                            margin="m-0"
                            borderRadius="rounded-lg"
                            animate={true}
                          />
                        </div>
                        <div className="pt-2">
                          <SkeletonLoader
                            width="1/2"
                            height="5"
                            margin="m-0"
                            borderRadius="rounded-lg"
                            animate={true}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  <TabComponent tabContents={tabContents} />
                  {+totalBonusToClaim > 0 ? (
                    <BonusTokenClaim
                      handleClaimBonus={handleClaimBonus}
                      bonusAmount={totalBonusToClaim}
                    />
                  ) : null}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirm, Processing */}
      <Modal
        {...{
          show: showErrorModal,
          modalStyle: ModalStyle.DARK,
          showCloseButton: false,
          customWidth: "w-full max-w-480",
          outsideOnClick: false,
          customClassName: "p-10",
          showHeader: false,
          overflowYScroll: false,
          overflow: "overflow-visible",
        }}
      >
        <div
          className={`bg-red-error rounded-md bg-opacity-10 mt-4 py-6 flex flex-col justify-center px-5`}
        >
          <div className="flex justify-center items-center w-full">
            <Image
              width={48}
              height={48}
              src={"/images/syndicateStatusIcons/transactionFailed.svg"}
              alt="failed"
            />
          </div>
          <div className={`mt-4 mb-6 text-center`}>
            <span className="text-base">{`${`Transaction ${
              transactionRejected ? "rejected" : "failed"
            }`}`}</span>
          </div>
          <button
            className="w-full rounded-lg text-base py-4 bg-white text-black"
            onClick={handleCloseErrorModal}
          >
            Close
          </button>
        </div>
      </Modal>

      <Modal
        {...{
          show: showModal,
          modalStyle: ModalStyle.DARK,
          showCloseButton: false,
          customWidth: "w-full max-w-480",
          outsideOnClick: false,
          customClassName: "p-10",
          showHeader: false,
          overflowYScroll: false,
          overflow: "overflow-visible",
        }}
      >
        {modalContent}
      </Modal>

      {/* NFT checker component */}
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
    </>
  );
};
