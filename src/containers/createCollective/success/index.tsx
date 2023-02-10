import { amplitudeLogger, Flow } from '@/components/amplitude';
import { MANAGE_DASHBOARD_CLICK } from '@/components/amplitude/eventNames';
import { CollectivesCreateSuccess } from '@/components/collectives/create/success';
import { CollectivesInteractiveBackground } from '@/components/collectives/interactiveBackground';
import { useCreateState } from '@/hooks/collectives/useCreateCollective';
import { AppState } from '@/state';
import { partialCollectiveCreationStateReset } from '@/state/createCollective/slice';
import { useRouter } from 'next/router';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

interface SuccessRightPanelProps {
  extraClasses?: string;
}

export const CreateCollectiveSuccess: FC = () => {
  const { creationReceipt } = useCreateState();

  return (
    <div className="bg-gray-syn9 w-full h-full pb-38">
      <CollectivesInteractiveBackground
        heightClass="h-full"
        mediaType={creationReceipt.artworkType}
        widthClass="w-full"
        floatingIcon={creationReceipt.artworkUrl}
        numberOfParticles={40}
        customId={'particles-js-4'}
      />
    </div>
  );
};

export const SuccessRightPanel: React.FC<SuccessRightPanelProps> = ({
  extraClasses
}) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const {
    web3Reducer: {
      web3: { activeNetwork }
    }
  } = useSelector((state: AppState) => state);

  const { creationReceipt } = useCreateState();
  const [collectiveAddress, setCollectiveAddress] = useState<string>('');
  const [collectiveName, setCollectiveName] = useState<string>('');

  const onCollectiveCreated = async (): Promise<void> => {
    await setCollectiveAddress(creationReceipt.collective);
    await setCollectiveName(creationReceipt.name);
    dispatch(partialCollectiveCreationStateReset());
  };

  useEffect(() => {
    if (creationReceipt.collective) {
      void onCollectiveCreated();
    }
  }, [creationReceipt.collective]);

  const collectiveURL = useMemo(() => {
    return `${window.location.origin}/collectives/${collectiveAddress}?chain=${activeNetwork.network}`;
  }, [collectiveAddress]);

  const CTAOnClick = (): void => {
    void router.push(
      `/collectives/${collectiveAddress}${'?chain=' + activeNetwork.network}`
    );
    void amplitudeLogger(MANAGE_DASHBOARD_CLICK, {
      flow: Flow.COLLECTIVE_CREATE
    });
  };

  return (
    <div
      className={`flex w-full h-full items-center justify-center ${extraClasses}`}
    >
      <CollectivesCreateSuccess
        name={collectiveName}
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
