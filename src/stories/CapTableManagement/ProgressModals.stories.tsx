import { ProgressState } from '@/components/progressCard';
import { ProgressModal } from '@/components/progressModal';
import { formatAddress } from '@/utils/formatAddress';
import { floatedNumberWithCommas } from '@/utils/formattedNumbers';

export default {
  title:
    '4. Organisms/Cap Table Management/Modals/Modify Member Tokens/Modify Member Progress Modals',
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
  }
};

const Template = (args) => {
  return <ProgressModal {...args} />;
};

export const ConfirmInWallet = Template.bind({});
ConfirmInWallet.args = {
  isVisible: true,
  title: 'Confirm in wallet',
  description: 'Please confirm the cap table modification from your wallet.',
  state: ProgressState.CONFIRM
};

export const Pending = Template.bind({});
Pending.args = {
  isVisible: true,
  title: 'Updating cap table',
  description:
    'This could take anywhere from seconds to hours depending on network congestion and the gas fees you set. You can safely leave this page while you wait.',
  transactionHash: '#',
  transactionType: 'transaction',
  state: ProgressState.PENDING
};

export const Success = Template.bind({});
Success.args = {
  isVisible: true,
  title: 'Cap table updated',
  description: `${formatAddress(
    '0x2502947319f2166eF46f0a7c081D23C63f88112B',
    6,
    4
  )}'s club token
    allocation has been changed to ${floatedNumberWithCommas(3233) || 0} ✺RACA`,
  buttonLabel: 'Done',
  buttonFullWidth: true,
  state: ProgressState.SUCCESS,
  transactionHash: '#',
  transactionType: 'transaction'
};

export const Failure = Template.bind({});
Failure.args = {
  isVisible: true,
  title: 'Cap table update failed',
  description: '',
  buttonLabel: 'Close',
  buttonFullWidth: true,
  state: ProgressState.FAILURE,
  transactionHash: '#',
  transactionType: 'transaction'
};
