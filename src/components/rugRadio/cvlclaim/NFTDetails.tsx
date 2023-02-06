import { CTAButton, CTAType } from '@/components/CTAButton';
import { ExternalLinkColor } from '@/components/iconWrappers';
import Modal, { ModalStyle } from '@/components/modal';
import { Spinner } from '@/components/shared/spinner';
import { BlockExplorerLink } from '@/components/syndicates/shared/BlockExplorerLink';

import { AppState } from '@/state';
import { BigNumber } from 'ethers';
import { formatEther } from 'ethers/lib/utils';

import Image from 'next/image';
import { useState } from 'react';
import { useSelector } from 'react-redux';

import { NFTChecker } from '../shared/NFTchecker';

interface NFTDetailsProps {
  tokenIds:
    | {
        tokenId: string;
        amount: number;
      }[]
    | null;
  cost: BigNumber;
  onCloseModal: () => void;
}

export const NFTDetails: React.FC<NFTDetailsProps> = (props) => {
  const { tokenIds, cost, onCloseModal } = props;
  const {
    web3Reducer: {
      web3: { account }
    },
    initializeContractsReducer: {
      syndicateContracts: { rugPFPClaimModule }
    }
  } = useSelector((state: AppState) => state);

  const [showNFTchecker, setShowNFTchecker] = useState(false);

  // utility modal state functions
  const [confirm, setConfirm] = useState(false);
  const [transactionHash, setTransactionHash] = useState('');
  const [userRejectedTransaction] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [processed, setProcessed] = useState(true);
  const [processingFailed, setProcessingFailed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [transactionRejected, setTransactionRejected] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const handleClose = (): void => {
    setShowNFTchecker(false);
    onCloseModal();
  };

  // Show processing transaction when user confirms transaction on wallet.
  const onTxConfirm = (): void => {
    setProcessing(true);
    setConfirm(false);
  };

  const onTxReceipt = (): void => {
    setProcessing(false);
    setConfirm(false);
    setProcessed(true);
    onCloseModal();
  };

  const onTxFail = (error: any): void => {
    const { code } = error;

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
    onCloseModal();
  };

  const handleCloseErrorModal = (): void => {
    setShowErrorModal(false);
    setShowModal(false);
    onCloseModal();
  };

  /**
   * Function to claim all NFTs for a give wallet
   */
  const handleClaimAll = async (event: any): Promise<void> => {
    event.preventDefault();
    if (!tokenIds) return;

    const tokenIdsArray = tokenIds.map((token) => token.tokenId);
    const amounts = tokenIds.map((token) => token.amount);

    setConfirm(true);
    setShowModal(true);
    await rugPFPClaimModule.redeemMany(
      tokenIdsArray,
      amounts,
      account,
      onTxConfirm,
      onTxReceipt,
      onTxFail,
      setTransactionHash
    );
  };

  /**
   * Function to close transaction modal
   */
  const handleCloseSuccessModal = (): void => {
    setConfirm(false);
    setProcessing(false);
    modalContent = <></>;
    setProcessed(false);
    setProcessing(false);
    setProcessingFailed(false);
    setShowErrorModal(false);
    setShowModal(false);
    onCloseModal();
  };

  const totalClaims = tokenIds?.reduce((acc, curr) => acc + curr.amount, 0);

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
            Please confirm the NFT claim in your wallet.
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
          <p className="text-center text-xl">Claiming NFT</p>

          <div className="text-base flex justify-center items-center hover:opacity-80">
            <BlockExplorerLink
              resourceId={transactionHash}
              resource="transaction"
              suffix=" transaction"
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
          <p className="text-center text-xl">Claimed NFT</p>
          <p className="text-gray-syn4 text-center text-base leading-6">
            {`You just claimed the RugRadio NFT
            successfully. It’s in your wallet.`}
          </p>
          <div className="text-base flex justify-center items-center hover:opacity-80">
            <BlockExplorerLink
              resourceId={transactionHash}
              resource="transaction"
              suffix=" transaction"
            />
          </div>
        </div>
        <CTAButton
          buttonType="button"
          fullWidth={true}
          onClick={handleCloseSuccessModal}
        >
          Done
        </CTAButton>
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
          <p className="text-center text-xl">NFT claim failed.</p>
          {!userRejectedTransaction ? (
            <div className="text-base flex justify-center items-center hover:opacity-80">
              <BlockExplorerLink
                resourceId={transactionHash}
                resource="transaction"
                iconcolor={ExternalLinkColor.GRAY}
              />
            </div>
          ) : (
            ''
          )}
        </div>
        <CTAButton
          fullWidth={true}
          buttonType="button"
          onClick={handleCloseSuccessModal}
        >
          Close
        </CTAButton>
      </div>
    );
  }

  return (
    <>
      <div className="w-full h-full">
        <div className="w-full space-y-10">
          <div className="space-y-4 max-w-868 mx-auto">
            <p className="h4 text-center leading-4">Rug Radio</p>
            <p className="h1 text-center">Faces of Web3 by Cory Van Lew</p>
            <div className="w-2/5 h-2/5 mx-auto">
              <img src="/images/rugRadio/rugRadioIcon-black.png" alt="" />
            </div>
            <p className="h3 text-center text-gray-syn4 leading-7">
              Your RugRadio Genesis NFT(s) and $RUG entitle you to {totalClaims}{' '}
              RugRadio x Cory Van Lew PFP
              {totalClaims === 1 ? '' : 's'}. You will be redeeming:
            </p>
          </div>
          <div>
            <p className="h4 text-center leading-4 mb-4">
              {totalClaims} RugRadio Genesis NFT claim
              {totalClaims === 1 ? '' : 's'}
            </p>
            <p className="h4 text-center leading-4">{formatEther(cost)} $RUG</p>
          </div>
          <div className="flex flex-row w-full mx-auto justify-center space-y-5 space-x-5">
            <div className="max-w-480 w-min ml-4s space-y-5">
              <CTAButton onClick={handleClaimAll} type={CTAType.TRANSACTIONAL}>
                Claim NFT(s)
              </CTAButton>
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
          customWidth: 'w-full max-w-480',
          outsideOnClick: false,
          customClassName: 'p-10',
          showHeader: false,
          overflowYScroll: false,
          overflow: 'overflow-visible'
        }}
      >
        <div
          className={`bg-red-error rounded-md bg-opacity-10 mt-4 py-6 flex flex-col justify-center px-5`}
        >
          <div className="flex justify-center items-center w-full">
            <Image
              width={48}
              height={48}
              src={'/images/syndicateStatusIcons/transactionFailed.svg'}
              alt="failed"
            />
          </div>
          <div className={`mt-4 mb-6 text-center`}>
            <span className="text-base">{`${`Transaction ${
              transactionRejected ? 'rejected' : 'failed'
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
          customWidth: 'w-full max-w-480',
          outsideOnClick: false,
          customClassName: 'p-10',
          showHeader: false,
          overflowYScroll: false,
          overflow: 'overflow-visible'
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
          customWidth: 'w-full max-w-480',
          outsideOnClick: true,
          showHeader: false,
          closeModal: () => handleClose(),
          overflowYScroll: false,
          customClassName: 'p-8 pt-6',
          overflow: 'overflow-visible'
        }}
      >
        <NFTChecker />
      </Modal>
    </>
  );
};
