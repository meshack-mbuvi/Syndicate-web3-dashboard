import { BlockExplorerLink } from '@/components/syndicates/shared/BlockExplorerLink';
import { useConnectWalletContext } from '@/context/ConnectWalletProvider';
import { useGetNetwork } from '@/hooks/web3/useGetNetwork';
import { useProvider } from '@/hooks/web3/useProvider';
import { AppState } from '@/state';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const TokenEmptyState: React.FC<{
  tokenTitle: string;
  tokenAddress: string;
}> = ({ tokenTitle, tokenAddress }) => {
  const {
    web3Reducer: {
      web3: { activeNetwork, web3 }
    }
  } = useSelector((state: AppState) => state);

  const { switchNetworks } = useConnectWalletContext();
  const { providerName } = useProvider();
  const [urlNetwork, setUrlNetwork] = useState<any>(null);

  const router = useRouter();
  const { chain } = router.query;

  useEffect(() => {
    if (chain) {
      GetNetworkByName(chain);
    }
  }, [chain]);

  const GetNetworkByName = (name: any) => {
    const network = useGetNetwork(name);
    setUrlNetwork(network);
  };

  const isValidAddress = web3.utils.isAddress(tokenAddress);

  return (
    <div className="flex justify-center items-center h-full w-full mt-6 sm:mt-10">
      <div className="flex flex-col items-center justify-center sm:w-7/12 md:w-5/12 rounded-custom p-10">
        <div className="w-full flex justify-center mb-6">
          <img
            className="inline w-12"
            src="/images/syndicateStatusIcons/warning-triangle-gray.svg"
            alt="Warning"
          />
        </div>
        <p className="text-lg md:text-2xl text-center mb-3">
          {isValidAddress
            ? `No ${tokenTitle} found at that address.`
            : `Invalid ${tokenTitle} address`}
        </p>
        {isValidAddress ? (
          <BlockExplorerLink resourceId={tokenAddress} />
        ) : null}
        {urlNetwork?.chainId &&
        urlNetwork?.chainId !== activeNetwork?.chainId ? (
          <div
            className={`mt-5 flex justify-center flex-col w-full rounded-1.5lg p-6 bg-${activeNetwork.metadata.colors.background} bg-opacity-15`}
          >
            <div className="text-lg text-center mb-3">
              This {tokenTitle} exists on {urlNetwork.name}
            </div>
            <div className="flex justify-center mb-3">
              <img width={40} height={40} src={urlNetwork.logo} alt="" />
            </div>
            {providerName === 'WalletConnect' ? (
              <div className="text-sm text-center text-gray-syn3">
                You&#39;re using WalletConnect. To switch networks, you&#39;ll
                need to do so directly in your wallet.
              </div>
            ) : (
              <button
                className="primary-CTA"
                onClick={() => {
                  // @ts-expect-error TS(2722): Cannot invoke an object which is possibly 'undefined'.
                  switchNetworks(urlNetwork.chainId);
                }}
              >
                Switch to {urlNetwork.name}
              </button>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default TokenEmptyState;
