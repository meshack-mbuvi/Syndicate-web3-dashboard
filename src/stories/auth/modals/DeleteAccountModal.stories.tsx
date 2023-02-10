import DeleteAccountModal from '@/features/auth/components/modals/deleteAccountModal';
import { useState } from '@storybook/addons';

export default {
  title: 'Organisms/Auth/Modal/Delete Account'
};

const Template = (args: any) => {
  const [showModal, closeModal] = useState(true);
  return (
    <DeleteAccountModal
      showModal={showModal}
      closeModal={closeModal as any}
      {...args}
    />
  );
};

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
Default.args = {};
