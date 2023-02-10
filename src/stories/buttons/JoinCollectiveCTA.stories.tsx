import { JoinCollectiveCTA } from '@/components/collectives/joinCollectiveButton';

export default {
  title: 'Atoms/Buttons/Join collective CTA',
  component: JoinCollectiveCTA,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
};

const Template = (args: any) => <JoinCollectiveCTA {...args} />;

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Default.args = {
  label: 'Join this collective',
  onClick: () => ({})
};
