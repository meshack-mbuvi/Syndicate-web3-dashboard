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
