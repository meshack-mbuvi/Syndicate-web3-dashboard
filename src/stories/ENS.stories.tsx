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
      image={{ src: '/images/jazzicon.png', size: args.imageSize }}
      {...args}
    />
  );
};

export const NameAndAddress = Template.bind({});
NameAndAddress.args = {
  name: 'janedoe.eth',
  address: { label: '0x32432423423', abbreviated: true },
  imageSize: AddressImageSize.LARGE
};

export const Address = Template.bind({});
Address.args = {
  address: { label: '0x32432423423', abbreviated: true },
  imageSize: AddressImageSize.SMALL
};

export const Name = Template.bind({});
Name.args = {
  name: 'janedoe.eth',
  imageSize: AddressImageSize.SMALL
};

export const ShortHeight = Template.bind({});
ShortHeight.args = {
  name: 'janedoe.eth',
  address: { label: '0x32432423423', abbreviated: true },
  imageSize: AddressImageSize.LARGE,
  layout: AddressLayout.ONE_LINE
};
