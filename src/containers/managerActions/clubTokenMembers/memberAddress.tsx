import { MEMBER_SIGNED_QUERY } from '@/graphql/queries';
import { AppState } from '@/state';
import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Tooltip from 'react-tooltip-lite';

import {
  AddressImageSize,
  AddressWithENS
} from '@/components/shared/ensAddress';
import { SUPPORTED_GRAPHS } from '@/Networks/backendLinks';
import { SignedIcon } from '../shared/signedIcon';

interface IProps {
  memberAddress: string;
  setSelectedMember: any;
}
export const MemberAddressComponent: React.FC<IProps> = (props) => {
  const { memberAddress, setSelectedMember, ...rest } = props;
  const {
    web3Reducer: {
      web3: { activeNetwork, ethersProvider }
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
    context: {
      clientName: SUPPORTED_GRAPHS.BACKEND,
      chainId: activeNetwork.chainId
    },
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
