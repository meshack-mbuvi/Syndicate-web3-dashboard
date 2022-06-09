import { DistributionMembersTable } from '@/components/distributions/membersTable';
import { useState } from 'react';

export default {
  title: '4. Organisms/Distribution Members Table',
  decorators: [
    (Story): React.ReactElement => (
      <div style={{ margin: '0rem' }}>
        <Story />
      </div>
    )
  ]
};

const Template = (args) => {
  const [activeIndices, setactiveIndices] = useState([0, 1, 2]);

  return (
    <div className="h-full">
      <DistributionMembersTable
        activeIndices={activeIndices}
        handleActiveIndiciesChange={setactiveIndices}
        {...args}
      />
    </div>
  );
};

export const TwoTokens = Template.bind({});
TwoTokens.args = {
  clubName: 'ABC',
  membersDetails: [
    {
      memberName: 'name.eth',
      clubTokenHolding: 1230,
      receivingTokens: [
        {
          amount: 24,
          tokenSymbol: 'ETH',
          tokenIcon: '/images/ethereum-logo.png'
        },
        {
          amount: 24,
          tokenSymbol: 'USDC',
          tokenIcon: '/images/prodTokenLogos/USDCoin.png'
        }
      ]
    },
    {
      memberName: 'bob.eth',
      clubTokenHolding: 1230,
      receivingTokens: [
        {
          amount: 26.4,
          tokenSymbol: 'ETH',
          tokenIcon: '/images/ethereum-logo.png'
        }
      ]
    },
    {
      memberName: 'alex.eth',
      clubTokenHolding: 1230,
      receivingTokens: [
        {
          amount: 24,
          tokenSymbol: 'ETH',
          tokenIcon: '/images/ethereum-logo.png'
        }
      ]
    }
  ]
};

export const ThreeTokens = Template.bind({});
ThreeTokens.args = {
  clubName: 'ABC',
  membersDetails: [
    {
      memberName: 'name.eth',
      clubTokenHolding: 1230,
      receivingTokens: [
        {
          amount: 24,
          tokenSymbol: 'ETH',
          tokenIcon: '/images/ethereum-logo.png'
        },
        {
          amount: 24,
          tokenSymbol: 'USDC',
          tokenIcon: '/images/prodTokenLogos/USDCoin.png'
        }
      ]
    },
    {
      memberName: 'bob.eth',
      clubTokenHolding: 1230,
      receivingTokens: [
        {
          amount: 26.4,
          tokenSymbol: 'ETH',
          tokenIcon: '/images/ethereum-logo.png'
        },
        {
          amount: 24,
          tokenSymbol: 'UNI',
          tokenIcon: '/images/prodTokenLogos/uniswap.png'
        }
      ]
    },
    {
      memberName: 'alex.eth',
      clubTokenHolding: 1230,
      receivingTokens: [
        {
          amount: 24,
          tokenSymbol: 'ETH',
          tokenIcon: '/images/ethereum-logo.png'
        },
        {
          amount: 24,
          tokenSymbol: 'UNI',
          tokenIcon: '/images/prodTokenLogos/uniswap.png'
        }
      ]
    }
  ]
};

export const NoClubDetails = Template.bind({});
NoClubDetails.args = {
  membersDetails: [
    {
      memberName: 'name.eth',
      receivingTokens: [
        {
          amount: 24,
          tokenSymbol: 'ETH',
          tokenIcon: '/images/ethereum-logo.png'
        },
        {
          amount: 24,
          tokenSymbol: 'USDC',
          tokenIcon: '/images/prodTokenLogos/USDCoin.png'
        }
      ]
    },
    {
      memberName: 'bob.eth',
      receivingTokens: [
        {
          amount: 26.4,
          tokenSymbol: 'ETH',
          tokenIcon: '/images/ethereum-logo.png'
        }
      ]
    },
    {
      memberName: 'alex.eth',
      receivingTokens: [
        {
          amount: 24,
          tokenSymbol: 'ETH',
          tokenIcon: '/images/ethereum-logo.png'
        }
      ]
    }
  ]
};
