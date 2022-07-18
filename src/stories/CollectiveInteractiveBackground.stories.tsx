import {
  CollectivesInteractiveBackground,
  FloatingIconMediaType
} from '@/components/collectives/interactiveBackground';

export default {
  title: '3. Molecules/Collectives/Interactive Background'
};

const Template = (args) => {
  return (
    <div className="-m-4">
      <CollectivesInteractiveBackground {...args} />
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  heightClass: 'h-screen',
  widthClass: 'w-screen',
  numberOfParticles: 40
};

export const HalfScreen = Template.bind({});
HalfScreen.args = {
  heightClass: 'h-screen',
  widthClass: 'w-1/2',
  numberOfParticles: 40
};

export const FloatingImage = Template.bind({});
FloatingImage.args = {
  heightClass: 'h-screen',
  widthClass: 'w-1/2',
  numberOfParticles: 40,
  floatingIcon:
    'https://lh3.googleusercontent.com/kGd5K1UPnRVe2k_3na9U5IKsAKr2ERGHn6iSQwQBPGywEMcRWiKtFmUh85nuG0tBPKLVqaXsWqHKCEJidwa2w4oUgcITcJ7Kh-ObsA',
  mediaType: FloatingIconMediaType.IMAGE
};

export const FloatingVideo = Template.bind({});
FloatingVideo.args = {
  heightClass: 'h-screen',
  widthClass: 'w-1/2',
  numberOfParticles: 40,
  floatingIcon:
    'https://litwtf.mypinata.cloud/ipfs/QmVjgAD5gaNQ1cLpgKLeuXDPX8R1yeajtWUhM6nV7VAe6e/4.mp4',
  mediaType: FloatingIconMediaType.VIDEO
};
