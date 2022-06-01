import { ShareSocialModal } from '@/components/distributions/shareSocialModal';

export default {
  title: '3. Molecules/Share Social Modal'
};

const Template = (args) => {
  return <ShareSocialModal {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  isModalVisible: true,
  handleModalClose: () => null,
  etherscanURL: 'http://etherscan.io',
  socialURL: 'http://syndicate.io'
};
