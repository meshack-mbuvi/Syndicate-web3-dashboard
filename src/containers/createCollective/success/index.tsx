import React, { FC, useEffect } from 'react';
import { CollectivesInteractiveBackground } from '@/components/collectives/interactiveBackground';
import { CollectivesCreateSuccess } from '@/components/collectives/create/success';
import { NFTMediaType } from '@/components/collectives/nftPreviewer';

const CreateCollectiveSuccess: FC = () => {
  return (
    <div className="bg-black w-full h-full pb-38">
      <CollectivesInteractiveBackground
        heightClass="h-full"
        mediaType={NFTMediaType.IMAGE}
        widthClass="w-full"
        floatingIcon="https://lh3.googleusercontent.com/kGd5K1UPnRVe2k_3na9U5IKsAKr2ERGHn6iSQwQBPGywEMcRWiKtFmUh85nuG0tBPKLVqaXsWqHKCEJidwa2w4oUgcITcJ7Kh-ObsA"
        numberOfParticles={40}
      />
    </div>
  );
};

export default CreateCollectiveSuccess;

export const SuccessRightPanel: React.FC = () => {
  return (
    <div className="flex h-full items-center justify-center">
      <CollectivesCreateSuccess
        name={'NFTs and Stuff'}
        inviteLink={'https://www.google.com'}
        CTAonClick={() => {}}
        etherscanLink={'sdfsfd'}
      />
    </div>
  );
};
