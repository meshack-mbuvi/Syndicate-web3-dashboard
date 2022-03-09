import Modal, { ModalStyle } from "@/components/modal";
import { Spinner } from "@/components/shared/spinner";
import { BlockExplorerLink } from "@/components/syndicates/shared/BlockExplorerLink";
import React from "react";

interface IProcessingClaimModal {
  showModal: boolean;
  closeModal: any;
  successfulClaim: boolean;
  transactionHash: string;
  claimFailed: boolean;
  submitting: boolean;
  claimMany?: number;
}

const ProcessingClaimModal: React.FC<IProcessingClaimModal> = ({
  showModal,
  closeModal,
  successfulClaim,
  transactionHash,
  claimFailed,
  submitting,
  claimMany,
}) => {
  return (
    <Modal
      modalStyle={ModalStyle.DARK}
      show={showModal}
      closeModal={() => {
        closeModal();
      }}
      customWidth="w-100"
      customClassName="py-8 px-10"
      showCloseButton={true}
      outsideOnClick={true}
      showHeader={false}
      overflow="overflow-x-visible"
      overflowYScroll={false}
      isMaxHeightScreen={false}
    >
      <div className="">
        {submitting ? (
          <div className="h-fit-content rounded-2-half text-center">
            <div className="pb-8">
              <Spinner width="w-16" height="h-16" margin="m-0" />
            </div>
            <div className="pb-6 text-2xl">
              {claimMany ? `Claiming ${claimMany} NFTs` : "Claiming NFT"}
            </div>
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
        ) : successfulClaim || claimFailed ? (
          <div className="text-center">
            <div className="flex justify-center items-center w-full mb-4">
              <img
                className="h-16 w-16"
                src={
                  successfulClaim
                    ? "/images/syndicateStatusIcons/checkCircleGreen.svg"
                    : "/images/syndicateStatusIcons/transactionFailed.svg"
                }
                alt="checkmark"
              />
            </div>
            <div className="mb-4 text-2xl">
              {successfulClaim
                ? claimMany
                  ? `${claimMany} NFTs claimed`
                  : "NFT claimed"
                : claimFailed
                ? "Claim failed"
                : null}
            </div>
            {successfulClaim && (
              <div className="text-base text-gray-lightManatee text-center mb-6">
                Successfully minted. It’s in your wallet.
              </div>
            )}

            <button
              className={`flex items-center justify-center w-full rounded-lg text-base text-black px-8 py-4 mb-6 text-black font-medium bg-white `}
              onClick={closeModal}
            >
              Done
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
        ) : null}
      </div>
    </Modal>
  );
};

export default ProcessingClaimModal;
