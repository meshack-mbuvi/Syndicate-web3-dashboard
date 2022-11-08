import { BlockExplorerLink } from '@/components/syndicates/shared/BlockExplorerLink';
import { syndicateActionConstants } from '@/components/syndicates/shared/Constants';
import { useConnectWalletContext } from '@/context/ConnectWalletProvider';
import { useGetClubNetwork } from '@/hooks/clubs/useGetClubNetwork';
import { useProvider } from '@/hooks/web3/useProvider';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FC } from 'react';
import { Spinner } from '../spinner';

interface Props {
  activeNetwork: {
    chainId: number;
  };
}
const Index: FC<Props> = ({ activeNetwork }) => {
  const router = useRouter();
  const {
    query: { clubAddress }
  } = router;

  const { noTokenTitleText } = syndicateActionConstants;

  const { switchNetworks } = useConnectWalletContext();
  const { providerName } = useProvider();
  const { urlNetwork, isLoading } = useGetClubNetwork();

  return (
    <div className="flex justify-center items-center h-full w-full mt-6 sm:mt-10">
      {isLoading ? (
        <div className="p-10">
          <Spinner />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center sm:w-7/12 md:w-5/12 rounded-custom p-10">
          <div className="w-full flex justify-center mb-6">
            <Image
              className="inline w-12"
              src="/images/syndicateStatusIcons/warning-triangle-gray.svg"
              alt="Warning"
              width={48}
              height={48}
            />
          </div>
          <p className="text-lg md:text-2xl text-center mb-3">
            {noTokenTitleText}
          </p>
          <BlockExplorerLink resourceId={clubAddress as string} />
          {urlNetwork?.chainId &&
          urlNetwork?.chainId !== activeNetwork?.chainId ? (
            <div
              className={`mt-5 flex justify-center flex-col w-full rounded-1.5lg p-6 bg-${urlNetwork.metadata.colors.background} bg-opacity-15`}
            >
              <div className="text-lg text-center mb-3">
                This club exists on {urlNetwork.name}
              </div>
              <div className="flex justify-center mb-3">
                <Image width={40} height={40} src={urlNetwork.logo} alt="" />
              </div>
              {providerName === 'WalletConnect' ? (
                <div className="text-sm text-center text-gray-syn3">
                  You&#39;re using WalletConnect. To switch networks, you&#39;ll
                  need to do so directly in your wallet.
                </div>
              ) : (
                <button
                  className="primary-CTA"
                  onClick={(): void => {
                    if (switchNetworks) {
                      switchNetworks(urlNetwork.chainId);
                    }
                  }}
                >
                  Switch to {urlNetwork.name}
                </button>
              )}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default Index;
