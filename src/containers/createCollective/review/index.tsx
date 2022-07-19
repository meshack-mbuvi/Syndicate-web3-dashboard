import React, { FC, useEffect } from 'react';
import { CollectiveFormReview } from '@/components/collectives/create/review';
import { CreateCollectiveTitle, createHeader } from '../shared';
import { CollectivesInteractiveBackground } from '@/components/collectives/interactiveBackground';
import {
  useCreateState,
  useUpdateState
} from '@/hooks/collectives/useCreateCollective';
import { OpenUntil } from '@/components/collectives/create/inputs/openUntil/radio';

interface Props {
  handleNext: (e) => void;
}
const CreateCollectiveReview: FC<Props> = ({ handleNext }) => {
  const {
    name,
    symbol,
    // artwork,
    // artworkType,
    artworkUrl,
    description,
    pricePerNFT,
    maxPerWallet,
    membershipType,
    timeWindow,
    openUntil,
    closeDate,
    closeTime,
    // closeAfterMaxSupply,
    maxSupply,
    transferrable,
    tokenDetails
  } = useCreateState();

  const {
    handleNameChange,
    handleTokenSymbolChange,
    // handleDescriptionChange,
    // setContinueButtonActive,
    // ContinueButtonActive,
    handleTimeWindowChange,
    handlePriceToJoinChange,
    handleMaxPerWalletChange,
    handleMaxSupplyChange,
    handleClickToChangeToken,
    handleOpenUntilChange,
    handleCloseDateChange,
    handleCloseTimeChange,
    handleChangeAllowOwnershipTransfer,
    submitButtonActive,
    setSubmiteButtonActive,
    handleSubmit
  } = useUpdateState();

  useEffect(() => {
    if (
      membershipType &&
      pricePerNFT &&
      maxPerWallet &&
      timeWindow >= 0 &&
      closeDate &&
      closeTime &&
      tokenDetails &&
      name &&
      artworkUrl &&
      description &&
      symbol
    ) {
      let proceed = true;

      if (openUntil === OpenUntil.MAX_MEMBERS && !maxSupply) {
        proceed = false;
      }
      setSubmiteButtonActive(proceed);
      return;
    }
    setSubmiteButtonActive(false);
  }, [
    membershipType,
    pricePerNFT,
    maxPerWallet,
    maxSupply,
    openUntil,
    timeWindow,
    closeDate,
    closeTime,
    tokenDetails,
    transferrable,
    name,
    artworkUrl,
    description,
    symbol
  ]);

  return (
    <div>
      <CreateCollectiveTitle screen={createHeader.REVIEW} />
      <div className="mt-8">
        <CollectiveFormReview
          nameValue={name}
          handleNameChange={handleNameChange}
          tokenSymbolValue={symbol}
          handleTokenSymbolChange={handleTokenSymbolChange}
          priceToJoin={pricePerNFT}
          handlePriceToJoinChange={handlePriceToJoinChange}
          tokenDetails={tokenDetails}
          handleClickToChangeToken={handleClickToChangeToken}
          maxPerWallet={maxPerWallet}
          handleMaxPerWalletChange={handleMaxPerWalletChange}
          openUntil={openUntil}
          setOpenUntil={handleOpenUntilChange}
          closeDate={closeDate}
          handleCloseDateChange={handleCloseDateChange}
          closeTime={closeTime}
          handleCloseTimeChange={handleCloseTimeChange}
          selectedTimeWindow={timeWindow}
          handleTimeWindowChange={handleTimeWindowChange}
          endOfTimeWindow={'Jun 11, 2021 11:59pm PST'}
          maxSupply={maxSupply}
          handleMaxSupplyChange={handleMaxSupplyChange}
          allowOwnershipTransfer={transferrable}
          handleChangeAllowOwnershipTransfer={
            handleChangeAllowOwnershipTransfer
          }
          isSubmitButtonActive={submitButtonActive}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default CreateCollectiveReview;

export const ReviewRightPanel: React.FC = () => {
  const { artworkType, artworkUrl } = useCreateState();
  return (
    <div className="bg-black w-full h-full pb-38">
      <CollectivesInteractiveBackground
        heightClass="h-full"
        widthClass="w-full"
        mediaType={artworkType}
        floatingIcon={artworkUrl}
        numberOfParticles={40}
      />
    </div>
  );
};
