import {
  ClaimCollectivePass,
  WalletState
} from '@/components/collectives/claimCollectivePass';
import { ProgressState } from '@/components/progressCard';
import ConnectWalletProvider from '@/context/ConnectWalletProvider';
import ConnectWallet from '@/components/connectWallet';
import { Provider } from 'react-redux';
import { store } from '@/state/index';

export default {
  title: '4. Organisms/Collectives/Claim Pass',
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
  return (
    <div className="">
      <ClaimCollectivePass {...args} />
    </div>
  );
};

export const ConnectedWallet = Template.bind({});
ConnectedWallet.args = {
  links: { openSea: '/', externalLink: '/' },
  numberOfExistingMembers: 8000,
  nameOfCollective: 'Alpha Beta Punks',
  dateOfCreation: 'Apr 20, 2022',
  nameOfCreator: '0x1a2b...3c4d',
  remainingPasses: 2000,
  priceToJoin: { tokenAmount: 0.08, tokenSymbol: 'ETH', fiatAmount: 141.78 },
  walletState: WalletState.CONNECTED,
  gasEstimate: {
    tokenAmount: 0.015,
    tokenSymbol: 'ETH',
    fiatAmount: 56.78
  }
};

export const WrongWallet = Template.bind({});
WrongWallet.args = {
  links: { openSea: '/', externalLink: '/' },
  numberOfExistingMembers: 8000,
  nameOfCollective: 'Alpha Beta Punks',
  dateOfCreation: 'Apr 20, 2022',
  nameOfCreator: '0x1a2b...3c4d',
  remainingPasses: 2000,
  priceToJoin: { tokenAmount: 0.08, tokenSymbol: 'ETH', fiatAmount: 141.78 },
  walletState: WalletState.WRONG_WALLET,
  walletAddress: '0x1a2b...3c4d'
};

export const DisconnectedWallet = Template.bind({});
DisconnectedWallet.args = {
  links: { openSea: '/', externalLink: '/' },
  numberOfExistingMembers: 8000,
  nameOfCollective: 'Alpha Beta Punks',
  dateOfCreation: 'Apr 20, 2022',
  nameOfCreator: '0x1a2b...3c4d',
  remainingPasses: 2000,
  priceToJoin: { tokenAmount: 0.08, tokenSymbol: 'ETH', fiatAmount: 141.78 },
  walletState: WalletState.NOT_CONNECTED
};

export const Pending = Template.bind({});
Pending.args = {
  links: { openSea: '/', externalLink: '/' },
  numberOfExistingMembers: 8000,
  nameOfCollective: 'Alpha Beta Punks',
  dateOfCreation: 'Apr 20, 2022',
  nameOfCreator: '0x1a2b...3c4d',
  remainingPasses: 2000,
  priceToJoin: { tokenAmount: 0.08, tokenSymbol: 'ETH', fiatAmount: 141.78 },
  walletState: WalletState.CONNECTED,
  progressState: ProgressState.PENDING,
  transactionHash:
    '0x5e3d4545afda8da89a6da42ec4793fd3c4b45972290ba45b83d095337880d796',
  transactionType: 'transaction'
};

export const MaxReached = Template.bind({});
MaxReached.args = {
  links: { openSea: '/', externalLink: '/' },
  numberOfExistingMembers: 8000,
  nameOfCollective: 'Alpha Beta Punks',
  dateOfCreation: 'Apr 20, 2022',
  nameOfCreator: '0x1a2b...3c4d',
  remainingPasses: 2000,
  priceToJoin: { tokenAmount: 0.08, tokenSymbol: 'ETH', fiatAmount: 141.78 },
  walletState: WalletState.MAX_PASSES_REACHED
};
