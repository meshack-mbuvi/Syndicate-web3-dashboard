import axios, { AxiosResponse } from 'axios';

export async function proxyGet<R>(path: string, params: unknown): Promise<AxiosResponse<R>> {
  return await axios.get(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/${path}`, {
    params
  });
}
