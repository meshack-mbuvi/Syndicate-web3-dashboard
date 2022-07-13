import { CollectivesInteractiveBackground } from '@/components/collectives/interactiveBackground';

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

export const FloatingIcon = Template.bind({});
FloatingIcon.args = {
  heightClass: 'h-screen',
  widthClass: 'w-1/2',
  numberOfParticles: 40,
  floatingIcon:
    'https://lh3.googleusercontent.com/kGd5K1UPnRVe2k_3na9U5IKsAKr2ERGHn6iSQwQBPGywEMcRWiKtFmUh85nuG0tBPKLVqaXsWqHKCEJidwa2w4oUgcITcJ7Kh-ObsA'
};
