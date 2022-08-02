import { LockIcon } from '@/components/iconWrappers';
import CopyLink from '@/components/shared/CopyLink';
import { B1, B3, H4 } from '@/components/typography';
import { AppState } from '@/state';
import { showWalletModal } from '@/state/wallet/actions';
import Image from 'next/image';
import router from 'next/router';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { JoinCollectiveCTA } from '../joinCollectiveButton';
import { CollectiveMember, CollectiveMemberProps } from '../member';
import { PermissionType } from '../shared/types';

interface Props {
  inviteLink?: string;
  admins?: CollectiveMemberProps[];
  members?: CollectiveMemberProps[];
  permissionType: PermissionType;
}

export const BadgeWithMembers: React.FC<Props> = ({
  inviteLink,
  admins,
  members,
  permissionType
}) => {
  const {
    web3Reducer: {
      web3: { account }
    }
  } = useSelector((state: AppState) => state);

  const [copyState, setCopyState] = useState(false);

  const goToClaim = (e: React.MouseEvent<HTMLInputElement>) => {
    e.preventDefault();
    router.replace(`${window.location.href}/claim`);
  };

  const dispatch = useDispatch();

  const handleConnectWallet = () => {
    dispatch(showWalletModal());
  };

  const emptyMemberState: CollectiveMemberProps = {
    profilePicture: '/images/user.svg',
    accountAddress: '0xc8a6282282abcEf834b3bds75e7a1536c1af242af'
  };

  const handleUpdateCopyState = () => {
    setCopyState(true);

    setTimeout(() => {
      setCopyState(false);
    }, 1000);
  };

  return (
    <div className="md:max-w-88 w-full">
      <div
        className="overflow-scroll no-scroll-bar space-y-10 relative bottom-0 z-8 h-full"
        style={{
          maxHeight: '45rem'
        }}
      >
        {permissionType == PermissionType.ADMIN && account ? (
          <>
            <H4>Invite to join</H4>
            <div className="rounded-2.5xl bg-gray-syn8">
              <div className="p-1">
                <CopyLink
                  link={inviteLink}
                  updateCopyState={handleUpdateCopyState}
                  showCopiedState={copyState}
                  accentColor="white"
                  backgroundColor="bg-black"
                  borderColor="border-none"
                  borderRadius="rounded-2xl"
                  copyBorderRadius="rounded-lg"
                />
              </div>
              <div className="flex p-4 pb-3 space-x-4">
                <div className="flex items-center space-x-2">
                  <Image
                    src="/images/managerActions/create_public_profile.svg"
                    alt="Globe"
                    width={16}
                    height={16}
                  />
                </div>
                <div>
                  <B3>Unrestricted</B3>
                  <B3 extraClasses="text-gray-syn4">
                    Anyone with the link can join
                  </B3>
                </div>
              </div>
            </div>
          </>
        ) : null}

        {permissionType == PermissionType.NON_MEMBER && account ? (
          <JoinCollectiveCTA label="Join this collection" onClick={goToClaim} />
        ) : null}

        {admins.length > 0 ? (
          <div>
            <H4 extraClasses="mb-4">Admin</H4>
            <div className="space-y-4 border rounded-2xl p-6 border-gray-syn7">
              {admins.map((admin, index) => {
                return <CollectiveMember {...admin} key={index} />;
              })}
            </div>
          </div>
        ) : null}

        <div>
          <H4 extraClasses="mb-4">Members</H4>
          <div className="relative w-full">
            <div
              className={`space-y-4 ${
                permissionType === PermissionType.NON_MEMBER || !account
                  ? 'opacity-50 filter blur-md'
                  : ''
              } w-full ${
                members.length ? 'min-h-363' : ''
              } h-64 rounded-2xl p-6 border border-gray-syn7`}
            >
              {account ? (
                <>
                  {members.length ? (
                    members?.map((member, index) => {
                      return <CollectiveMember {...member} key={index} />;
                    })
                  ) : (
                    <div className="flex flex-col my-auto h-56 align-middle justify-center">
                      <B1 extraClasses="mx-auto">No members yet.</B1>

                      <B3 extraClasses="pt-4 text-gray-syn4 text-center">
                        Once members start joining this collective, you will see
                        them here.
                      </B3>
                    </div>
                  )}
                </>
              ) : (
                [...Array(8).keys()].map((_, index) => (
                  <CollectiveMember
                    {...{
                      accountAddress: emptyMemberState.accountAddress,
                      profilePicture: emptyMemberState.profilePicture
                    }}
                    key={index}
                  />
                ))
              )}
            </div>

            {permissionType === PermissionType.NON_MEMBER || !account ? (
              <div className="absolute border border-gray-syn7 top-0 left-0 right-0 px-16 rounded-2xl text-center bottom-0 w-full flex flex-col items-center justify-center">
                <div className="flex text-center">
                  <div className="flex-grow-1 mr-1 pt-0.5">
                    <LockIcon color={`text-white`} />
                  </div>
                  <p className="w-full text-center text-white">Members only</p>
                </div>
                {account ? (
                  <B3 extraClasses="text-gray-syn4 font-light mt-2">
                    Only holders of the NFT can view private data
                  </B3>
                ) : (
                  <B3
                    extraClasses="text-blue font-light mt-2 cursor-pointer"
                    onClick={handleConnectWallet}
                  >
                    Connect wallet
                  </B3>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
