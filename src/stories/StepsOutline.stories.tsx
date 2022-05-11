import { StepsOutline } from '@/components/stepsOutline';

export default {
  title: '3. Molecules/Steps Outline'
};

const Template = (args) => <StepsOutline {...args} />;

export const Default = Template.bind({});
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
