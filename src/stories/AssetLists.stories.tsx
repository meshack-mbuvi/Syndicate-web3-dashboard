import { AssetList } from '@/components/distributions/assetList';
import React, { useState } from 'react';

export default {
  title: '3. Molecules/Asset List'
};

const Template = (args) => {
  const [activeIndices, setactiveIndices] = useState([]);
  const [options, setOptions] = useState([
    {
      icon: '/images/prodTokenLogos/uniswap.png',
      name: 'Uniswap',
      symbol: 'UNI',
      tokenAmount: 123,
      fiatAmount: 1053.04,
      isEditingInFiat: false
    },
    {
      icon: '/images/ethereum-logo.png',
      name: 'Ethereum',
      symbol: 'ETH',
      tokenAmount: 123,
      fiatAmount: 45678910,
      isEditingInFiat: false,
      warning: 'Consider reserving ETH to pay gas on future distributions'
    },
    {
      icon: '/images/prodTokenLogos/USDCoin.png',
      name: 'USD Coin',
      symbol: 'USDC',
      tokenAmount: 123,
      fiatAmount: 456,
      isEditingInFiat: false,
      error: 'Exceeds amount available for distribution'
    },
    {
      icon: '',
      name: 'Token Coin',
      symbol: 'TOKN',
      tokenAmount: 123,
      fiatAmount: 456,
      isEditingInFiat: false
    },
    {
      icon: '',
      name: 'Ape Coin',
      symbol: 'APEC',
      tokenAmount: 123,
      fiatAmount: 456,
      isEditingInFiat: false,
      isLoading: true
    }
  ]);
  return (
    <AssetList
      options={options}
      activeIndices={activeIndices}
      handleOptionsChange={setOptions}
      handleactiveIndicesChange={setactiveIndices}
      {...args}
    />
  );
};

export const Default = Template.bind({});
Default.args = {};
