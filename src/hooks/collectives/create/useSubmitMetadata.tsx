// Pins data to IPFS and returns the hash
// ==============================================================

import { postMetadata } from '@/utils/api/collectives';
import useCreateState from './useCreateState';

const useSubmitMetadata = (
  beforeSubmit: () => void,
  onIpfsHash: (hash: string) => void,
  onSuccess: () => void,
  onError: () => void
) => {
  const { name, symbol, description, artwork } = useCreateState();

  const submit = async () => {
    beforeSubmit();
    metadataSubmission: try {
      const { IpfsHash, status } = await postMetadata({
        name,
        symbol,
        description,
        artwork
      });
      if (IpfsHash && status === 200) {
        await onIpfsHash(IpfsHash);
        break metadataSubmission;
      } else {
        onError();
      }
    } catch (e) {
      onError();
    }
    //after successful metadata submission
    onSuccess();
  };

  return {
    submit
  };
};

export default useSubmitMetadata;
