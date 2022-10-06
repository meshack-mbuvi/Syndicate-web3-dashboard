import { ArrowRightIcon } from '@heroicons/react/outline';
import React from 'react';
import TrashIcon from '@/components/icons/TrashIcon';
import SocialCard, { AuthType } from './SocialCard';
import { H3, B1, H4, B3, B4, B2 } from '@/components/typography';

interface ISocialAccounts {
  username: string;
  authType: AuthType;
  profileIcon?: string;
  handleAccountLink?: () => void;
}

const DISCLAIMER =
  'We don’t support Discord identities (username and profile picture) on Syndicate, but you can use Discord to sign in to your Syndicate account.';
const TITLE =
  'Social accounts allow you to easily sign in to your Syndicate account.';

const SocialAccounts: React.FC<ISocialAccounts> = ({
  authType = AuthType.Discord,
  username,
  profileIcon,
  handleAccountLink
}) => {
  return (
    <div>
      <div>
        {/* Desktop */}
        <span className="flex-col space-y-4 sm:flex hidden">
          <H3 extraClasses="text-white">Social accounts</H3>
          <B1 extraClasses="text-gray-syn3">{TITLE}</B1>
        </span>

        {/* Mobile */}
        <span className="flex flex-col space-y-2 sm:hidden">
          <H4 extraClasses="text-white">Social accounts</H4>
          <B3 extraClasses="text-gray-syn3 ">{TITLE}</B3>
        </span>
      </div>

      <div className="grid sm:grid-cols-6 grid-cols-none gap-5 pb-4 sm:pt-8 pt-5">
        <div className="sm:col-span-4 col-auto">
          <SocialCard
            username={username}
            authType={authType}
            profileIcon={profileIcon}
          />
        </div>

        {/* Mobile Screen */}
        {username && (
          <B4 extraClasses="text-gray-syn4 inline-block sm:hidden">
            {DISCLAIMER}
          </B4>
        )}

        <div className="sm:col-span-2 col-auto">
          <button
            className={`flex flex-row sm:items-center justify-center sm:space-x-3 rounded-1.5lg sm:py-4 py-2.5 w-full text-center font-medium ${
              username
                ? 'sm:bg-gray-syn8 sm:hover:bg-gray-syn7 bg-gray-syn7 hover:bg-gray-syn7 text-gray-syn4'
                : 'bg-white text-black'
            }`}
            onClick={handleAccountLink}
          >
            {username ? (
              <>
                <TrashIcon extraClasses="sm:inline-block hidden" />
                <span>Unlink {authType.toString()}</span>
              </>
            ) : (
              <>
                <B2>Link Discord</B2>
                <ArrowRightIcon className="w-4 h-3 sm:inline-block hidden" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Desktop Screen */}
      {username && (
        <B3 extraClasses="text-gray-syn4 sm:inline-block hidden">
          {DISCLAIMER}
        </B3>
      )}
    </div>
  );
};

export default SocialAccounts;
