import { useQuery, UseQueryResult } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';

const ipfsGateway = 'https://syndicate.mypinata.cloud/ipfs/';

// We want to be in compliance with opensea standards: https://docs.opensea.io/docs/metadata-standards
export interface CollectiveMetadata {
  name: string;
  symbol: string;
  description: string;
  media: string;
  image?: string; // one of these two will be present, based on video/image file type
  animation_url?: string;
}

export const getJson = async (
  metadataCid: string
): Promise<CollectiveMetadata> => {
  const url = metadataCid.replace('ipfs://', '');
  return axios
    .get<any, AxiosResponse<CollectiveMetadata>>(ipfsGateway + url)
    .then((res) => res.data);
};

const useFetchCollectiveMetadata = (
  metadataCid?: string
): UseQueryResult<CollectiveMetadata> => {
  // @ts-expect-error TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
  return useQuery(['nftMetadata', metadataCid], () => getJson(metadataCid), {
    enabled: metadataCid !== undefined
  });
};

export default useFetchCollectiveMetadata;
