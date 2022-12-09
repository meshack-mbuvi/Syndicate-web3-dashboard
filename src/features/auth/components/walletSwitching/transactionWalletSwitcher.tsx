import {
  AddressImageSize,
  AddressLayout,
  DisplayAddressWithENS
} from '@/components/shared/ensAddress/display';
import { B3 } from '@/components/typography';
import React from 'react';

interface ITransactionAccountSwitcher {
  address: string;
  ens?: string;
  image: string;
}

const TransactionWalletSwitcher: React.FC<ITransactionAccountSwitcher> = ({
  address,
  image,
  ens
}) => {
  return (
    <div className="rounded-1.5lg w-full  bg-transparent text-base border-1 px-5 h-14 border-gray-syn6 flex justify-between items-center">
      <B3 extraClasses="text-gray-syn3">Wallet</B3>
      <DisplayAddressWithENS
        address={address}
        image={image}
        imageSize={AddressImageSize.SMALL}
        layout={AddressLayout.TWO_LINES}
        name={ens}
        customTailwindXSpacingUnit={2}
      />
      <img src="/images/activity/chevron-down.svg" alt="chevron-down" />
    </div>
  );
};

export default TransactionWalletSwitcher;
