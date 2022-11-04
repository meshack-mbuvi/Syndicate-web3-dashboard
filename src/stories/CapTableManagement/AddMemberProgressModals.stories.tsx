import { ProgressState } from '@/components/progressCard';
import { ProgressModal } from '@/components/progressModal';
import { formatAddress } from '@/utils/formatAddress';
import ConnectWalletProvider from '@/context/ConnectWalletProvider';
import ConnectWallet from '@/components/connectWallet';
import { Provider } from 'react-redux';
import { store } from '@/state/index';

export default {
  title: '4. Organisms/Cap Table Management/Modals/Add Member/Progress Modals',
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
  description: 'Please confirm the club token mint in your wallet.',
  state: ProgressState.CONFIRM
};

export const Pending = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Pending.args = {
  isVisible: true,
  title: 'Adding member',
  description:
    'This could take anywhere from seconds to hours depending on network congestion and the gas fees you set. You can safely leave this page while you wait.',
  transactionHash: dummyTransactionHash,
  transactionType: 'transaction',
  state: ProgressState.PENDING
};

export const Success = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Success.args = {
  isVisible: true,
  title: 'Member added successfully',
  description: `${formatAddress(
    '0x2502947319f2166eF46f0a7c081D23C63f88112B',
    6,
    4
  )} has been added as a member of this club.`,
  buttonLabel: 'Done',
  buttonFullWidth: true,
  state: ProgressState.SUCCESS,
  transactionHash: dummyTransactionHash,
  transactionType: 'transaction'
};

export const Failure = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Failure.args = {
  isVisible: true,
  title: 'Member addition failed',
  description: '',
  buttonLabel: 'Close',
  buttonFullWidth: true,
  state: ProgressState.FAILURE,
  transactionHash: dummyTransactionHash,
  transactionType: 'transaction'
};
