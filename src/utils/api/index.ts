import axios from 'axios';

export const proxyGet = async (path: string, params: any) => {
  return await axios.get(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/${path}`, {
    params
  });
};
