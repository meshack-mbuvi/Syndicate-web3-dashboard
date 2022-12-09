import React from 'react';
import { H3, B1, H4, B3 } from '@/components/typography';
import AddWallet from './AddWallet';
import WalletCard from './WalletCard';

const TITLE =
  'Link as many wallets as you like. You’ll be able to switch between them as needed.';

const LinkedWallets: React.FC<{
  linkedWallets: {
    networks: string[];
    linkedAddress: string;
    clubs: { admin: string[]; member: string[] };
    collectives: { admin: string[]; member: string[] };
  }[];
}> = ({ linkedWallets }) => {
  return (
    <div>
      {/* Desktop */}
      <div className="sm:flex hidden flex-col space-y-4 pb-4.5">
        <H3>Linked wallets</H3>
        <B1 extraClasses="text-gray-syn3">{TITLE}</B1>
      </div>

      {/* Mobile */}
      <div className="flex sm:hidden flex-col space-y-2 pb-1.5">
        <H4>Linked wallets</H4>
        <B3 extraClasses="text-gray-syn3">{TITLE}</B3>
      </div>

      <div className="flex flex-col divide-y divide-gray-syn7">
        {linkedWallets.map((wallet) => (
          <div className="py-4.5" key={wallet.linkedAddress}>
            <WalletCard {...wallet} />
          </div>
        ))}
        <div className="pt-4.5">
          <AddWallet handleAddWallet={(): null => null /* TODO: [Auth] */} />
        </div>
      </div>
    </div>
  );
};

export default LinkedWallets;
