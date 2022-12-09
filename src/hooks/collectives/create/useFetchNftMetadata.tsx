import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { CollectiveMetadata } from '@/hooks/collectives/utils/types';
import { getJson } from '@/hooks/collectives/utils/helpers';

const useFetchCollectiveMetadata = (
  metadataCid?: string
): UseQueryResult<CollectiveMetadata> => {
  // @ts-expect-error TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
  return useQuery(['nftMetadata', metadataCid], () => getJson(metadataCid), {
    enabled: metadataCid !== undefined
  });
};

export default useFetchCollectiveMetadata;
