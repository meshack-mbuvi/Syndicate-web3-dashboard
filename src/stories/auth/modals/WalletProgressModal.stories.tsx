import WalletProgressModal, {
  TxnProgress
} from '@/features/auth/components/modals/WalletProgressModal';
import { useState } from '@storybook/addons';

export default {
  title: '4. Organisms/Auth/Modal/Wallet Progress',
  argTypes: {
    txnProgress: {
      options: [TxnProgress.Confirm, TxnProgress.Signing, TxnProgress.Success],
      control: { type: 'select' }
    }
  }
};

const Template = (args: any) => {
  const [showModal, closeModal] = useState(true);
  return (
    <WalletProgressModal
      showModal={showModal}
      closeModal={closeModal as any}
      {...args}
    />
  );
};

export const Confirm = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
Confirm.args = {
  txnProgress: TxnProgress.Confirm
};

export const Signing = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
Signing.args = {
  txnProgress: TxnProgress.Signing
};

export const Success = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
Success.args = {
  txnProgress: TxnProgress.Success
};
