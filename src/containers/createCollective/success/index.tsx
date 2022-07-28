import React, { FC, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { CollectivesInteractiveBackground } from '@/components/collectives/interactiveBackground';
import { CollectivesCreateSuccess } from '@/components/collectives/create/success';
import { useCreateState } from '@/hooks/collectives/useCreateCollective';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '@/state';
import {
  partialCollectiveCreationStateReset,
  resetCollectiveCreationState
} from '@/state/createCollective/slice';

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
  const dispatch = useDispatch();

  const {
    web3Reducer: {
      web3: { activeNetwork }
    }
  } = useSelector((state: AppState) => state);
  const { name, creationStatus } = useCreateState();
  const [collectiveAddress, setCollectiveAddress] = useState<string | null>(
    null
  );

  const onCollectiveCreated = async (address: string) => {
    await setCollectiveAddress(address);
    dispatch(resetCollectiveCreationState());
  };

  useEffect(() => {
    if (creationStatus.creationReceipt.collective) {
      onCollectiveCreated(creationStatus.creationReceipt.collective);
    }
  }, [creationStatus.creationReceipt.collective]);

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
        blockExplorerLink={
          activeNetwork?.blockExplorer?.baseUrl +
          '/address/' +
          collectiveAddress
        }
        blockExplorerName={activeNetwork?.blockExplorer?.name}
      />
    </div>
  );
};
