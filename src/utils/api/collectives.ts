import { AxiosResponse } from 'axios';
import { proxyPost } from '.';

interface ICollectiveMetadata {
  file: File;
  name: string;
  description: string;
  symbol: string;
}

export async function postMetadata({
  file,
  name,
  description,
  symbol
}: ICollectiveMetadata): Promise<any> {
  const form = new FormData();
  form.append('file', file);
  form.append('name', name);
  form.append('description', description);
  form.append('symbol', symbol);

  const config = {
    headers: {
      'content-type': 'multipart/form-data'
    }
  };
  const result: AxiosResponse<any> = await proxyPost(
    'collectives/pin_metadata',
    form,
    config
  );
  return { IpfsHash: result.data.json.IpfsHash, status: result.status };
}
