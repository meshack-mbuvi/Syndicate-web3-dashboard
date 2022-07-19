import React, { FC, useEffect } from 'react';
import { CollectiveFormCustomize } from '@/components/collectives/create/customize';
import { CollectivesInteractiveBackground } from '@/components/collectives/interactiveBackground';
import { CreateCollectiveTitle, createHeader } from '../shared';
import {
  useCreateState,
  useUpdateState
} from '@/hooks/collectives/useCreateCollective';
import { AppState } from '@/state';
import { useSelector } from 'react-redux';
import { OpenUntil } from '@/components/collectives/create/inputs/openUntil/radio';

interface Props {
  handleNext: (e) => void;
}

const CreateCollectiveCustomize: FC<Props> = ({ handleNext }) => {
  const {
    web3Reducer: {
      web3: { activeNetwork }
    }
  } = useSelector((state: AppState) => state);
  const {
    membershipType,
    pricePerNFT,
    maxPerWallet,
    maxSupply,
    openUntil,
    timeWindow,
    closeDate,
    closeTime,
    EpochCloseTime,
    tokenDetails,
    transferrable
  } = useCreateState();

  const {
    handleTimeWindowChange,
    handlePriceToJoinChange,
    handleMaxPerWalletChange,
    handleMaxSupplyChange,
    handleClickToChangeToken,
    handleTokenDetailsChange,
    handleOpenUntilChange,
    handleCloseDateChange,
    handleCloseTimeChange,
    handleChangeAllowOwnershipTransfer,
    ContinueButtonActive,
    setContinueButtonActive
  } = useUpdateState();

  useEffect(() => {
    if (!tokenDetails.symbol) {
      let symbol: string = activeNetwork.nativeCurrency.symbol;
      let icon: string = activeNetwork.nativeCurrency.logo;
      handleTokenDetailsChange({ symbol, icon });
    }
  }, [tokenDetails]);

  useEffect(() => {
    if (
      membershipType &&
      pricePerNFT &&
      maxPerWallet &&
      timeWindow >= 0 &&
      closeDate &&
      closeTime &&
      tokenDetails
    ) {
      let proceed = true;

      if (openUntil === OpenUntil.MAX_MEMBERS && !maxSupply) {
        proceed = false;
      }
      setContinueButtonActive(proceed);
      return;
    }
    setContinueButtonActive(false);
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
    transferrable
  ]);

  return (
    <div>
      <CreateCollectiveTitle screen={createHeader.CUSTOMIZE} />
      <CollectiveFormCustomize
        selectedMembershipType={membershipType}
        priceToJoin={pricePerNFT}
        handlePriceToJoinChange={handlePriceToJoinChange}
        tokenDetails={tokenDetails}
        handleClickToChangeToken={handleClickToChangeToken}
        maxPerWallet={maxPerWallet}
        handleMaxPerWalletChange={handleMaxPerWalletChange}
        openUntil={openUntil}
        handleOpenUntilChange={handleOpenUntilChange}
        selectedTimeWindow={timeWindow}
        handleTimeWindowChange={handleTimeWindowChange}
        closeDate={closeDate}
        handleCloseDateChange={handleCloseDateChange}
        closeTime={closeTime}
        handleCloseTimeChange={handleCloseTimeChange}
        maxSupply={maxSupply}
        handleMaxSupplyChange={handleMaxSupplyChange}
        allowOwnershipTransfer={transferrable}
        handleChangeAllowOwnershipTransfer={handleChangeAllowOwnershipTransfer}
        isContinueButtonActive={ContinueButtonActive}
        handleContinue={handleNext}
        maxMembers={0}
        handleMaxMembersChange={() => {}}
      />
    </div>
  );
};

export default CreateCollectiveCustomize;

export const CustomizeRightPanel: React.FC = () => {
  const { artworkType } = useCreateState();
  return (
    <div className="bg-black w-full h-full pb-38">
      <CollectivesInteractiveBackground
        heightClass="h-full"
        widthClass="w-full"
        mediaType={artworkType}
        numberOfParticles={40}
      />
    </div>
  );
};
