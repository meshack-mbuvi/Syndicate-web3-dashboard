import axios from "axios";
import { isDev } from "@/utils/environment";

const baseURL = isDev
  ? "https://us-central1-secret-shell-323016.cloudfunctions.net/api-proxy"
  : "https://us-central1-syndicate-production.cloudfunctions.net/api-proxy";

export const proxyGet = async (path: string, params: any) => {
    return await axios.get(`${baseURL}/${path}`, {
        params,
      });
};
