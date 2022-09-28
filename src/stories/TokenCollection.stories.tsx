import { TokenCollection } from '@/components/distributions/tokenCollection';

export default {
  title: '3. Molecules/Token Collection'
};

const Template = (args: any) => {
  return <TokenCollection {...args} />;
};

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Default.args = {
  numberVisible: 3,
  tokenDetails: [
    {
      name: 'Token A',
      symbol: 'TOKNA'
    },
    {
      name: 'Token B',
      symbol: 'TOKNB',
      icon: '/images/token.svg'
    },
    {
      name: 'Token B',
      symbol: 'TOKNB',
      icon: '/images/token.svg'
    },
    {
      name: 'Token C',
      symbol: 'TOKNC',
      icon: '/images/token.svg'
    },
    {
      name: 'Token D',
      symbol: 'TOKND',
      icon: '/images/token.svg'
    },
    {
      name: 'Token E',
      symbol: 'TOKNE',
      icon: '/images/token.svg'
    },
    {
      name: 'Token F',
      symbol: 'TOKNF',
      icon: '/images/token.svg'
    }
  ]
};
