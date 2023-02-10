import { getJson } from '@/hooks/collectives/utils/helpers';
import { CollectiveMetadata } from '@/hooks/collectives/utils/types';
import { useQuery, UseQueryResult } from '@tanstack/react-query';

const useFetchCollectiveMetadata = (
  metadataCid?: string
): UseQueryResult<CollectiveMetadata> => {
  return useQuery(
    ['nftMetadata', metadataCid],
    () => getJson(metadataCid ?? ''),
    {
      enabled: metadataCid !== undefined
    }
  );
};

export default useFetchCollectiveMetadata;
