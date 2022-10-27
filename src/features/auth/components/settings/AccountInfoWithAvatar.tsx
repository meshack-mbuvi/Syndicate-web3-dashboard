import DiscordIcon from '@/components/icons/social/discord';
import { formatAddress } from '@/utils/formatAddress';
import React from 'react';
import { AuthType } from './SocialCard';

const AccountInfoWithAvatar: React.FC<{
  ens?: string;
  address?: string;
  warning?: boolean;
  authType?: AuthType;
  username?: string;
  avatar?: string;
}> = ({ ens, authType, username, avatar, address = '', warning = false }) => {
  return (
    <div
      className={`flex space-x-2 rounded-full px-4 h-12 items-center self-center ${
        warning ? 'bg-yellow-warning bg-opacity-10' : 'bg-gray-syn7'
      }`}
    >
      {warning && (
        <img
          src="/images/syndicateStatusIcons/warning-triangle-yellow.svg"
          alt="avator"
          className="pr-1 w-5 h-5"
        />
      )}
      {authType ? (
        <div className="flex space-x-2 items-center">
          {authType === AuthType.Discord ? (
            <DiscordIcon />
          ) : (
            <img src={avatar} alt="avator" className="w-6 h-6 rounded-full" />
          )}
          <span>{username}</span>
          <span className="text-gray-syn4">{authType.toString()}</span>
        </div>
      ) : (
        <WalletAddress ens={ens} address={address} extraClassName="w-6 h-6" />
      )}
    </div>
  );
};

export default AccountInfoWithAvatar;

export const WalletAddress: React.FC<{
  ens?: string;
  address?: string;
  extraClassName?: string;
  firstHalfLength?: number;
  secondHalfLength?: number;
  textColor?: string;
}> = ({
  ens,
  address = '',
  extraClassName = '',
  firstHalfLength = 4,
  secondHalfLength = 4,
  textColor = 'text-gray-syn3'
}) => {
  return (
    <>
      <img src="/images/jazzicon.png" alt="avator" className={extraClassName} />
      {ens ? (
        <>
          <span>{ens}</span>
          <span>
            <span className="text-gray-syn4">0x</span>
            <span className={`${textColor}`}>
              {formatAddress(
                address.slice(2),
                firstHalfLength,
                secondHalfLength
              )}
            </span>
          </span>
        </>
      ) : (
        <span className="inline-block">
          <span className="text-gray-syn4">0x</span>
          <span className={`${textColor}`}>
            {formatAddress(address.slice(2), firstHalfLength, secondHalfLength)}
          </span>
        </span>
      )}
    </>
  );
};
