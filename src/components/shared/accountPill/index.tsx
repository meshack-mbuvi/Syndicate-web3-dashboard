import React from 'react';
import { formatAddress } from '@/utils/formatAddress';
import { AppState } from '@/state';
import { useSelector } from 'react-redux';
import { WalletIcon } from '@/components/iconWrappers';

const AccountPill = () => {
  const {
    web3: { account }
  } = useSelector((state: AppState) => state.web3Reducer);
  const formattedAddress = formatAddress(account, 7, 6);
  return (
    <div className="flex rounded-full px-4 py-2 items-center justify-start bg-green-500 bg-opacity-10 accountPill">
      <WalletIcon className="text-green mr-3 w-3 h-2.5" />
      <span className="focus:outline-none text-sm font-whyte-regular leading-4">
        <span className="text-gray-syn4">{formattedAddress.slice(0, 2)}</span>
        {formattedAddress.slice(2)}
      </span>
    </div>
  );
};

export default AccountPill;
