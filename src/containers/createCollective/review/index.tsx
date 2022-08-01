import React, { FC, useEffect, useState } from 'react';
import { CollectiveFormReview } from '@/components/collectives/create/review';
import { CreateCollectiveTitle, createHeader } from '../shared';
import { CollectivesInteractiveBackground } from '@/components/collectives/interactiveBackground';
import {
  useCreateState,
  useSubmitCollective,
  useUpdateState,
  useSubmitToContracts
} from '@/hooks/collectives/useCreateCollective';
import { OpenUntil } from '@/components/collectives/create/inputs/openUntil/radio';
import { default as _moment } from 'moment-timezone';

interface Props {
  handleNext: (e) => void;
}
const CreateCollectiveReview: FC<Props> = ({ handleNext }) => {
  const {
    name,
    symbol,
    artworkUrl,
    description,
    pricePerNFT,
    maxPerWallet,
    membershipType,
    timeWindow,
    openUntil,
    closeDate,
    closeTime,
    EpochCloseTime,
    maxSupply,
    transferrable,
    tokenDetails,
    creationStatus
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
    hasAgreedToTerms,
    setAgreedToTerms
  } = useUpdateState();

  const { handleSubmit } = useSubmitCollective();
  const { submit: submitToContracts } = useSubmitToContracts();

  const launchCollective = () => {
    if (creationStatus.ipfsHash) {
      submitToContracts();
    } else {
      handleSubmit();
    }
  };

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
      symbol &&
      hasAgreedToTerms
    ) {
      let proceed = true;

      if (
        (openUntil === OpenUntil.MAX_MEMBERS && !maxSupply) ||
        !hasAgreedToTerms
      ) {
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
    symbol,
    hasAgreedToTerms
  ]);

  const [timeString, setTimeString] = React.useState('');

  useEffect(() => {
    if (EpochCloseTime) {
      const timeZoneString = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setTimeString(
        _moment(EpochCloseTime * 1000)
          .tz(timeZoneString)
          .format('MMM D,  YYYY, hh:mmA zz')
      );
    }
  }, [EpochCloseTime]);

  return (
    <div className="h-full flex flex-col">
      <CreateCollectiveTitle screen={createHeader.REVIEW} />
      <div className="mt-8 h-full flex-grow">
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
          endOfTimeWindow={timeString}
          maxSupply={maxSupply}
          handleMaxSupplyChange={handleMaxSupplyChange}
          allowOwnershipTransfer={transferrable}
          handleChangeAllowOwnershipTransfer={
            handleChangeAllowOwnershipTransfer
          }
          isSubmitButtonActive={submitButtonActive}
          handleSubmit={launchCollective}
          hasAgreedToTerms={hasAgreedToTerms}
          handleAgreedToTerms={() => setAgreedToTerms(!hasAgreedToTerms)}
        />
      </div>
    </div>
  );
};

export default CreateCollectiveReview;

export const ReviewRightPanel: React.FC = () => {
  const { artworkType, artworkUrl } = useCreateState();
  return (
    <div className="bg-black w-full h-full pb-38 ">
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
