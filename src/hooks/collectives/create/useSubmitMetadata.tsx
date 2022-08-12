// Pins data to IPFS and returns the hash
// ==============================================================

import { postMetadata } from '@/utils/api/collectives';
import { useEffect, useState } from 'react';
import useCreateState from './useCreateState';

const useSubmitMetadata = (
  beforeSubmit: () => void,
  onIpfsHash: (hash: string) => void,
  onSuccess: () => void,
  onError: () => void
) => {
  const { name, symbol, description, artwork } = useCreateState();

  const submit = async () => {
    let error = false;
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
        error = true;
      }
    } catch (e) {
      onError();
      error = true;
    }

    //after successful metadata submission
    if (!error) {
      onSuccess();
    }
  };

  return {
    submit
  };
};

export default useSubmitMetadata;
