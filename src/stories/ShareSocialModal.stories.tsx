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
  handleViewDashboard: () => null,
  handleModalClose: () => null,
  etherscanURL: 'http://etherscan.io',
  socialURL: 'http://syndicate.io',
  clubName: 'Alpha Beta Club',
  clubSymbol: '✺ABC'
};
