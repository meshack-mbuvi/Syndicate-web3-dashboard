import { formatAddress } from '@/utils/formatAddress';

export interface CollectiveMemberProps {
  profilePicture?: string;
  accountAddress: string;
}

/**
 * This component should use the ENS component post-ens
 */
export const CollectiveMember: React.FC<CollectiveMemberProps> = ({
  profilePicture, // should be removed and replaced with what we get from ENS
  accountAddress
}) => {
  const formattedAddress = formatAddress(accountAddress, 6, 4);

  return (
    <div className="flex space-x-4 items-center">
      <img
        src={profilePicture || '/images/user.svg'}
        alt="Profile"
        className="w-8 h-8 rounded-full"
      />

      <div className="space-y-1">
        <span className="text-gray-syn4">{formattedAddress.slice(0, 2)}</span>
        {formattedAddress.slice(2)}
      </div>
    </div>
  );
};
