import CopyLink from '@/components/shared/CopyLink';
import StatusBadge from '@/components/syndicateDetails/statusBadge';
import { B3, L2 } from '@/components/typography';
import React, { useState } from 'react';
import { CollectiveMember, CollectiveMemberProps } from '../member';

interface Props {
  inviteLink?: string;
  admins?: CollectiveMemberProps[];
  members?: CollectiveMemberProps[];
  isOpenToNewMembers: boolean;
}

export const BadgeWithMembers: React.FC<Props> = ({
  inviteLink,
  admins,
  members,
  isOpenToNewMembers
}) => {
  const [copyState, setCopyState] = useState(false);

  return (
    <div className="max-w-120">
      <div className="relative z-10">
        <StatusBadge
          isCollective={true}
          isOpenToNewMembers={isOpenToNewMembers}
          numberOfMembers={admins.length + members.length}
        />
      </div>
      <div
        className="bg-gray-syn8 overflow-scroll no-scroll-bar px-8 pt-16 space-y-10 pb-8 rounded-2.5xl relative -top-8 z-8"
        style={{
          maxHeight: '40rem'
        }}
      >
        <div>
          <L2 extraClasses="mb-4 text-gray-syn4">Invite to join</L2>
          <div className="relative z-8">
            <CopyLink
              link={inviteLink}
              updateCopyState={() => {
                setCopyState(true);
              }}
              showCopiedState={copyState}
              accentColor="white"
            />
          </div>
          <div className="z-0 flex justify-between space-x-2 items-center bg-gray-syn7 h-13 px-4 relative -top-1.5 pt-1.5 rounded">
            <div className="flex items-center space-x-2">
              <img src="/images/copy-link-white.svg" alt="Link" />
              <B3>Unrestricted</B3>
            </div>
            <B3 extraClasses="text-gray-syn4">Anyone with the link can mint</B3>
          </div>
        </div>

        {admins && (
          <div>
            <L2 extraClasses="mb-4 text-gray-syn4">Admins - {admins.length}</L2>
            <div className="space-y-4">
              {admins.map((admin, index) => {
                return <CollectiveMember {...admin} key={index} />;
              })}
            </div>
          </div>
        )}

        {members.length > 0 && (
          <div>
            <L2 extraClasses="mb-4 text-gray-syn4">
              Members - {members.length}
            </L2>
            <div className="space-y-4">
              {members?.map((member, index) => {
                return <CollectiveMember {...member} key={index} />;
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
