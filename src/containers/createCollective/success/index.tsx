import React, { FC, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { CollectivesInteractiveBackground } from '@/components/collectives/interactiveBackground';
import { CollectivesCreateSuccess } from '@/components/collectives/create/success';
import { useCreateState } from '@/hooks/collectives/useCreateCollective';
import { useSelector } from 'react-redux';
import { AppState } from '@/state';

const CreateCollectiveSuccess: FC = () => {
  const { artworkUrl, artworkType } = useCreateState();
  return (
    <div className="bg-black w-full h-full pb-38">
      <CollectivesInteractiveBackground
        heightClass="h-full"
        mediaType={artworkType}
        widthClass="w-full"
        floatingIcon={artworkUrl}
        numberOfParticles={40}
      />
    </div>
  );
};

export default CreateCollectiveSuccess;

export const SuccessRightPanel: React.FC = () => {
  const router = useRouter();
  const {
    web3Reducer: {
      web3: { activeNetwork }
    }
  } = useSelector((state: AppState) => state);
  const { name } = useCreateState();

  const [collectiveAddress, setCollectiveAddress] = useState('0x0');

  const collectiveURL = useMemo(() => {
    return `${window.location.origin}/collectives/${collectiveAddress}?chain=${activeNetwork.network}`;
  }, [collectiveAddress]);

  const CTAOnClick = () => {
    router.push(
      `/collectives/${collectiveAddress}${'?chain=' + activeNetwork.network}`
    );
  };

  return (
    <div className="flex h-full items-center justify-center">
      <CollectivesCreateSuccess
        name={name}
        inviteLink={collectiveURL}
        CTAonClick={CTAOnClick}
        blockExplorerLink={activeNetwork?.blockExplorer?.baseUrl + '/' + '0x0'}
        blockExplorerName={activeNetwork?.blockExplorer?.name}
      />
    </div>
  );
};
