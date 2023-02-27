import { CollectiveMetadata } from '@/hooks/collectives/utils/types';
import axios, { AxiosResponse } from 'axios';

const ipfsGateway = 'https://syndicate.mypinata.cloud/ipfs/';

export const getJson = async (
  metadataCid: string
): Promise<CollectiveMetadata> => {
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
  // putting this 'hash' check here because I noticed there are some
  // test collectives with the value set to an actual 'hash'
  if (metadataCid && metadataCid !== 'hash') {
    mediaData = await getJson(metadataCid);
  }

  return mediaData;
};
