import { ProgressState } from '@/components/progressCard';
import { ProgressModal } from '@/components/progressModal';
import ConnectWalletProvider from '@/context/ConnectWalletProvider';
import ConnectWallet from '@/components/connectWallet';
import { Provider } from 'react-redux';
import { store } from '@/state/index';

export default {
  title: '4. Organisms/Modify Club Settings/Progress Modal',
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

const Template = (args) => <ProgressModal {...args} />;

export const ConfirmInWallet = Template.bind({});
ConfirmInWallet.args = {
  isVisible: true,
  title: 'Confirm in wallet',
  description: 'Confirm the modification of club settings in your wallet',
  state: ProgressState.CONFIRM
};

export const Pending = Template.bind({});
Pending.args = {
  isVisible: true,
  title: 'Pending confirmation',
  description:
    'This could take up to a few minutes depending on network congestion and the gas fees you set. Feel free to leave this screen.',
  blockExplorerLink: '#',
  buttonLabel: 'Back to club dashboard',
  state: ProgressState.PENDING,
  transactionHash: '#',
  transactionType: 'transaction'
};

export const Success = Template.bind({});
Success.args = {
  isVisible: true,
  title: 'Transaction failed',
  description: 'Please try again and let us know if the issue persists.',
  buttonLabel: 'Back to club dashboard',
  state: ProgressState.SUCCESS,
  transactionHash: '#',
  transactionType: 'transaction'
};

export const Failure = Template.bind({});
Failure.args = {
  isVisible: true,
  title: 'Transaction failed',
  description: 'Please try again and let us know if the issue persists.',
  buttonLabel: 'Try again',
  state: ProgressState.FAILURE,
  transactionHash: '#',
  transactionType: 'transaction'
};
