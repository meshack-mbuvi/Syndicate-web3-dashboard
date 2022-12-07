import { JazziconGenerator } from '@/features/auth/components/jazziconGenerator';

export default {
  title: '2. Atoms/Generated Icons/Jazzicons'
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const Template = (args: any) => {
  return <JazziconGenerator address={args.metamaskAddress} />;
};

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
Default.args = {
  metamaskAddress: '0x94D84D27b5d6494ba7920a4e3Dda7bC6b3A00a0D'
};
