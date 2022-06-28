import { DetailedTile } from '@/components/tile/detailedTile';
import React, { useState } from 'react';

export default {
  title: '2. Atoms/Detailed Tile'
};

const Template = (args) => {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <DetailedTile
      activeIndex={activeIndex}
      onClick={setActiveIndex}
      {...args}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  options: [
    {
      icon: '/images/collectibles-gray.svg',
      title: 'Holders of certain NFTs/tokens',
      subTitle: 'Token-gated'
    },
    {
      icon: '/images/link-chain-gray.svg',
      title: 'Anyone with the link',
      subTitle: 'Unrestricted'
    }
  ]
};

export const DisabledOptions = Template.bind({});
DisabledOptions.args = {
  activeIndex: 2,
  disabledIndices: [0, 1],
  options: [
    {
      icon: '/images/managerActions/allow-gray-4.svg',
      title: 'Only specific addresses',
      subTitle: 'Allowlist coming soon'
    },
    {
      icon: '/images/token-gray.svg',
      title: 'Owners of certain tokens',
      subTitle: 'Token-gating coming soon'
    },
    {
      icon: '/images/link-chain-gray.svg',
      title: 'Anyone with the link',
      subTitle: 'Unrestricted'
    }
  ]
};

export const NoIcon = Template.bind({});
NoIcon.args = {
  options: [
    {
      title: 'Holders of certain NFTs/tokens',
      subTitle: 'Token-gated'
    },
    {
      title: 'Anyone with the link',
      subTitle: 'Unrestricted'
    }
  ]
};

export const OnlyTitle = Template.bind({});
OnlyTitle.args = {
  options: [
    {
      title: 'Holders of certain NFTs/tokens'
    },
    {
      title: 'Anyone with the link'
    }
  ]
};
