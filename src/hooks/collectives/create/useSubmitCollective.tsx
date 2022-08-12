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
    submitMetadata();
  };

  return {
    handleSubmit
  };
};

export default useSubmitCollective;
