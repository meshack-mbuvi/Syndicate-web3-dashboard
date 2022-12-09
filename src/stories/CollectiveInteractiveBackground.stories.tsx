import { CollectivesInteractiveBackground } from '@/components/collectives/interactiveBackground';
import { NFTMediaType } from '@/components/collectives/nftPreviewer';

export default {
  title: '3. Molecules/Collectives/Interactive Background',
  component: CollectivesInteractiveBackground
};

const Template = (args: any) => {
  return (
    <div className="-m-4">
      <CollectivesInteractiveBackground {...args} />
    </div>
  );
};

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Default.args = {
  heightClass: 'h-screen',
  widthClass: 'w-screen',
  numberOfParticles: 40,
  chromatic: { disableSnapshot: true }
};

export const HalfScreen = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
HalfScreen.args = {
  heightClass: 'h-screen',
  widthClass: 'w-1/2',
  numberOfParticles: 40,
  chromatic: { disableSnapshot: true }
};

export const FloatingImage = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
FloatingImage.args = {
  heightClass: 'h-screen',
  widthClass: 'w-1/2',
  numberOfParticles: 40,
  floatingIcon:
    'https://lh3.googleusercontent.com/kGd5K1UPnRVe2k_3na9U5IKsAKr2ERGHn6iSQwQBPGywEMcRWiKtFmUh85nuG0tBPKLVqaXsWqHKCEJidwa2w4oUgcITcJ7Kh-ObsA',
  mediaType: NFTMediaType.IMAGE,
  chromatic: { disableSnapshot: true }
};

export const FloatingVideo = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
FloatingVideo.args = {
  heightClass: 'h-screen',
  widthClass: 'w-1/2',
  numberOfParticles: 40,
  floatingIcon:
    'https://litwtf.mypinata.cloud/ipfs/QmVjgAD5gaNQ1cLpgKLeuXDPX8R1yeajtWUhM6nV7VAe6e/4.mp4',
  mediaType: NFTMediaType.VIDEO,
  chromatic: { disableSnapshot: true }
};
