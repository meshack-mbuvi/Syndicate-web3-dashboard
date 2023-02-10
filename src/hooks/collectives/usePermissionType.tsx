import { PermissionType } from '@/components/collectives/shared/types';
import { AppState } from '@/state';
import {
  getCollectiveBalance,
  getCollectiveOwner
} from '@/utils/contracts/collective';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export const usePermissionType = (
  collectiveAddress: string
): PermissionType | null => {
  const {
    web3Reducer: {
      web3: { account, web3 }
    }
  } = useSelector((state: AppState) => state);

  const [permissionType, setPermissionType] = useState<PermissionType | null>(
    null
  );
  const [collectiveBalance, setCollectiveBalance] = useState<number>(0);
  const [collectiveOwner, setCollectiveOwner] = useState<string>('');

  useEffect(() => {
    if (!collectiveAddress || !web3) {
      return;
    }
    void getCollectiveBalance(collectiveAddress.toString(), account, web3).then(
      (balance) => {
        setCollectiveBalance(balance);
      }
    );
    void getCollectiveOwner(collectiveAddress.toString(), web3).then(
      (owner) => {
        setCollectiveOwner(owner);
      }
    );
  }, [account, collectiveAddress, web3]);

  // set permission type based on contract owner and balance.
  useEffect(() => {
    if (web3 && account && web3.utils && collectiveOwner) {
      if (collectiveOwner === account) {
        setPermissionType(PermissionType.ADMIN);
      } else if (collectiveBalance > 0) {
        setPermissionType(PermissionType.MEMBER);
      } else {
        setPermissionType(PermissionType.NON_MEMBER);
      }
    }
  }, [account, web3?.utils, collectiveOwner, collectiveBalance]);

  return permissionType;
};
