import {
  ClaimCollectivePass,
  WalletState
} from '@/components/collectives/claimCollectivePass';

export default {
  title: '4. Organisms/Collectives/Claim Pass'
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
  walletState: WalletState.CONNECTED
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
  walletState: WalletState.WRONG_WALLET
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
