import { DistributionsDisclaimerModal } from '@/components/distributions/disclaimerModal';

export default {
  title: 'Organisms/Distributions/Distributions Disclaimer Modal'
};

const Template = (args: any) => {
  return <DistributionsDisclaimerModal {...args} />;
};

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Default.args = {
  isModalVisible: true
};
