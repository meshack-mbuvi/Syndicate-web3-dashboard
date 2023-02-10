import WalletSheetMobileModal from '@/features/auth/components/modals/WalletSheetMobileModal';
import { useState } from '@storybook/addons';

export default {
  title: 'Organisms/Auth/Modal/Wallet Sheet Mobile',
  argTypes: {
    isConnectedWallet: {
      options: [true, false],
      control: { type: 'select' }
    }
  }
};

const Template = (args: any) => {
  const [showModal, closeModal] = useState(true);
  return (
    <WalletSheetMobileModal
      showModal={showModal}
      closeModal={closeModal as any}
      {...args}
    />
  );
};

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
Default.args = {
  linkedAddress: '0x302d2274156925a2c4e4dd8D9568c415eEF66410',
  isConnectedWallet: true,
  ens: '',
  walletInfo:
    'Ethereum, Polygon  •  Club wallet for ✺ABC  •  Member of ✺DUNE, ✺FUNDFUND, ✺XYZ',
  blockExplorerLink:
    'https://goerli.etherscan.io/tx/0x73ccaf79511f1beb5c881e2fe47780e5749f7d8adb24bbcc06719a6c9de1b245'
};

export const WithEns = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
WithEns.args = {
  linkedAddress: '0x302d2274156925a2c4e4dd8D9568c415eEF66410',
  isConnectedWallet: true,
  ens: 'bertie#1234',
  walletInfo:
    'Ethereum, Polygon  •  Club wallet for ✺ABC  •  Member of ✺DUNE, ✺FUNDFUND, ✺XYZ',
  blockExplorerLink:
    'https://goerli.etherscan.io/tx/0x73ccaf79511f1beb5c881e2fe47780e5749f7d8adb24bbcc06719a6c9de1b245'
};
