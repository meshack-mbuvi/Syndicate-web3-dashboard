import CopyLink from '@/components/shared/CopyLink';
import {
  SmallCarousel,
  collectiveSlides
} from '@/components/shared/smallCarousel';
import { B2, B3, H4 } from '@/components/typography';
import { AppState } from '@/state';
import Image from 'next/image';
import router from 'next/router';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { JoinCollectiveCTA } from '../joinCollectiveButton';
import { CollectiveMember, CollectiveMemberProps } from '../member';
import { PermissionType } from '../shared/types';
import MembersOnly from '@/components/collectives/membersOnly';

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
      web3: { account, activeNetwork }
    },
    collectiveDetailsReducer: {
      details: { isOpen }
    }
  } = useSelector((state: AppState) => state);
  const { collectiveAddress } = router.query;

  const [copyState, setCopyState] = useState(false);

  const goToClaim = (e: React.MouseEvent<HTMLInputElement>) => {
    e.preventDefault();

    router.push({
      pathname: `/collectives/${collectiveAddress}/claim`,
      query: { chain: activeNetwork.network }
    });
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
    <div className="md:max-w-88 w-full overflow-scroll no-scroll-bar space-y-10 relative bottom-0 z-8 h-full">
      {permissionType == PermissionType.ADMIN && isOpen ? (
        <div className="space-y-4">
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
        </div>
      ) : null}

      {permissionType == PermissionType.NON_MEMBER && isOpen ? (
        <JoinCollectiveCTA label="Join this collection" onClick={goToClaim} />
      ) : null}

      {admins.length > 0 ? (
        <div>
          <H4 extraClasses="mb-4">Admin</H4>
          <div className="space-y-4 border rounded-2xl p-6 border-gray-syn7">
            {account ? (
              admins.map((admin, index) => {
                return <CollectiveMember {...admin} key={index} />;
              })
            ) : (
              <div className="border-gray-syn7 top-0 left-0 right-0 px-16 rounded-2xl text-center bottom-0 w-full flex flex-col items-center justify-center">
                <MembersOnly />
              </div>
            )}
          </div>
        </div>
      ) : null}

      <div>
        <H4 extraClasses="mb-4">Applications</H4>
        <SmallCarousel slides={collectiveSlides} />
      </div>

      <div>
        <H4 extraClasses="mb-4">Members</H4>
        <div className="relative w-full h-full">
          <div
            className={`space-y-4 ${
              permissionType === PermissionType.NON_MEMBER
                ? 'opacity-50 filter blur-md'
                : ''
            } w-full ${
              !account || permissionType === PermissionType.NON_MEMBER
                ? 'min-h-363'
                : ''
            } h-full rounded-2xl p-6 border border-gray-syn7`}
          >
            {members.length && account ? (
              members?.map((member, index) => {
                return <CollectiveMember {...member} key={index} />;
              })
            ) : permissionType === PermissionType.ADMIN ? (
              <div className="flex flex-col my-8 h-full align-middle justify-center">
                <Image
                  src="/images/disco-ball.svg"
                  width={56}
                  height={56}
                  alt=""
                />
                <B2 extraClasses="mx-auto tracking-0.1px mt-4">
                  No members yet
                </B2>

                <B3 extraClasses="pt-4 text-gray-syn4 text-center tracking-0.1px">
                  A party of one is no fun - Share the link above to invite
                  members
                </B3>
              </div>
            ) : account ? (
              [...Array(8).keys()].map((_, index) => (
                <CollectiveMember
                  {...{
                    accountAddress: emptyMemberState.accountAddress,
                    profilePicture: emptyMemberState.profilePicture
                  }}
                  key={index}
                />
              ))
            ) : null}
          </div>

          {permissionType === PermissionType.NON_MEMBER || !account ? (
            <div className="absolute border border-gray-syn7 top-0 left-0 right-0 px-16 rounded-2xl text-center bottom-0 w-full flex flex-col items-center justify-center">
              <MembersOnly />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
