import {
  AddressImageSize,
  AddressWithENS
} from '@/components/shared/ensAddress';

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
  return (
    <AddressWithENS
      address={{ label: accountAddress, abbreviated: true }}
      image={{ src: profilePicture, size: AddressImageSize.LARGE }}
    />
  );
};
