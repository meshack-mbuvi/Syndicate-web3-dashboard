import { ProgressModal, ProgressModalState } from '@/components/progressModal';
import { formatAddress } from '@/utils/formatAddress';

export default {
  title: '4. Organisms/Cap Table Management/Modals/Add Member/Progress Modals',
  argTypes: {
    state: {
      options: [
        ProgressModalState.FAILURE,
        ProgressModalState.PENDING,
        ProgressModalState.SUCCESS,
        ProgressModalState.CONFIRM
      ],
      control: { type: 'select' }
    }
  }
};

const Template = (args) => {
  return <ProgressModal {...args} />;
};

const dummyTransactionHash =
  '0x73c6d6135a13da9164252200d5052ddb5095a2694e88e38356245063fa65d287';

export const ConfirmInWallet = Template.bind({});
ConfirmInWallet.args = {
  isVisible: true,
  title: 'Confirm in wallet',
  description: 'Please confirm the club token mint in your wallet.',
  state: ProgressModalState.CONFIRM
};

export const Pending = Template.bind({});
Pending.args = {
  isVisible: true,
  title: 'Adding member',
  description:
    'This could take anywhere from seconds to hours depending on network congestion and the gas fees you set. You can safely leave this page while you wait.',
  etherscanHash: dummyTransactionHash,
  transactionType: 'transaction',
  state: ProgressModalState.PENDING
};

export const Success = Template.bind({});
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
  state: ProgressModalState.SUCCESS,
  etherscanHash: dummyTransactionHash,
  transactionType: 'transaction'
};

export const Failure = Template.bind({});
Failure.args = {
  isVisible: true,
  title: 'Member addition failed',
  description: '',
  buttonLabel: 'Close',
  buttonFullWidth: true,
  state: ProgressModalState.FAILURE,
  etherscanHash: dummyTransactionHash,
  transactionType: 'transaction'
};
