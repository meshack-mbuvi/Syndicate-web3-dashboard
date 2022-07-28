import { AxiosResponse } from 'axios';
import { proxyPost } from '.';

export async function postMetadata(data): Promise<any> {
  const form = new FormData();
  form.append('file', data.artwork);
  form.append('name', data.name);
  form.append('description', data.description);
  form.append('symbol', data.symbol);

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
