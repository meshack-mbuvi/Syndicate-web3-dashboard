import PrimaryButton from '@/components/buttons/PrimaryButton';
import { CtaButton } from '@/components/CTAButton';
import { DistributionMembersTable } from '@/components/distributions/membersTable';
import DistributionHeader from '@/containers/distribute/DistributionHeader';
import { useState } from 'react';

export default {
  title: '4. Organisms/Distribution Members Table',
  decorators: [
    (Story: any): React.ReactElement => (
      <div style={{ margin: '0rem' }}>
        <Story />
      </div>
    )
  ]
};

const tokens = [
  {
    tokenAmount: 72,
    symbol: 'ETH',
    logo: '/images/token-gray.svg'
  },
  {
    tokenAmount: 72,
    symbol: 'USDC',
    logo: '/images/token-gray.svg'
  }
];

const Template = (args: any) => {
  const [activeAddresses, setActiveAddresses] = useState([
    '0x8b94Cbb9a30f5953d93ca9c3dE83FD676D6C0a42',
    'bob.eth',
    'alex.eth'
  ]);
  const [isEditing, setIsEditing] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const handleIsEditingChange = (): void => {
    setIsEditing(!isEditing);
  };

  const handleCancelAction = (e: any) => {
    e.preventDefault();
    setIsEditing(false);
  };

  const handleSearchChange = (e: any) => {
    setSearchValue(e.target.value);
  };

  const clearSearchValue = (e: any) => {
    e.preventDefault();
    setSearchValue('');
  };

  const handleDistribute = (e: any) => {
    e.preventDefault();
    setIsEditing(false);
    // distribute tokens calls are made at this point
  };

  const handleSaveAction = (e: any) => {
    e.preventDefault();
    setIsEditing(!isEditing);
  };

  return (
    <div className="h-full">
      <div className="flex mt-16 justify-between">
        <DistributionHeader
          titleText={isEditing ? 'Edit Distribution' : 'Review Distribution'}
          subTitleText={`Members will automatically receive the asset distributions below, once the transaction is completed on-chain.`}
        />

        {isEditing ? (
          <div className="flex space-x-8">
            <PrimaryButton
              customClasses="border-none"
              textColor="text-blue"
              onClick={handleCancelAction}
            >
              Cancel
            </PrimaryButton>
            <PrimaryButton
              customClasses="border-none bg-gray-syn7 px-8 py-4"
              textColor="text-white"
              onClick={handleSaveAction}
            >
              Save
            </PrimaryButton>
          </div>
        ) : (
          <CtaButton
            greenCta={true}
            fullWidth={false}
            onClick={handleDistribute}
          >
            Submit
          </CtaButton>
        )}
      </div>
      <DistributionMembersTable
        activeAddresses={activeAddresses}
        handleActiveAddressesChange={setActiveAddresses}
        handleIsEditingChange={handleIsEditingChange}
        isEditing={isEditing}
        handleCancelAction={handleCancelAction}
        handleSearchChange={handleSearchChange}
        clearSearchValue={clearSearchValue}
        searchValue={searchValue}
        handleDistribute={handleDistribute}
        {...args}
      />
    </div>
  );
};

export const TwoTokens = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
TwoTokens.args = {
  tokens,
  clubName: 'ABC',
  membersDetails: [
    {
      memberName: '0x8b94Cbb9a30f5953d93ca9c3dE83FD676D6C0a42',
      clubTokenHolding: 1640,
      distributionShare: 40,
      ownershipShare: 40,
      receivingTokens: [
        {
          amount: 24,
          tokenSymbol: 'ETH',
          tokenIcon: '/images/ethereum-logo.svg'
        },
        {
          amount: 24,
          tokenSymbol: 'USDC',
          tokenIcon: '/images/prodTokenLogos/USDCoin.svg'
        }
      ]
    },
    {
      memberName: 'bob.eth',
      clubTokenHolding: 1230,
      ownershipShare: 30,
      distributionShare: 30,
      receivingTokens: [
        {
          amount: 26.4,
          tokenSymbol: 'ETH',
          tokenIcon: '/images/ethereum-logo.svg'
        }
      ]
    },
    {
      memberName: 'alex.eth',
      clubTokenHolding: 1230,
      ownershipShare: 30,
      distributionShare: 30,
      receivingTokens: [
        {
          amount: 24,
          tokenSymbol: 'ETH',
          tokenIcon: '/images/ethereum-logo.svg'
        }
      ]
    }
  ]
};

export const ThreeTokens = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
ThreeTokens.args = {
  tokens,
  clubName: 'ABC',
  membersDetails: [
    {
      memberName: '0x8b94Cbb9a30f5953d93ca9c3dE83FD676D6C0a42',
      clubTokenHolding: 1640,
      distributionShare: 40,
      ownershipShare: 40,
      receivingTokens: [
        {
          amount: 24,
          tokenSymbol: 'ETH',
          tokenIcon: '/images/ethereum-logo.svg'
        },
        {
          amount: 24,
          tokenSymbol: 'USDC',
          tokenIcon: '/images/prodTokenLogos/USDCoin.svg'
        }
      ]
    },
    {
      memberName: 'bob.eth',
      clubTokenHolding: 1230,
      distributionShare: 30,
      ownershipShare: 30,
      receivingTokens: [
        {
          amount: 26.4,
          tokenSymbol: 'ETH',
          tokenIcon: '/images/ethereum-logo.svg'
        },
        {
          amount: 24,
          tokenSymbol: 'UNI',
          tokenIcon: '/images/prodTokenLogos/uniswap.svg'
        }
      ]
    },
    {
      memberName: 'alex.eth',
      clubTokenHolding: 1230,
      distributionShare: 30,
      ownershipShare: 30,
      receivingTokens: [
        {
          amount: 24,
          tokenSymbol: 'ETH',
          tokenIcon: '/images/ethereum-logo.svg'
        },
        {
          amount: 24,
          tokenSymbol: 'UNI',
          tokenIcon: '/images/prodTokenLogos/uniswap.svg'
        }
      ]
    }
  ]
};

export const NoClubDetails = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
NoClubDetails.args = {
  tokens,
  membersDetails: [
    {
      memberName: '0x8b94Cbb9a30f5953d93ca9c3dE83FD676D6C0a42',
      clubTokenHolding: 1640,
      distributionShare: 40,
      ownershipShare: 40,
      receivingTokens: [
        {
          amount: 24,
          tokenSymbol: 'ETH',
          tokenIcon: '/images/ethereum-logo.svg'
        },
        {
          amount: 24,
          tokenSymbol: 'USDC',
          tokenIcon: '/images/prodTokenLogos/USDCoin.svg'
        }
      ]
    },
    {
      memberName: 'bob.eth',
      clubTokenHolding: 1230,
      distributionShare: 30,
      ownershipShare: 30,
      receivingTokens: [
        {
          amount: 26.4,
          tokenSymbol: 'ETH',
          tokenIcon: '/images/ethereum-logo.svg'
        }
      ]
    },
    {
      memberName: 'alex.eth',
      clubTokenHolding: 1230,
      distributionShare: 30,
      ownershipShare: 30,
      receivingTokens: [
        {
          amount: 24,
          tokenSymbol: 'ETH',
          tokenIcon: '/images/ethereum-logo.svg'
        }
      ]
    }
  ]
};
