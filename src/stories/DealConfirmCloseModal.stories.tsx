import DealActionConfirmModal from '@/features/deals/components/close/confirm';
import { DealEndType } from '@/features/deals/components/close/types';

export default {
  title: '4. Organisms/Deals/Confirm'
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const Template = (args: any) => {
  return (
    <DealActionConfirmModal
      handleCancelAndGoBackClick={() => {
        alert('Clicked Cancel and go back');
      }}
      handleContinueClick={() => {
        alert('Clicked Review commitments');
      }}
      {...args}
    />
  );
};

export const Close = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
Close.args = {
  show: true,
  closeType: DealEndType.EXECUTE
};

export const Dissolve = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
Dissolve.args = {
  show: true,
  closeType: DealEndType.DISSOLVE
};

export const Withdraw = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
Withdraw.args = {
  show: true,
  closeType: DealEndType.WITHDRAW
};
