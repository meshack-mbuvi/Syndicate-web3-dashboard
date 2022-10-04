import {
  ClaimCollectivePass,
  WalletState
} from '@/components/collectives/claimCollectivePass';
import ConnectWallet from '@/components/connectWallet';
import { ProgressState } from '@/components/progressCard';
import ConnectWalletProvider from '@/context/ConnectWalletProvider';
import { store } from '@/state/index';
import { Provider } from 'react-redux';

export default {
  title: '4. Organisms/Collectives/Claim Pass',
  decorators: [
    (Story: any) => (
      <Provider store={store}>
        <ConnectWalletProvider>
          <Story />
          <ConnectWallet />
        </ConnectWalletProvider>
      </Provider>
    )
  ]
};

const Template = (args: any) => {
  return (
    <div className="">
      <ClaimCollectivePass {...args} />
    </div>
  );
};

export const ConnectedWallet = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
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
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
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
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
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
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
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
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
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
