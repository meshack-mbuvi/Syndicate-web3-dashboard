import { PermissionType } from '@/components/collectives/shared/types';
import { AppState } from '@/state';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export const usePermissionType = (): PermissionType => {
  const {
    collectiveDetailsReducer: {
      details: { ownerAddress, owners }
    },
    web3Reducer: {
      web3: { account, web3 }
    }
  } = useSelector((state: AppState) => state);

  const [permissionType, setPermissionType] = useState<PermissionType>(null);

  // set permission type based on members list and owner address.
  useEffect(() => {
    if (account && ownerAddress && web3.utils) {
      const isAdmin =
        web3.utils.toChecksumAddress(account) ===
        web3.utils.toChecksumAddress(ownerAddress);

      const isMember =
        !isAdmin &&
        owners.find((member) => {
          const { id } = member;
          const memberAddress = id.split('-')[0];
          return (
            web3.utils.toChecksumAddress(memberAddress) ===
            web3.utils.toChecksumAddress(account)
          );
        });
      if (isAdmin) {
        setPermissionType(PermissionType.ADMIN);
      } else if (isMember) {
        setPermissionType(PermissionType.MEMBER);
      } else {
        setPermissionType(PermissionType.NON_MEMBER);
      }
    }
  }, [account, ownerAddress, web3?.utils, owners]);

  return permissionType;
};
