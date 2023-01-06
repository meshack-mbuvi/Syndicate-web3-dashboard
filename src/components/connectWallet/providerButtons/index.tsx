import { SimpleTile, TileElevation } from '@/components/tile/simpleTile';
import { useConnectWalletContext } from '@/context/ConnectWalletProvider';

declare let window: any;

interface Props {
  elevation?: TileElevation;
  spaceBetweenYClass?: string;
  extraClasses?: string;
}

interface IProvider {
  isMetaMask: boolean;
  isCoinbaseWallet: boolean;
}

interface IProviderButtonOptions {
  name: string;
  icon: string;
  providerToActivate: () => void;
  hidden: boolean;
}

export const WalletProviderList: React.FC<Props> = ({
  elevation = TileElevation.TERTIARY,
  spaceBetweenYClass = 'space-y-4',
  extraClasses = ''
}) => {
  const { loadedAsSafeApp, connectWallet } = useConnectWalletContext();

  /**
   * This function is triggered when user clicks metamask button
   * The provider for metamask is named injected
   */
  const activateInjected = async (walletName?: string): Promise<void> => {
    if (connectWallet !== undefined) {
      await connectWallet('Injected', walletName);
    }
  };

  // WalletLink
  /**
   * This function is triggered when user clicks Coinbase button
   */
  const activateWalletLink = async (walletName?: string): Promise<void> => {
    if (connectWallet !== undefined) {
      await connectWallet('WalletLink', walletName);
    }
  };

  /**
   * This method is triggered when user clicks Gnosis Safe connect button.
   * It calls activateProvider passing gnosisSafeConnect as the parameters.
   *
   */
  const activateGnosisSafe = async (): Promise<void> => {
    if (connectWallet !== undefined) {
      await connectWallet('GnosisSafe');
    }
  };

  /**
   * This method is triggered when user clicks wallet connect button.
   * It calls activateProvider passing WalletConnect as the parameters.
   */
  const activateWalletConnect = async (): Promise<void> => {
    if (connectWallet !== undefined) {
      await connectWallet('WalletConnect', 'WalletConnect');
    }
  };

  // The providers supported are listed in here with their custom details
  const providersList: IProviderButtonOptions[] = [
    {
      name: 'Metamask',
      icon: '/images/metamaskIcon.svg',
      providerToActivate: (): void => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        const providers = window?.ethereum?.providers;
        // check whether coinbase extension is installed
        const metamaskWallet =
          // providers exists when you have more than one extensions installed.
          providers?.filter((provider: IProvider) => provider?.isMetaMask)[0] ||
          window?.ethereum?.isMetaMask;

        if (!metamaskWallet) {
          window?.open('https://metamask.io/download/', '_blank');
          return;
        }

        void activateInjected('Metamask');
      },
      hidden: !!loadedAsSafeApp
    },
    {
      name: 'Gnosis Safe',
      icon: '/images/gnosisSafe.png',
      providerToActivate: () => activateGnosisSafe(),
      hidden: !loadedAsSafeApp
    },
    {
      name: 'WalletConnect',
      icon: '/images/walletConnect.svg',
      providerToActivate: () => activateWalletConnect(),
      hidden: !!loadedAsSafeApp
    },
    {
      name: 'Coinbase Wallet',
      icon: '/images/coinbase-wallet.svg',
      providerToActivate: (): void => {
        void activateWalletLink('CoinbaseWallet');
      },
      hidden: !!loadedAsSafeApp
    }
  ];

  // Button for each provider
  const ProviderButton = ({
    name,
    icon,
    providerToActivate,
    hidden
  }: IProviderButtonOptions): JSX.Element => {
    if (!hidden) {
      return (
        <SimpleTile
          elevation={elevation}
          onClick={(): void => void providerToActivate()}
          addOn={
            <img
              alt="icon"
              src={icon}
              className="inline mw-6 sm:w-10 max-h-7"
            />
          }
        >
          {name}
        </SimpleTile>
      );
    }
    return <></>;
  };

  return (
    <>
      {/* Show wallet providers */}
      <div className={`${spaceBetweenYClass} ${extraClasses}`}>
        {providersList.map((provider, i) => (
          <ProviderButton {...provider} key={i} />
        ))}
      </div>
    </>
  );
};
