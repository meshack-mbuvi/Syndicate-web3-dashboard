import {
  AddressWithENS,
  AddressImageSize,
  AddressLayout
} from '@/components/shared/ensAddress';

export default {
  title: '3. Molecules/ENS',
  component: null,
  argTypes: {
    imageSize: {
      options: [AddressImageSize.LARGE, AddressImageSize.SMALL],
      control: { type: 'select' }
    }
  }
};

const Template = (args) => {
  return (
    <AddressWithENS
      {...args}
      image={{ src: args.image, size: args.imageSize }}
    />
  );
};

export const NameAndAddress = Template.bind({});
NameAndAddress.args = {
  name: 'janedoe.eth',
  address: { label: '0x32432423423', abbreviated: true },
  image: '/images/jazzicon.png',
  imageSize: AddressImageSize.LARGE
};

export const NoImage = Template.bind({});
NoImage.args = {
  name: 'janedoe.eth',
  address: { label: '0x32432423423', abbreviated: true }
};

export const DefaultMemberImage = Template.bind({});
DefaultMemberImage.args = {
  name: 'janedoe.eth',
  address: { label: '0x32432423423', abbreviated: true },
  image: '/images/user.svg',
  imageSize: AddressImageSize.LARGE
};

export const Address = Template.bind({});
Address.args = {
  address: { label: '0x32432423423', abbreviated: true },
  image: '/images/jazzicon.png',
  imageSize: AddressImageSize.LARGE
};

export const Name = Template.bind({});
Name.args = {
  name: 'janedoe.eth',
  image: '/images/jazzicon.png',
  imageSize: AddressImageSize.SMALL
};

export const OneLine = Template.bind({});
OneLine.args = {
  name: 'janedoe.eth',
  address: { label: '0x32432423423', abbreviated: true },
  image: '/images/jazzicon.png',
  imageSize: AddressImageSize.SMALL,
  layout: AddressLayout.ONE_LINE
};
