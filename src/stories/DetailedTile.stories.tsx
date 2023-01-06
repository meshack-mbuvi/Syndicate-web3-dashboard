import { DetailedTile } from '@/components/tile/detailedTile';
import { useState } from 'react';

export default {
  title: '2. Atoms/Detailed Tile'
};

const Template = (args: any) => {
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
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
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
  ],
  animateHighlightRing: false
};

export const LongText = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
LongText.args = {
  options: [
    {
      icon: '/images/collectibles-gray.svg',
      title:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt',
      subTitle: 'Token-gated'
    },
    {
      icon: '/images/link-chain-gray.svg',
      title:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
      subTitle: 'Unrestricted'
    }
  ]
};

export const DisabledOptions = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
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
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
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
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
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
