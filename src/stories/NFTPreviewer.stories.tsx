import {
  NFTMediaType,
  NFTPreviewer
} from '@/components/collectives/nftPreviewer';

export default {
  title: '3. Molecules/NFT Previewer'
};

const Template = (args) => {
  return <NFTPreviewer {...args} />;
};

export const Image = Template.bind({});
Image.args = {
  name: 'Alpha Beta Punks',
  symbol: 'ABP',
  description:
    'Alpha Beta Punks dreamcatcher vice affogato sartorial roof party unicorn wolf. Heirloom disrupt PBR&B normcore flexitarian bitters tote bag coloring book cornhole. Portland fixie forage selvage, disrupt +1 dreamcatcher meh ramps poutine stumptown letterpress lyft fam. Truffaut put a bird on it asymmetrical, gastropub master cleanse fingerstache succulents swag flexitarian bespoke thundercats kickstarter chartreuse.',
  loading: { name: false, description: false },
  mediaType: NFTMediaType.IMAGE,
  mediaSource:
    'https://lh3.googleusercontent.com/kGd5K1UPnRVe2k_3na9U5IKsAKr2ERGHn6iSQwQBPGywEMcRWiKtFmUh85nuG0tBPKLVqaXsWqHKCEJidwa2w4oUgcITcJ7Kh-ObsA'
};

export const Video = Template.bind({});
Video.args = {
  name: 'Alpha Beta Punks',
  symbol: 'ABP',
  description:
    'Alpha Beta Punks dreamcatcher vice affogato sartorial roof party unicorn wolf. Heirloom disrupt PBR&B normcore flexitarian bitters tote bag coloring book cornhole. Portland fixie forage selvage, disrupt +1 dreamcatcher meh ramps poutine stumptown letterpress lyft fam. Truffaut put a bird on it asymmetrical, gastropub master cleanse fingerstache succulents swag flexitarian bespoke thundercats kickstarter chartreuse.',
  loading: { name: false, description: false },
  mediaType: NFTMediaType.VIDEO,
  mediaSource:
    'https://litwtf.mypinata.cloud/ipfs/QmVjgAD5gaNQ1cLpgKLeuXDPX8R1yeajtWUhM6nV7VAe6e/4.mp4'
};