import { JoinCollectiveCTA } from '@/components/collectives/joinCollectiveButton';

export default {
  title: '2. Atoms/Buttons/Join collective CTA',
  component: JoinCollectiveCTA,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
};

const Template = (args) => <JoinCollectiveCTA {...args} />;

export const Default = Template.bind({});
Default.args = {
  label: 'Join this collective',
  onClick: () => ({})
};
