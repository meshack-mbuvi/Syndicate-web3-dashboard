// Collective submission hook
// ==============================================================
import { amplitudeLogger, Flow } from '@/components/amplitude';
import { LAUNCH_CLICK } from '@/components/amplitude/eventNames';
import {
  setCollectiveSubmittingToIPFS,
  setIpfsError,
  setIpfsHash
} from '@/state/createCollective/slice';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import useCreateState from './useCreateState';
import useSubmitMetadata from './useSubmitMetadata';
import useSubmitToContracts from './useSubmitToContracts';

const useSubmitCollective = (): {
  handleSubmit: () => void;
} => {
  const dispatch = useDispatch();
  const { submit: submitToContracts } = useSubmitToContracts();
  const {
    name,
    symbol,
    description,
    artwork,
    artworkType,
    artworkUrl,
    creationStatus: { ipfsHash }
  } = useCreateState();

  const beforeMetadataSubmission = (): void => {
    dispatch(setCollectiveSubmittingToIPFS(true));
  };

  const onIpfsHash = (hash: string): void => {
    dispatch(setIpfsHash(hash));
  };

  const onIpfsError = (): void => {
    dispatch(setIpfsError(true));
  };

  useEffect(() => {
    if (ipfsHash) {
      void submitToContracts();
    }
  }, [ipfsHash]);

  const { submit: submitMetadata } = useSubmitMetadata(
    beforeMetadataSubmission,
    onIpfsHash,
    () => '',
    onIpfsError
  );

  // Create collective
  const handleSubmit = (): void => {
    void submitMetadata(
      name,
      symbol,
      description,
      artwork,
      artworkType,
      artworkUrl
    );
    void amplitudeLogger(LAUNCH_CLICK, {
      flow: Flow.COLLECTIVE_CREATE
    });
  };

  return {
    handleSubmit
  };
};

export default useSubmitCollective;
