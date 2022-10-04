import React, { FC, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { CollectivesCreateSuccess } from '@/components/collectives/create/success';
import { useCreateState } from '@/hooks/collectives/useCreateCollective';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '@/state';
import { partialCollectiveCreationStateReset } from '@/state/createCollective/slice';

interface SuccessRightPanelProps {
  extraClasses?: string;
}
import { CollectivesInteractiveBackground } from '@/components/collectives/interactiveBackground';
import { amplitudeLogger, Flow } from '@/components/amplitude';
import { MANAGE_DASHBOARD_CLICK } from '@/components/amplitude/eventNames';

export const CreateCollectiveSuccess: FC = () => {
  const { creationReceipt } = useCreateState();

  return (
    <div className="bg-black w-full h-full pb-38">
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
  const [collectiveAddress, setCollectiveAddress] = useState<string | null>(
    null
  );
  const [collectiveName, setCollectiveName] = useState<string | null>('');

  const onCollectiveCreated = async () => {
    await setCollectiveAddress(creationReceipt.collective);
    await setCollectiveName(creationReceipt.name);
    dispatch(partialCollectiveCreationStateReset());
  };

  useEffect(() => {
    if (creationReceipt.collective) {
      onCollectiveCreated();
    }
  }, [creationReceipt.collective]);

  const collectiveURL = useMemo(() => {
    return `${window.location.origin}/collectives/${collectiveAddress}?chain=${activeNetwork.network}`;
  }, [collectiveAddress]);

  const CTAOnClick = () => {
    router.push(
      `/collectives/${collectiveAddress}${'?chain=' + activeNetwork.network}`
    );
    amplitudeLogger(MANAGE_DASHBOARD_CLICK, {
      flow: Flow.COLLECTIVE_CREATE
    });
  };

  return (
    <div
      className={`flex w-full h-full items-center justify-center ${extraClasses}`}
    >
      <CollectivesCreateSuccess
        // @ts-expect-error TS(2322): Type 'null' is not assignable to type 'st... Remove this comment to see the full error message
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
