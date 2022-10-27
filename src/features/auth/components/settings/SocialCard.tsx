import React from 'react';
import DiscordIcon from '@/components/icons/social/discord';
import { B2 } from '@/components/typography';

export enum AuthType {
  Discord = 'Discord',
  Twitter = 'Twitter'
}

const SocialCard: React.FC<{
  username: string;
  authType: AuthType;
  profileIcon?: string;
}> = ({ username, profileIcon, authType }) => {
  return (
    <div className="rounded-1.5lg bg-gray-syn8">
      <div className="py-4 px-5 flex flex-row space-x-3 items-center">
        {authType === AuthType.Twitter ? (
          <img
            className="h-6 w-6 rounded-full"
            src={profileIcon}
            alt="profile"
          />
        ) : (
          <DiscordIcon fill={username ? '#5865F2' : '#3F4147'} />
        )}
        {username ? (
          <B2 extraClasses="text-white">{username}</B2>
        ) : (
          <div className="bg-gray-syn6 rounded w-28 h-4" />
        )}
      </div>
    </div>
  );
};

export default SocialCard;
