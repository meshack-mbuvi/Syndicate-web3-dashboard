import { AppState } from '@/state';
import { useRouter } from 'next/router';
import React, { ReactNode, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Tooltip from 'react-tooltip-lite';

import {
  AddressImageSize,
  AddressWithENS
} from '@/components/shared/ensAddress';
import { useMemberHasSignedQuery } from '@/hooks/data-fetching/backend/generated-types';
import { SUPPORTED_GRAPHS } from '@/Networks/backendLinks';
import { getFirstOrString } from '@/utils/stringUtils';
import { SignedIcon } from '../shared/signedIcon';

interface IProps {
  memberAddress: string;
  setSelectedMember: (member: { [x: string]: ReactNode }) => void;
}
export const MemberAddressComponent: React.FC<IProps> = (props) => {
  const { memberAddress, setSelectedMember, ...rest } = props;
  const {
    web3Reducer: {
      web3: { activeNetwork, ethersProvider }
    }
  } = useSelector((state: AppState) => state);

  const router = useRouter();

  const clubAddress = getFirstOrString(router.query.clubAddress) || '';

  const { data, refetch } = useMemberHasSignedQuery({
    variables: {
      clubAddress,
      address: memberAddress
    },
    context: {
      clientName: SUPPORTED_GRAPHS.BACKEND,
      chainId: activeNetwork.chainId
    },
    skip: !clubAddress || !memberAddress || !activeNetwork.chainId
  });

  useEffect(() => {
    if (memberAddress && activeNetwork.chainId) {
      void refetch();
    }
  }, [memberAddress, activeNetwork.chainId]);

  return (
    <button
      className="flex space-x-3 align-center text-base leading-6"
      onClick={(): void => setSelectedMember({ memberAddress, ...rest })}
    >
      <p className="flex my-1 items-center ">
        {ethersProvider ? (
          <AddressWithENS
            ethersProvider={ethersProvider}
            userPlaceholderImg={'/images/user.svg'}
            address={memberAddress}
            imageSize={AddressImageSize.LARGE}
          />
        ) : (
          ''
        )}
        <Tooltip
          content={
            <div className="text-sm text-gray-syn4">
              This member has signed the associated <br /> legal agreements.
            </div>
          }
          arrow={false}
          tipContentClassName="actionsTooltip"
          background="#232529"
          padding="16px 12px"
          distance={10}
          className="cursor-default"
        >
          {data?.Financial_memberSigned == true && <SignedIcon />}
        </Tooltip>
      </p>
    </button>
  );
};
