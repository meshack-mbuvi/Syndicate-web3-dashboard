import { PermissionType } from '@/components/collectives/shared/types';
import { AppState } from '@/state';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useDealsDetails from './useDealsDetails';

export const useDealPermissionType = (): PermissionType | null => {
  const {
    web3Reducer: {
      web3: { account, web3 }
    }
  } = useSelector((state: AppState) => state);

  const {
    dealDetails: { ownerAddress }
  } = useDealsDetails(false);

  const [permissionType, setPermissionType] = useState<PermissionType | null>(
    null
  );

  // set permission type based on contract owner and balance.
  useEffect(() => {
    if (account && ownerAddress && web3) {
      if (
        web3.utils.toChecksumAddress(ownerAddress) ===
        web3.utils.toChecksumAddress(account)
      ) {
        setPermissionType(PermissionType.ADMIN);
      } else {
        setPermissionType(PermissionType.NON_MEMBER);
      }
    }
  }, [account, web3?.utils, ownerAddress]);

  return permissionType;
};
