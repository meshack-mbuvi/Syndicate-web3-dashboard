import { CollectiveMetadata } from '@/hooks/collectives/utils/types';
import { isIPFSHash } from '@/utils/stringUtils';
import axios, { AxiosResponse } from 'axios';

const ipfsGateway = 'https://syndicate.mypinata.cloud/ipfs/';

const getJson = async (metadataCid: string): Promise<CollectiveMetadata> => {
  const url = metadataCid.replace('ipfs://', '');
  return axios
    .get<any, AxiosResponse<CollectiveMetadata>>(ipfsGateway + url)
    .then((res) => res.data);
};

// get media info for a collective
export const getCollectiveMedia = async (
  metadataCid: string
): Promise<CollectiveMetadata | null> => {
  let mediaData = null;
  if (isIPFSHash(metadataCid)) {
    mediaData = await getJson(metadataCid);
  }

  return mediaData;
};
