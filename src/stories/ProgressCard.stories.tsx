import { ProgressCard, ProgressState } from '@/components/progressCard';
import ConnectWalletProvider from '@/context/ConnectWalletProvider';
import ConnectWallet from '@/components/connectWallet';
import { Provider } from 'react-redux';
import { store } from '@/state/index';

export default {
  title: '3. Molecules/Progress Card',
  argTypes: {
    state: {
      options: [
        ProgressState.FAILURE,
        ProgressState.PENDING,
        ProgressState.SUCCESS,
        ProgressState.CONFIRM
      ],
      control: { type: 'select' }
    }
  },
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

const Template = (args) => <ProgressCard {...args} />;

export const ConfirmInWallet = Template.bind({});
ConfirmInWallet.args = {
  title: 'Confirm in wallet',
  description: 'Confirm the modification of club settings in your wallet',
  state: ProgressState.CONFIRM
};

export const Pending = Template.bind({});
Pending.args = {
  title: 'Pending confirmation',
  description:
    'This could take up to a few minutes depending on network congestion and the gas fees you set. Feel free to leave this screen.',
  blockExplorerLink: '#',
  buttonLabel: 'Back to club dashboard',
  state: ProgressState.PENDING,
  transactionHash:
    '0x5e3d4545afda8da89a6da42ec4793fd3c4b45972290ba45b83d095337880d796',
  transactionType: 'transaction'
};

export const Success = Template.bind({});
Success.args = {
  title: 'Transaction failed',
  description: 'Please try again and let us know if the issue persists.',
  buttonLabel: 'Back to club dashboard',
  state: ProgressState.SUCCESS,
  transactionHash:
    '0x5e3d4545afda8da89a6da42ec4793fd3c4b45972290ba45b83d095337880d796',
  transactionType: 'transaction'
};

export const Failure = Template.bind({});
Failure.args = {
  title: 'Transaction failed',
  description: 'Please try again and let us know if the issue persists.',
  buttonLabel: 'Try again',
  state: ProgressState.FAILURE,
  transactionHash:
    '0x5e3d4545afda8da89a6da42ec4793fd3c4b45972290ba45b83d095337880d796',
  transactionType: 'transaction'
};
