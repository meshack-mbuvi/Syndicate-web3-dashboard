import React, { FC, useState } from 'react';
import { CollectiveFormDesign } from '@/components/collectives/create/design';
import { CreateCollectiveTitle, createHeader } from '../shared';
import {
  NFTPreviewer,
  NFTMediaType
} from '@/components/collectives/nftPreviewer';

interface Props {
  handleNext: (e) => void;
}

const CreateCollectiveDesign: FC<Props> = ({ handleNext }) => {
  return (
    <div>
      <CreateCollectiveTitle screen={createHeader.DESIGN} />
      <CollectiveFormDesign
        nameValue={''}
        handleNameChange={() => {}}
        tokenSymbolValue={''}
        handleTokenSymbolChange={() => {}}
        descriptionValue={''}
        handleDescriptionChange={() => {}}
        isContinueButtonActive={true}
        handleContinue={handleNext}
        handleUpload={() => {}}
        handleCancelUpload={() => {}}
      />
    </div>
  );
};

export default CreateCollectiveDesign;

export const DesignRightPanel: React.FC = () => {
  return (
    <div className=" w-full flex justify-center">
      <NFTPreviewer
        description="Alpha Beta Punks dreamcatcher vice affogato sartorial roof party unicorn wolf. Heirloom disrupt PBR&B normcore flexitarian bitters tote bag coloring book cornhole. Portland fixie forage selvage, disrupt +1 dreamcatcher meh ramps poutine stumptown letterpress lyft fam. Truffaut put a bird on it asymmetrical, gastropub master cleanse fingerstache succulents swag flexitarian bespoke thundercats kickstarter chartreuse."
        loading={{
          description: false,
          name: false
        }}
        mediaSource="https://lh3.googleusercontent.com/kGd5K1UPnRVe2k_3na9U5IKsAKr2ERGHn6iSQwQBPGywEMcRWiKtFmUh85nuG0tBPKLVqaXsWqHKCEJidwa2w4oUgcITcJ7Kh-ObsA"
        mediaType={NFTMediaType.IMAGE}
        name="Alpha Beta Punks"
        symbol="ABP"
      />
    </div>
  );
};
