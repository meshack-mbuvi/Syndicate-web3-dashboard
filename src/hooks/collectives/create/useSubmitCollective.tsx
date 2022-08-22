// Collective submission hook
// ==============================================================
import useSubmitMetadata from './useSubmitMetadata';
import useSubmitToContracts from './useSubmitToContracts';
import {
  setCollectiveSubmittingToIPFS,
  setIpfsError,
  setIpfsHash
} from '@/state/createCollective/slice';
import { useDispatch } from 'react-redux';
import useCreateState from './useCreateState';
import { useEffect } from 'react';

const useSubmitCollective = () => {
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

  const beforeMetadataSubmission = () => {
    dispatch(setCollectiveSubmittingToIPFS(true));
  };

  const onIpfsHash = (hash: string) => {
    dispatch(setIpfsHash(hash));
  };

  const onIpfsError = () => {
    dispatch(setIpfsError(true));
  };

  useEffect(() => {
    if (ipfsHash) {
      submitToContracts();
    }
  }, [ipfsHash]);

  const { submit: submitMetadata } = useSubmitMetadata(
    beforeMetadataSubmission,
    onIpfsHash,
    () => {},
    onIpfsError
  );

  // Create collective
  const handleSubmit = () => {
    submitMetadata(name, symbol, description, artwork, artworkType, artworkUrl);
  };

  return {
    handleSubmit
  };
};

export default useSubmitCollective;
