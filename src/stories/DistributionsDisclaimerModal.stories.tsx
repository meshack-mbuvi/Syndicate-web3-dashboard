import { DistributionsDisclaimerModal } from '@/components/distributions/disclaimerModal';

export default {
  title: '4. Organisms/Distributions Disclaimer Modal'
};

const Template = (args) => {
  return <DistributionsDisclaimerModal {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  isModalVisible: true
};
