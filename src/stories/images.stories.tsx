import Modal, { ModalStyle } from "@/components/modal";
import React, { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

const Images: React.FC = () => {
  const [show, setShow] = useState(false);
  const [currentImg, setCurrentImg] = useState("");
  const [showCopyState, setShowCopyState] = useState(false);

  const updateAddressCopyState = () => {
    setShowCopyState(true);
    setTimeout(() => setShowCopyState(false), 1000);
  };

  return (
    <>
      <div className="flex flex-row flex-wrap">
        {images.map((image) => (
          <button
            className="border border-gray-syn2 bg-gray-syn1 p-2 rounded-md m-6"
            key={image}
            onClick={() => {
              setShow(true);
              setCurrentImg(image);
            }}
          >
            <img src={image} alt={image} className="w-20 h-20" />
          </button>
        ))}
      </div>
      <Modal
        show={show}
        modalStyle={ModalStyle.DARK}
        showCloseButton={false}
        outsideOnClick={true}
        closeModal={() => setShow(false)}
        customWidth="w-11/12 md:w-1/2"
        customClassName=""
      >
        <div className="flex flex-col space-y-2 items-center p-8">
          <img src={currentImg} alt={currentImg} className="w-1/2 md:w-2/3" />
          <span className="flex flex-row items-center space-x-2 flex-wrap">
            <code>{currentImg}</code>

            <CopyToClipboard text={currentImg} onCopy={updateAddressCopyState}>
              <div className="relative cursor-pointer">
                {showCopyState && (
                  <span className="absolute text-xs top-5 -left-1/2">
                    copied
                  </span>
                )}
                <img
                  alt="copy"
                  src="/images/copy-clipboard.svg"
                  className="h-4 mx-auto cursor-pointer"
                />
              </div>
            </CopyToClipboard>
          </span>
        </div>
      </Modal>
    </>
  );
};

export default Images;

const images = [
  "/images/Locked.svg",
  "/images/UserPlus.svg",
  "/images/User_Check.svg",
  "/images/User_Icon.svg",
  "/images/add.svg",
  "/images/alert.svg",
  "/images/arrowBack.svg",
  "/images/arrowDown.svg",
  "/images/arrowNext.svg",
  "/images/back-chevron-large.svg",
  "/images/block-address.svg",
  "/images/block.svg",
  "/images/blueIcon.svg",
  "/images/brand.svg",
  "/images/brightTurguoiseLogo.svg",
  "/images/checkCircle.svg",
  "/images/checkCircleGreen.svg",
  "/images/checkmark-approved.svg",
  "/images/checkmark.svg",
  "/images/chevron-back.svg",
  "/images/chevron-down.svg",
  "/images/chevron-left-blue.svg",
  "/images/chevron-right-dark.svg",
  "/images/chevron-right.svg",
  "/images/chevron-up.svg",
  "/images/chrome-dark.svg",
  "/images/close-circle.svg",
  "/images/close-gray-5.svg",
  "/images/close-white.svg",
  "/images/close.svg",
  "/images/closeIcon.svg",
  "/images/collectibles.svg",
  "/images/copy-clipboard-blue.svg",
  "/images/copy-clipboard.svg",
  "/images/copy-link.svg",
  "/images/copy.svg",
  "/images/dai-symbol.svg",
  "/images/daiIcon.svg",
  "/images/danger.svg",
  "/images/delphi-labs-avatar.svg",
  "/images/deposit.svg",
  "/images/distribute-gray.svg",
  "/images/distribute-white.svg",
  "/images/edit-deposit.svg",
  "/images/edit-deposits-blue.svg",
  "/images/errorClose.svg",
  "/images/ethereum-logo.png",
  "/images/exclamation-triangle.svg",
  "/images/exclamation.svg",
  "/images/exclamationDiagonal.svg",
  "/images/externalLink.svg",
  "/images/externalLinkGray.svg",
  "/images/eye-open.svg",
  "/images/file-icon-gray.svg",
  "/images/file-icon-white.svg",
  "/images/file-upload.svg",
  "/images/gmoney-avatar.svg",
  "/images/gnosisSafe.png",
  "/images/greenIcon.svg",
  "/images/hide-eye.svg",
  "/images/info.svg",
  "/images/invertedInfo-white.svg",
  "/images/invertedInfo.svg",
  "/images/investments-title-icon.svg",
  "/images/latham&watkinsllp.svg",
  "/images/leftArrow.svg",
  "/images/leftArrowBlue.svg",
  "/images/lemonLogo.svg",
  "/images/lightbulb.svg",
  "/images/lighteningYellowLogo.svg",
  "/images/list.svg",
  "/images/loading-small-disabled.svg",
  "/images/lock.svg",
  "/images/lockClosed.svg",
  "/images/lockGreen.svg",
  "/images/lockOpen.svg",
  "/images/logo-dark.svg",
  "/images/logo.svg",
  "/images/memberDeposited.svg",
  "/images/metamaskIcon.svg",
  "/images/more_horiz.svg",
  "/images/notification.png",
  "/images/notificationIcon.png",
  "/images/pencil.and.outline.svg",
  "/images/pinLocation.svg",
  "/images/plus-circle-white.svg",
  "/images/plus-circle.svg",
  "/images/plusSign.svg",
  "/images/profileIcon.png",
  "/images/redOrangeLogo.svg",
  "/images/refresh.png",
  "/images/refresh.svg",
  "/images/return-deposit-blue.svg",
  "/images/return-deposits.svg",
  "/images/ribbon.svg",
  "/images/right-arrow.svg",
  "/images/rightArrow.svg",
  "/images/rightPointedHand.svg",
  "/images/roundedXicon.svg",
  "/images/search.svg",
  "/images/server.svg",
  "/images/settings.svg",
  "/images/show-eye.svg",
  "/images/shuffle.svg",
  "/images/socialProfile.svg",
  "/images/sort-ascending.svg",
  "/images/sort-descending.svg",
  "/images/sortIcon.svg",
  "/images/spring-greenishLogo.svg",
  "/images/successCheckmark.svg",
  "/images/syndicate-icon.png",
  "/images/tailwind-icon.png",
  "/images/token-gray-4.svg",
  "/images/token-gray.svg",
  "/images/token.svg",
  "/images/tokenWarning.svg",
  "/images/transactionIcon.png",
  "/images/transfer-icon.svg",
  "/images/tray-icon.svg",
  "/images/usdcIcon.svg",
  "/images/user.svg",
  "/images/usercheck-disabled.svg",
  "/images/usercheck-enabled.svg",
  "/images/wallet.svg",
  "/images/walletConnect.svg",
  "/images/walletConnected.svg",
  "/images/walletDisconnected.svg",
  "/images/withdrawDepositIcon.svg",
  "/images/withdrewDeposit.svg",
  "/images/wordmark.svg",
  "/images/actionIcons/checkMark.svg",
  "/images/actionIcons/copy-clipboard-blue.svg",
  "/images/actionIcons/copy-clipboard-white.svg",
  "/images/actionIcons/edit-icon.svg",
  "/images/actionIcons/exitFullScreen.svg",
  "/images/actionIcons/fullScreenIcon.svg",
  "/images/actionIcons/muteIcon.svg",
  "/images/actionIcons/openSeaIcon.svg",
  "/images/actionIcons/openSeaIconDark.svg",
  "/images/actionIcons/plus-sign.svg",
  "/images/actionIcons/unmuteIcon.svg",
  "/images/actionIcons/unselectAllCheckboxes.svg",
  "/images/actionIcons/arrowRightBlack.svg",
  "/images/activity/chevron-up.svg",
  "/images/activity/collectibleIcon.svg",
  "/images/activity/deposit-transaction.svg",
  "/images/activity/edit-icon.svg",
  "/images/activity/everything.svg",
  "/images/activity/expense-transaction.svg",
  "/images/activity/incoming-transaction.svg",
  "/images/activity/investment-tokens.svg",
  "/images/activity/investment-transaction.svg",
  "/images/activity/offchain-investment.svg",
  "/images/activity/other-transaction.svg",
  "/images/activity/outgoing-transaction.svg",
  "/images/activity/plus-sign.svg",
  "/images/activity/question-2.svg",
  "/images/activity/question-small.svg",
  "/images/activity/question.svg",
  "/images/activity/select-category.svg",
  "/images/activity/token.svg",
  "/images/activity/chevron-down.svg",
  "/images/badges/genesis.svg",
  "/images/demoMode/crown.svg",
  "/images/demoMode/person.svg",
  "/images/demoMode/repeat.svg",
  "/images/demoMode/straightArrowRight.svg",
  "/images/demoMode/arrowLeft.svg",
  "images/deposit/depositReached.svg",
  "images/deposit/disabledTokenLogo.svg",
  "images/deposit/info.svg",
  "images/deposit/lockedIcon.svg",
  "images/deposit/sampleIcon.png",
  "images/deposit/userAttention.svg",
  "images/deposit/arrowDown.svg",
  "/images/managerActions/allow.svg",
  "/images/managerActions/approve_members.svg",
  "/images/managerActions/close_syndicate.svg",
  "/images/managerActions/close_syndicate_white.svg",
  "/images/managerActions/create_public_profile.svg",
  "/images/managerActions/create_public_profile_white.svg",
  "/images/managerActions/manage_members.svg",
  "/images/managerActions/overwrite_cap_table.svg",
  "/images/managerActions/reject_deposits_members.svg",
  "/images/managerActions/settings-white.svg",
  "/images/managerActions/settings.svg",
  "/images/managerActions/transfer_deposit.svg",
  "/images/managerActions/userAdd-white.svg",
  "/images/managerActions/userAdd.svg",
  "/images/managerActions/allow-white.svg",
  "/images/nftClaim/etherscan.svg",
  "/images/nftClaim/fullScreen-overlay.svg",
  "/images/nftClaim/mute-overlay.svg",
  "/images/nftClaim/opensea-black.svg",
  "/images/nftClaim/opensea.svg",
  "/images/nftClaim/unmute-overlay.svg",
  "/images/social/logoBanner.png",
  "/images/social/placeholder-twitter-pp.svg",
  "/images/social/plus-sign.svg",
  "/images/social/smallTwitter.svg",
  "/images/social/smallTwitterGray.svg",
  "/images/social/smallWeb.svg",
  "/images/social/telegram.svg",
  "/images/social/twitter-blue.svg",
  "/images/social/twitter-logo-small.svg",
  "/images/social/twitter.svg",
  "/images/social/waitlist-bg.svg",
  "/images/social/web.svg",
  "/images/status/check.svg",
  "/images/status/deposit-transaction.svg",
  "/images/status/expense-transaction.svg",
  "/images/status/gamecontroller.svg",
  "/images/status/incoming-transaction.svg",
  "/images/status/investment-token.svg",
  "/images/status/investment-transaction.svg",
  "/images/status/other-transaction.svg",
  "/images/status/outgoing-transaction.svg",
  "/images/syndicateStatusIcons/active.svg",
  "/images/syndicateStatusIcons/checkCircleGreen.svg",
  "/images/syndicateStatusIcons/claimToken.svg",
  "/images/syndicateStatusIcons/depositIcon.svg",
  "/images/syndicateStatusIcons/depositReachedIcon.svg",
  "/images/syndicateStatusIcons/distributeIcon.svg",
  "/images/syndicateStatusIcons/logo.svg",
  "/images/syndicateStatusIcons/maxDepositIcon.svg",
  "/images/syndicateStatusIcons/operatingIcon.svg",
  "/images/syndicateStatusIcons/portfolioEmptyIcon.svg",
  "/images/syndicateStatusIcons/transactionFailed.svg",
  "/images/syndicateStatusIcons/warning-triangle-gray.svg",
  "/images/syndicateStatusIcons/warning-triangle.svg",
];
