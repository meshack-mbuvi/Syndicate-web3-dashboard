import GradientAvatar from '@/components/syndicates/portfolioAndDiscover/portfolio/GradientAvatar';

export default {
  title: '2. Atoms/Generated Icons/Gradient Avatar'
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const Template = (args: any) => {
  return <GradientAvatar {...args} name={args.seed} />;
};

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
Default.args = {
  size: 'h-16 w-16',
  seed: 'Alphanumeric string'
};
