import React, { FC } from 'react';
import {
  CollectiveFormCustomize,
  MembershipType
} from '@/components/collectives/create/customize';
import { TimeWindow } from '@/components/collectives/create/inputs/timeWindow';
import { CollectivesInteractiveBackground } from '@/components/collectives/interactiveBackground';
import { CreateCollectiveTitle, createHeader } from '../shared';
import {
  setCollectivePricePerNFT,
  setCollectiveMaxPerWallet,
  setCollectiveOpenUntil,
  setCollectiveTimeWindow,
  setCollectiveCloseDate,
  setCollectiveCloseTime,
  setCollectiveMaxSupply,
  setCollectiveTransferrable,
  setColectiveTokenDetails
} from '@/state/createCollective/slice';
import { useDispatch } from 'react-redux';
import { useCreateState } from '@/hooks/collectives/useCreateCollective';
import { OpenUntil } from '@/components/collectives/create/inputs/openUntil/radio';

interface Props {
  handleNext: (e) => void;
}

const CreateCollectiveCustomize: FC<Props> = ({ handleNext }) => {
  const dispatch = useDispatch();
  const {
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
  } = useCreateState();

  const handleTimeWindowChange = (timeWindow: TimeWindow) => {
    dispatch(setCollectiveTimeWindow(timeWindow));
  };
  // const handleMaxMembersChange = (maxMembers: MembershipType) => {
  //   dispatch(setCollectiveMembershipType(maxMembers));
  // };
  const handlePriceToJoinChange = (priceToJoin: number) => {
    dispatch(setCollectivePricePerNFT(priceToJoin));
  };
  const handleMaxPerWalletChange = (maxPerWallet: number) => {
    dispatch(setCollectiveMaxPerWallet(maxPerWallet));
  };
  const handleMaxSupplyChange = (maxSupply: number) => {
    dispatch(setCollectiveMaxSupply(maxSupply));
  };
  const handleClickToChangeToken = () => {
    dispatch(setColectiveTokenDetails({}));
  };
  const handleTokenDetailsChange = (tokenDetails: string) => {
    dispatch(setColectiveTokenDetails(tokenDetails));
  };
  const handleOpenUntilChange = (openUntil: OpenUntil) => {
    dispatch(setCollectiveOpenUntil(openUntil));
  };
  const handleCloseDateChange = (closeDate: Date) => {
    dispatch(setCollectiveCloseDate(closeDate));
  };
  const handleCloseTimeChange = (closeTime: string) => {
    console.log('handleCloseTimeChange', closeTime);
    dispatch(setCollectiveCloseTime(closeTime));
  };
  const handleChangeAllowOwnershipTransfer = (
    allowOwnershipTransfer: boolean
  ) => {
    dispatch(setCollectiveTransferrable(allowOwnershipTransfer));
  };

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
        isContinueButtonActive={true}
        handleContinue={handleNext}
        maxMembers={0}
        handleMaxMembersChange={() => {}}
      />
    </div>
  );
};

export default CreateCollectiveCustomize;

export const CustomizeRightPanel: React.FC = () => {
  return (
    <div className="bg-black w-full h-full pb-38">
      <CollectivesInteractiveBackground
        heightClass="h-full"
        widthClass="w-full"
        numberOfParticles={40}
      />
    </div>
  );
};
