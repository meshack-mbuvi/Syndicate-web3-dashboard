import {
  AddressImageSize,
  AddressLayout,
  DisplayAddressWithENS
} from '@/components/shared/ensAddress/display';

export default {
  title: '3. Molecules/Auth/Address with ENS',
  argTypes: {
    layout: {
      options: [AddressLayout.ONE_LINE, AddressLayout.TWO_LINES],
      control: { type: 'select' }
    },
    imageSize: {
      options: [
        AddressImageSize.SMALLER,
        AddressImageSize.SMALL,
        AddressImageSize.LARGE
      ],
      control: { type: 'select' }
    }
  }
};

const Template = (args: any) => {
  return <DisplayAddressWithENS {...args} />;
};

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
Default.args = {
  address: '0x8410B86f3220631D5110a31f966f12C7A4309435',
  name: 'first.eth',
  image: '/images/jazzicon.png',
  layout: AddressLayout.TWO_LINES,
  imageSize: AddressImageSize.SMALL,
  onlyShowOneOfNameOrAddress: false
};
