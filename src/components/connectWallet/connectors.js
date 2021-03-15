import { InjectedConnector } from "@web3-react/injected-connector";
// import { NetworkConnector } from "@web3-react/network-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

const POLLING_INTERVAL = 12000;
const RPC_URLS = {
  1: process.env.GATSBY_INFURA_ID,
};

export const injected = new InjectedConnector({
  supportedChainIds: [
    1, // Mainet
    3, // Ropsten
    4, // Rinkeby
    5, // Goerli
    42, // Kovan,
    1337, // localhost
    5777,
  ],
});

export const WalletConnect = new WalletConnectConnector({
  rpc: { 1: RPC_URLS[1] },
  bridge: "https://bridge.walletconnect.org",
  qrcode: true,
  pollingInterval: POLLING_INTERVAL,
});

/**
 * We are using wallet connect to connect to Gnosis safe.
 * NOTE: The return chain Id from gnosis connect is 4.
 * Will link documentation when I get it
 */
export const gnosisSafeConnect = new WalletConnectConnector({
  rpc: { 4: RPC_URLS[1] },
  qrcode: true,
  pollingInterval: POLLING_INTERVAL,
});
