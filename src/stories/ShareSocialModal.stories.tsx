import ConnectWalletProvider from '@/context/ConnectWalletProvider';
import ConnectWallet from '@/components/connectWallet';
import { Provider } from 'react-redux';
import { store } from '@/state/index';
import {
  CollectivesInteractiveBackground,
  FloatingIconMediaType
} from '@/components/collectives/interactiveBackground';
import { ShareSocialModal } from '@/components/distributions/shareSocialModal';

export default {
  title: '3. Molecules/Share Social Modal',
  decorators: [
    (Story) => (
      <Provider store={store}>
        <ConnectWalletProvider>
          <Story />
          <ConnectWallet />
        </ConnectWalletProvider>
      </Provider>
    )
  ]
};

const Template = (args) => {
  return <ShareSocialModal {...args} />;
};

export const Distributions = Template.bind({});
Distributions.args = {
  isModalVisible: true,
  handleClick: () => null,
  handleModalClose: () => null,
  socialURL: 'http://app.syndicate.io/clubs/123456789',
  description:
    'Just made an investment distribution for Alpha Beta Club (✺ABC) on Syndicate  🎉  Check our dashboard for details on how much you will be receiving.',
  buttonLabel: 'View on dashboard'
};

export const Collectives = Template.bind({});
Collectives.args = {
  isModalVisible: true,
  handleClick: () => null,
  handleModalClose: () => null,
  customVisual: (
    <div className="bg-black w-full h-full">
      <CollectivesInteractiveBackground
        heightClass="h-full"
        widthClass="w-full"
        floatingIcon="https://lh3.googleusercontent.com/kGd5K1UPnRVe2k_3na9U5IKsAKr2ERGHn6iSQwQBPGywEMcRWiKtFmUh85nuG0tBPKLVqaXsWqHKCEJidwa2w4oUgcITcJ7Kh-ObsA"
        numberOfParticles={75}
        mediaType={FloatingIconMediaType.IMAGE}
      />
    </div>
  ),
  socialURL: 'http://app.syndicate.io/clubs/123456789',
  description:
    'Just joined Alpha Beta Punks (✺ABP) by claiming the collective’s NFT on Syndicate 🎉',
  title: 'Welcome, Alpha Beta Punks #2001.',
  buttonLabel: (
    <div className="flex justify-center space-x-2">
      <div>View on Opensea</div>
      <img src="/images/nftClaim/opensea-black.svg" alt="Opensea" />
    </div>
  ),
  transactionHash:
    '0x5e3d4545afda8da89a6da42ec4793fd3c4b45972290ba45b83d095337880d796'
};
