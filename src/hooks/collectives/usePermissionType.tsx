import { PermissionType } from '@/components/collectives/shared/types';
import { AppState } from '@/state';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  getCollectiveOwner,
  getCollectiveBalance
} from '@/utils/contracts/collective';

export const usePermissionType = (
  collectiveAddress: string
): PermissionType => {
  const {
    web3Reducer: {
      web3: { account, web3 }
    }
  } = useSelector((state: AppState) => state);

  // @ts-expect-error TS(2345): Argument of type 'null' is not assignable to param... Remove this comment to see the full error message
  const [permissionType, setPermissionType] = useState<PermissionType>(null);
  const [collectiveBalance, setCollectiveBalance] = useState<number>(0);
  const [collectiveOwner, setCollectiveOwner] = useState<string>('');

  useEffect(() => {
    if (!collectiveAddress) {
      return;
    }
    getCollectiveBalance(collectiveAddress.toString(), account, web3).then(
      (balance) => {
        setCollectiveBalance(balance);
      }
    );
    getCollectiveOwner(collectiveAddress.toString(), web3).then((owner) => {
      setCollectiveOwner(owner);
    });
  }, [account, collectiveAddress, web3]);

  // set permission type based on contract owner and balance.
  useEffect(() => {
    if (account && web3.utils && collectiveOwner) {
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
