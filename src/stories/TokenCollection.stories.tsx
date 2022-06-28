import { TokenCollection } from '@/components/distributions/tokenCollection';

export default {
  title: '3. Molecules/Token Collection'
};

const Template = (args) => {
  return <TokenCollection {...args} />;
};

export const Default = Template.bind({});
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
