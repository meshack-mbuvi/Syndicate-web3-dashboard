import { MEMBER_SIGNED_QUERY } from '@/graphql/queries';
import { formatAddress } from '@/utils/formatAddress';
import { useQuery } from '@apollo/client';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import Tooltip from 'react-tooltip-lite';
import { useSelector } from 'react-redux';
import { AppState } from '@/state';

import { SignedIcon } from '../shared/signedIcon';

interface IProps {
  memberAddress: string;
  setSelectedMember: any;
}
export const MemberAddressComponent: React.FC<IProps> = (props) => {
  const { memberAddress, setSelectedMember, ...rest } = props;
  const {
    web3Reducer: {
      web3: { activeNetwork }
    }
  } = useSelector((state: AppState) => state);

  const {
    query: { clubAddress }
  } = useRouter();

  const { data, refetch } = useQuery(MEMBER_SIGNED_QUERY, {
    variables: {
      clubAddress,
      address: memberAddress
    },
    context: { clientName: 'backend', chainId: activeNetwork.chainId },
    skip: !clubAddress || !memberAddress || !activeNetwork.chainId
  });

  useEffect(() => {
    if (memberAddress && activeNetwork.chainId) {
      refetch();
    }
  }, [memberAddress, activeNetwork.chainId]);

  return (
    <button
      className="flex space-x-3 align-center text-base leading-6"
      onClick={() => setSelectedMember({ memberAddress, ...rest })}
    >
      <Image width="32" height="32" src={'/images/user.svg'} alt="user" />
      <p className="flex my-1 items-center ">
        <span className="mr-2">{formatAddress(memberAddress, 6, 4)}</span>
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
