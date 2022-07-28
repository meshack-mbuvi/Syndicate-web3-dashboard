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

const useSubmitCollective = () => {
  const dispatch = useDispatch();
  const { submit: submitToContracts } = useSubmitToContracts();

  const beforeMetadataSubmission = () => {
    dispatch(setCollectiveSubmittingToIPFS(true));
  };

  const onIpfsHash = (hash: string) => {
    dispatch(setIpfsHash(hash));
  };

  const onIpfsError = () => {
    dispatch(setIpfsError(true));
  };

  const { submit: submitMetadata } = useSubmitMetadata(
    beforeMetadataSubmission,
    onIpfsHash,
    submitToContracts,
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
