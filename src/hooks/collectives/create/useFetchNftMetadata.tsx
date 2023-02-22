import { getCollectiveMedia } from '@/hooks/collectives/utils/helpers';
import { CollectiveMetadata } from '@/hooks/collectives/utils/types';
import { useQuery, UseQueryResult } from '@tanstack/react-query';

const useFetchCollectiveMetadata = (
  metadataCid?: string
): UseQueryResult<CollectiveMetadata> => {
  return useQuery(
    ['nftMetadata', metadataCid],
    () => getCollectiveMedia(metadataCid ?? ''),
    {
      enabled: metadataCid !== undefined
    }
  );
};

export default useFetchCollectiveMetadata;
