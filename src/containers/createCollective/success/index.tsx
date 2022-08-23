import React, { FC, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { CollectivesInteractiveBackground } from '@/components/collectives/interactiveBackground';
import { CollectivesCreateSuccess } from '@/components/collectives/create/success';
import { useCreateState } from '@/hooks/collectives/useCreateCollective';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '@/state';
import { resetCollectiveCreationState } from '@/state/createCollective/slice';
import { NFTMediaType } from '@/components/collectives/nftPreviewer';
import useVerifyCollectiveCreation from '@/hooks/collectives/create/useVerifyCollectiveCreation';

const CreateCollectiveSuccess: FC = () => {
  const { artworkUrl, artworkType } = useCreateState();
  const [collectiveArtwork, setCollectiveArtwork] = useState({
    _artworkType: NFTMediaType.IMAGE,
    _artworkUrl: ''
  });

  const onCollectiveCreated = async (artworkUrl, artworkType) => {
    setCollectiveArtwork({
      _artworkType: artworkType,
      _artworkUrl: artworkUrl
    });
  };

  useEffect(() => {
    if (artworkUrl && artworkType) {
      onCollectiveCreated(artworkUrl, artworkType);
    }
  }, [artworkUrl, artworkType]);

  return (
    <div className="bg-black w-full h-full pb-38">
      <CollectivesInteractiveBackground
        heightClass="h-full"
        mediaType={collectiveArtwork._artworkType}
        widthClass="w-full"
        floatingIcon={collectiveArtwork._artworkUrl}
        numberOfParticles={40}
      />
    </div>
  );
};

export default CreateCollectiveSuccess;

export const SuccessRightPanel: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { verifyCreation, collectiveIndexed } = useVerifyCollectiveCreation();

  const {
    web3Reducer: {
      web3: { activeNetwork }
    }
  } = useSelector((state: AppState) => state);
  const { name, creationStatus } = useCreateState();
  const [collectiveAddress, setCollectiveAddress] = useState<string | null>(
    null
  );
  const [collectiveName, setCollectiveName] = useState<string | null>('');

  const onCollectiveCreated = async (address: string) => {
    await setCollectiveAddress(address);
    await setCollectiveName(name);
    verifyCreation(address);
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
        name={collectiveName}
        loading={!collectiveIndexed}
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
