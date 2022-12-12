import { ProgressState } from '@/components/progressCard';
import { ProgressModal } from '@/components/progressModal';
import ConnectWalletProvider from '@/context/ConnectWalletProvider';
import ConnectWallet from '@/components/connectWallet';
import { Provider } from 'react-redux';
import { store } from '@/state/index';

export default {
  title:
    '3. Molecules/Cap Table Management/Modals/Add Member/Close Club Progress Modals',
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
  return <ProgressModal {...args} />;
};

const dummyTransactionHash =
  '0x73c6d6135a13da9164252200d5052ddb5095a2694e88e38356245063fa65d287';

export const ConfirmInWallet = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
ConfirmInWallet.args = {
  isVisible: true,
  title: 'Confirm in wallet',
  description: 'Confirm the modification of club settings in your wallet.',
  state: ProgressState.CONFIRM
};

export const Pending = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Pending.args = {
  isVisible: true,
  title: 'Closing your club',
  description:
    'This could take anywhere from seconds to hours depending on network congestion and the gas fees you set. You can safely leave this page while you wait.',
  etherscanHash: dummyTransactionHash,
  transactionType: 'transaction',
  state: ProgressState.PENDING
};

export const Success = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Success.args = {
  isVisible: true,
  title: 'Your club is now closed to deposits',
  buttonLabel: 'Done',
  buttonOnClick: () => {
    return;
  },
  buttonFullWidth: false,
  state: ProgressState.SUCCESS
};

export const Failure = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Failure.args = {
  isVisible: true,
  title: 'Your club could not be closed',
  description: '',
  buttonLabel: 'Close',
  buttonOnClick: () => {
    return;
  },
  buttonFullWidth: true,
  state: ProgressState.FAILURE,
  etherscanHash: dummyTransactionHash,
  transactionType: 'transaction'
};
