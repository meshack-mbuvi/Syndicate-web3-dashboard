import { DetailedButton } from '@/components/buttons/detailedButton';

export default {
  title: 'Atoms/Buttons/Detailed Button',
  argTypes: {
    icon: {
      options: ['/images/category/club.svg', '/images/category/dashboard.svg'],
      control: { type: 'select' }
    },
    hoverBorderColor: {
      options: ['green-volt', 'white'],
      control: { type: 'select' }
    }
  }
};

const Template = (args) => <DetailedButton {...args} />;

export const Default = Template.bind({});
Default.args = {
  icon: '/images/category/dashboard.svg',
  title: 'Set up a group dashboard',
  details:
    'Manage assets, activity, and private annotations via token-gated membership',
  inlineLink: { label: 'View demo', URL: 'www.google.com' },
  hoverBorderColor: 'white'
};
