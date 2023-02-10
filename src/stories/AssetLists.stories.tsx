import { AssetList } from '@/components/distributions/assetList';
import React, { useState } from 'react';

export default {
  title: 'Molecules/Distributions/Asset List'
};

const Template = (args: any) => {
  const [activeIndices, setActiveIndices] = useState([]);
  const [options, setOptions] = useState([
    {
      icon: '/images/prodTokenLogos/uniswap.svg',
      name: 'Uniswap',
      symbol: 'UNI',
      tokenAmount: 123,
      fiatAmount: 1053.04,
      isEditingInFiat: false
    },
    {
      icon: '/images/ethereum-logo.svg',
      name: 'Ethereum',
      symbol: 'ETH',
      tokenAmount: 123,
      fiatAmount: 45678910,
      isEditingInFiat: false,
      maximumTokenAmount: 123,
      warning: 'Consider reserving ETH to pay gas on future distributions'
    },
    {
      icon: '/images/prodTokenLogos/USDCoin.svg',
      name: 'USD Coin',
      symbol: 'USDC',
      tokenAmount: 123,
      fiatAmount: 456,
      isEditingInFiat: false,
      maximumTokenAmount: 123,
      error: 'Exceeds amount available for distribution'
    },
    {
      icon: '',
      name: 'Token Coin',
      symbol: 'TOKN',
      tokenAmount: 123,
      fiatAmount: 456,
      isEditingInFiat: false,
      maximumTokenAmount: 123
    },
    {
      icon: '',
      name: 'Ape Coin',
      symbol: 'APEC',
      tokenAmount: 123,
      fiatAmount: 456,
      isEditingInFiat: false,
      maximumTokenAmount: 123,
      isLoading: true
    }
  ]);

  return (
    <AssetList
      options={options}
      activeIndices={activeIndices}
      handleOptionsChange={setOptions}
      handleActiveIndicesChange={setActiveIndices}
      {...args}
    />
  );
};

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Default.args = {};
