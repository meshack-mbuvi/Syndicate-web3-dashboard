import { OpenUntil } from '@/components/collectives/create/inputs/openUntil/radio';
import { CollectiveFormReview } from '@/components/collectives/create/review';
import {
  useCreateState,
  useSubmitCollective,
  useSubmitToContracts,
  useUpdateState
} from '@/hooks/collectives/useCreateCollective';
import { AppState } from '@/state';
import { showWalletModal } from '@/state/wallet/actions';
import { default as _moment } from 'moment-timezone';
import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CreateCollectiveTitle, createHeader } from '../shared';
import CreateCollectiveModals from '../shared/createCollectiveModals';
import { NFTMediaType } from '@/components/collectives/nftPreviewer';
import { amplitudeLogger, Flow } from '@/components/amplitude';
import { COLLECTIVE_CREATION_DISCLAIMER_AGREE } from '@/components/amplitude/eventNames';

interface Props {
  handleNext?: (e) => void;
  setNextBtnDisabled?: (disabled: boolean) => void;
}
const CreateCollectiveReview: FC<Props> = ({ setNextBtnDisabled }) => {
  const {
    web3Reducer: {
      web3: { account }
    }
  } = useSelector((state: AppState) => state);
  setNextBtnDisabled(true);

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
    setSubmitButtonActive,
    hasAgreedToTerms,
    setAgreedToTerms
  } = useUpdateState();

  const { handleSubmit } = useSubmitCollective();
  const { submit: submitToContracts } = useSubmitToContracts();
  const dispatch = useDispatch();

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

      setSubmitButtonActive(proceed);
      amplitudeLogger(COLLECTIVE_CREATION_DISCLAIMER_AGREE, {
        flow: Flow.COLLECTIVE_CREATE
      });
      return;
    }
    setSubmitButtonActive(false);
  }, [
    membershipType,
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

  const handleConnectWallet = () => {
    dispatch(showWalletModal());
  };

  return (
    <div className="h-full flex flex-col max-w-730 w-full">
      <CreateCollectiveTitle screen={createHeader.REVIEW} />
      <div className="mt-8 h-full w-full flex-grow">
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
          handleConnectWallet={handleConnectWallet}
          account={account}
        />
      </div>
      <CreateCollectiveModals handleReSubmit={launchCollective} />
    </div>
  );
};

export default CreateCollectiveReview;

export const ReviewRightPanel: React.FC = () => {
  const { artworkType, artworkUrl } = useCreateState();
  return (
    <div className="w-full h-full relative">
      {/* Floating icon */}
      <div className="absolute w-full left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2">
        <div className="w-full h-full">
          {(artworkType === NFTMediaType.IMAGE ||
            artworkType === NFTMediaType.CUSTOM) && (
            <img
              src={artworkUrl}
              alt="Collective icon"
              className="w-20 h-20 mx-auto bg-gray-syn7 select-none"
            />
          )}
          {artworkType === NFTMediaType.VIDEO && (
            // eslint-disable-next-line jsx-a11y/media-has-caption
            <video
              autoPlay
              playsInline={true}
              loop
              muted
              className={`${'object-cover'} w-20 h-20`}
            >
              <source src={artworkUrl} type="video/mp4"></source>
            </video>
          )}
        </div>
      </div>
    </div>
  );
};
