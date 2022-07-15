import React, { FC } from 'react';
import {
  CollectiveFormCustomize,
  MembershipType
} from '@/components/collectives/create/customize';
import { TimeWindow } from '@/components/collectives/create/inputs/timeWindow';
import { CollectivesInteractiveBackground } from '@/components/collectives/interactiveBackground';
import { CreateCollectiveTitle, createHeader } from '../shared';

interface Props {
  handleNext: (e) => void;
}

const CreateCollectiveCustomize: FC<Props> = ({ handleNext }) => {
  return (
    <div>
      <CreateCollectiveTitle screen={createHeader.CUSTOMIZE} />
      <CollectiveFormCustomize
        selectedMembershipType={MembershipType.OPEN}
        selectedTimeWindow={TimeWindow.DAY}
        handleTimeWindowChange={() => {}}
        maxMembers={0}
        handleMaxMembersChange={() => {}}
        priceToJoin={10000}
        handlePriceToJoinChange={() => {}}
        maxPerWallet={1}
        handleMaxPerWalletChange={() => {}}
        maxSupply={10000}
        handleMaxSupplyChange={() => {}}
        tokenDetails={{ symbol: '', icon: '' }}
        handleClickToChangeToken={() => {}}
        closeDate={new Date('10/10/2022')}
        handleCloseDateChange={() => {}}
        closeTime={'91293924'}
        handleCloseTimeChange={() => {}}
        allowOwnershipTransfer={true}
        handleChangeAllowOwnershipTransfer={() => {}}
        isContinueButtonActive={true}
        handleContinue={handleNext}
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
