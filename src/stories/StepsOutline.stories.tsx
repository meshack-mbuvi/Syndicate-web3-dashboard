import { StepsOutline } from '@/components/stepsOutline';

export default {
  title: 'Molecules/Steps Outline'
};

const Template = (args: any) => <StepsOutline {...args} />;

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Default.args = {
  activeIndex: 0,
  steps: [
    {
      title: 'Approve UNI',
      description:
        'Before distributing, you need to allow the protocol to use your ETH. You only need to do this once per asset.',
      isInErrorState: false
    },
    {
      title: 'Distribute 40.0000 UNI',
      description: 'Lorum ipsum dolor lorum ipsum dolor',
      isInErrorState: false
    },
    {
      title: 'Approve USDC',
      description: 'Lorum ipsum dolor lorum ipsum dolor',
      isInErrorState: true
    },
    {
      title: 'Distribute 260,253.56 USDC',
      description: 'Lorum ipsum dolor lorum ipsum dolor',
      isInErrorState: false
    }
  ]
};
