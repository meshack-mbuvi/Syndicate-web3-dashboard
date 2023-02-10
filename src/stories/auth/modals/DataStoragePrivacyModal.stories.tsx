import { DataStoragePrivacyModal } from '@/features/auth/components/modals/privacyModal';

export default {
  title: 'Organisms/Auth/Modal/Data Storage Privacy'
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const Template = (args: any) => {
  return <DataStoragePrivacyModal {...args} />;
};

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
Default.args = {
  show: true
};
