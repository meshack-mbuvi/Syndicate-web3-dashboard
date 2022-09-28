// Pins data to IPFS and returns the hash
// ==============================================================

import { NFTMediaType } from '@/components/collectives/nftPreviewer';
import { postMetadata } from '@/utils/api/collectives';

const useSubmitMetadata = (
  beforeSubmit: () => void,
  onIpfsHash: (hash: string) => void,
  onSuccess: () => void,
  onError: () => void
): any => {
  const submit = async (
    name: any,
    symbol: any,
    description: any,
    artwork: any,
    artworkType: any,
    artworkUrl: any
  ) => {
    let error = false;
    beforeSubmit();
    metadataSubmission: try {
      let file: File = artwork;
      if (artworkType === NFTMediaType.CUSTOM) {
        // Here we need to convert the base64 url to a file before handing to pinata
        file = await fetch(artworkUrl)
          .then((res) => res.blob())
          .then(
            (blob) => new File([blob], `${name}-media`, { type: 'image/png' })
          );
      }
      const { IpfsHash, status } = await postMetadata({
        name,
        symbol,
        description,
        file
      });
      if (IpfsHash && status === 200) {
        onIpfsHash(IpfsHash);
        break metadataSubmission;
      } else {
        onError();
        error = true;
      }
    } catch (e) {
      onError();
      error = true;
    }

    // after successful metadata submission
    if (!error) {
      onSuccess();
    }
  };

  return {
    submit
  };
};

export default useSubmitMetadata;
