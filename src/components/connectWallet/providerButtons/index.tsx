import { SimpleTile, TileElevation } from '@/components/tile/simpleTile';
import { useConnectWalletContext } from '@/context/ConnectWalletProvider';

interface Props {
  elevation?: TileElevation;
  spaceBetweenYClass?: string;
  extraClasses?: string;
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
  const activateInjected = async (walletName?: string) => {
    if (connectWallet !== undefined) {
      await connectWallet('Injected', walletName);
    }
  };

  /**
   * This method is triggered when user clicks Gnosis Safe connect button.
   * It calls activateProvider passing gnosisSafeConnect as the parameters.
   *
   */
  const activateGnosisSafe = async () => {
    // @ts-expect-error TS(2722): Cannot invoke an object which is possibly 'undefin... Remove this comment to see the full error message
    // eslint-disable-next-line @typescript-eslint/await-thenable
    await connectWallet('GnosisSafe');
  };

  /**
   * This method is triggered when user clicks wallet connect button.
   * It calls activateProvider passing WalletConnect as the parameters.
   */
  const activateWalletConnect = async () => {
    // @ts-expect-error TS(2722): Cannot invoke an object which is possibly 'undefin... Remove this comment to see the full error message
    await connectWallet('WalletConnect', 'WalletConnect');
  };

  // The providers supported are listed in here with their custom details
  const providersList = [
    {
      name: 'Metamask',
      icon: '/images/metamaskIcon.svg',
      // @ts-expect-error TS(7030): Not all code paths return a value.
      providerToActivate: () => {
        // check whether coinbase extension is installed
        const metamaskWallet =
          // providers exists when you have more than one extensions installed.
          window?.ethereum?.providers?.filter(
            (provider: any) => provider?.isMetaMask
          )[0] || window?.ethereum?.isMetaMask;

        if (!metamaskWallet) {
          return window.open('https://metamask.io/download/', '_blank');
        }

        activateInjected('Metamask');
      },
      hidden: loadedAsSafeApp
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
      hidden: loadedAsSafeApp
    }
    // TODO: This is a temporary workaround due to an infinite loop when trying
    // to connect to Coinbase Wallet. Once this bug is fixed, we can uncomment
    // this
    // {
    //   name: 'Coinbase Wallet',
    //   icon: '/images/coinbase-wallet.svg',
    //   // @ts-expect-error TS(7030): Not all code paths return a value.
    //   providerToActivate: () => {
    //     // check whether coinbase extension is installed
    //     const coinbaseWallet =
    //       window?.ethereum?.providers?.filter(
    //         (provider: any) => provider?.isCoinbaseWallet
    //       )[0] || window?.ethereum?.isCoinbaseWallet;

    //     if (!coinbaseWallet) {
    //       return window.open(
    //         'https://www.coinbase.com/wallet/getting-started-extension',
    //         '_blank'
    //       );
    //     }
    //     activateInjected('Coinbase Wallet');
    //   },
    //   hidden: loadedAsSafeApp
    // }
  ];

  // Button for each provider
  const ProviderButton = ({ name, icon, providerToActivate, hidden }: any) => {
    if (!hidden) {
      return (
        <SimpleTile
          elevation={elevation}
          onClick={() => providerToActivate()}
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
    return null;
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
