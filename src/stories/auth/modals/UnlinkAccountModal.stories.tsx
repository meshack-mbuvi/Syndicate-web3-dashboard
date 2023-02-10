import UnlinkAccountModal from '@/features/auth/components/modals/UnlinkAccountModal';
import { useState } from '@storybook/addons';

export default {
  title: 'Organisms/Auth/Modal/Unlink Account'
};

const Template = (args: any) => {
  const [showModal, closeModal] = useState(true);
  return (
    <UnlinkAccountModal
      showModal={showModal}
      closeModal={closeModal as any}
      {...args}
    />
  );
};

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
Default.args = {
  ens: 'mutai.eth',
  address: '0x81887984c1B741dE34CeC428A2a464430306Dc53'
};

export const WithoutEns = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
WithoutEns.args = {
  ens: '',
  address: '0x81887984c1B741dE34CeC428A2a464430306Dc53'
};
