import { ChevronRightIcon } from '@heroicons/react/outline';
import React from 'react';
import TrashIcon from '@/components/icons/TrashIcon';
import LinkedWallets from './LinkedWallets';
import SocialAccounts from './SocialAccounts';
import { AuthType } from './SocialCard';
import UserPrivacy from '@/components/icons/social/UserPrivacy';
import { T5, H2, B3, B2 } from '@/components/typography';

const DISCLAIMER =
  'This won’t affect any of your Investment Clubs or Collectives but it will delete the links between your social accounts and wallets that are stored by Stytch.';

const AccountSettings: React.FC<{
  username: string;
  authType: AuthType;
  profileIcon?: string;
  handleAccountLink?: () => void;
  linkedWallets: {
    networks: string[];
    linkedAddress: string;
    clubs: { admin: string[]; member: string[] };
    collectives: { admin: string[]; member: string[] };
  }[];
}> = ({
  authType,
  username,
  profileIcon,
  handleAccountLink,
  linkedWallets
}) => {
  return (
    <div>
      <div className="flex flex-col sm:space-y-5 space-y-3 sm:pb-6 pb-4">
        {/* Desktop */}
        <T5 extraClasses="sm:block hidden">Account settings</T5>
        {/* Mobile */}
        <H2 extraClasses="block sm:hidden">Account settings</H2>
        <div className="flex items-center space-x-2 text-gray-syn3">
          <UserPrivacy />
          <B3>How is my data stored?</B3>
          <button
            className="text-blue flex items-center"
            onClick={
              (): null =>
                null /* TODO: [Auth] Data storage link should open the new data storage modal */
            }
          >
            <B3>Learn more</B3>
            <ChevronRightIcon className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="flex flex-col divide-y divide-gray-syn7">
        <div className="sm:py-14 py-8">
          <SocialAccounts
            authType={authType}
            handleAccountLink={handleAccountLink}
            username={username}
            profileIcon={profileIcon}
          />
        </div>

        <div className="sm:py-14 py-8">
          <LinkedWallets linkedWallets={linkedWallets} />
        </div>

        {/* Unlink Account */}
        <div className="sm:py-14 py-8 flex flex-col space-y-3">
          <button
            className={`flex items-center space-x-2 text-white font-semibold ${
              linkedWallets.length || username ? '' : 'cursor-not-allowed'
            }`}
            disabled={!linkedWallets.length && !username}
          >
            <TrashIcon fill="#FFF" />
            <span>Delete my Syndicate account</span>
          </button>
          {/* Desktop */}
          <B2 extraClasses="text-gray-syn4 sm:block hidden">{DISCLAIMER}</B2>
          {/* Mobile */}
          <B3 extraClasses="text-gray-syn4 block sm:hidden">{DISCLAIMER}</B3>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
