import { amplitudeLogger, Flow } from '@/components/amplitude';
import {
  INVITE_LINK_COPY,
  JOIN_COLLECTIVE_CLICK
} from '@/components/amplitude/eventNames';
import MembersOnly from '@/components/collectives/membersOnly';
import CopyLink from '@/components/shared/CopyLink';
import {
  AddressImageSize,
  AddressWithENS
} from '@/components/shared/ensAddress';
import {
  collectiveSlides,
  SmallCarousel
} from '@/components/shared/smallCarousel';
import { B2, B3, H4 } from '@/components/typography';
import useERC721Collective from '@/hooks/collectives/useERC721Collective';
import { AppState } from '@/state';
import { getCollectiveBalance } from '@/utils/contracts/collective';
import Image from 'next/image';
import router from 'next/router';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { JoinCollectiveCTA } from '../joinCollectiveButton';
import { PermissionType } from '../shared/types';

interface Props {
  inviteLink?: string;
  admins?: (string | undefined)[];
  members?: string[];
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
      web3: {
        account,
        activeNetwork,
        web3,
        ethersProvider,
        ethereumNetwork: { invalidEthereumNetwork }
      }
    }
  } = useSelector((state: AppState) => state);
  const {
    collectiveDetails: { contractAddress, isOpen, maxPerMember }
  } = useERC721Collective();

  const [copyState, setCopyState] = useState(false);
  const [collectiveBalance, setCollectiveBalance] = useState<number>(0);

  const goToClaim = (e: MouseEvent): void => {
    e.preventDefault();

    void router.push({
      pathname: `/collectives/${contractAddress || ''}/claim`,
      query: { chain: activeNetwork.network }
    });

    void amplitudeLogger(JOIN_COLLECTIVE_CLICK, {
      flow: Flow.COLLECTIVE_CLAIM
    });
  };

  const handleUpdateCopyState = (): void => {
    setCopyState(true);

    void amplitudeLogger(INVITE_LINK_COPY, {
      flow: Flow.COLLECTIVE_CREATE
    });

    setTimeout(() => {
      setCopyState(false);
    }, 1000);
  };

  useEffect(() => {
    if (!contractAddress || !web3) {
      return;
    }
    void getCollectiveBalance(contractAddress.toString(), account, web3).then(
      (balance) => {
        setCollectiveBalance(balance);
      }
    );
  }, [account, contractAddress, web3]);

  return (
    <div className="w-full overflow-scroll no-scroll-bar space-y-10 relative bottom-0 z-8 h-full">
      {permissionType == PermissionType.ADMIN &&
      isOpen &&
      !invalidEthereumNetwork ? (
        <div className="space-y-4">
          <H4>Invite to join</H4>
          <div className="rounded-2.5xl bg-gray-syn8">
            <div className="p-1">
              <CopyLink
                link={inviteLink || ''}
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

      {(permissionType == PermissionType.NON_MEMBER ||
        collectiveBalance < +maxPerMember) &&
      isOpen ? (
        <JoinCollectiveCTA
          alreadyMember={collectiveBalance > 0}
          // @ts-expect-error TS(2322): Type '(e: React.MouseEvent<HTMLInputElement>) => void' is not assig...
          onClick={goToClaim}
        />
      ) : null}

      {admins && admins.length > 0 ? (
        <div>
          <H4 extraClasses="mb-4">Admin</H4>
          <div className="space-y-4 border rounded-2xl p-6 border-gray-syn7">
            {account && ethersProvider ? (
              admins.map((admin, index) => {
                return (
                  <AddressWithENS
                    ethersProvider={ethersProvider}
                    userPlaceholderImg={'/images/user.svg'}
                    address={admin}
                    key={index}
                    imageSize={AddressImageSize.LARGE}
                  />
                );
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
              permissionType === PermissionType.NON_MEMBER ||
              invalidEthereumNetwork
                ? 'opacity-50 filter blur-md'
                : ''
            } w-full ${
              !account ||
              permissionType === PermissionType.NON_MEMBER ||
              invalidEthereumNetwork
                ? 'min-h-363'
                : ''
            } h-full rounded-2xl p-6 border border-gray-syn7`}
          >
            {members &&
            members.length &&
            account &&
            !invalidEthereumNetwork &&
            ethersProvider ? (
              members?.map((member, index) => {
                return (
                  <AddressWithENS
                    ethersProvider={ethersProvider}
                    address={member}
                    key={index}
                    userPlaceholderImg={'/images/user.svg'}
                    imageSize={AddressImageSize.LARGE}
                  />
                );
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
            ) : account && ethersProvider ? (
              [...Array(8).keys()].map((_, index) => (
                <AddressWithENS
                  ethersProvider={ethersProvider}
                  address="0xc8a6282282abcEf834b3bds75e7a1536c1af242af"
                  key={index}
                  imageSize={AddressImageSize.LARGE}
                />
              ))
            ) : null}
          </div>

          {permissionType === PermissionType.NON_MEMBER ||
          !account ||
          invalidEthereumNetwork ? (
            <div className="absolute border border-gray-syn7 top-0 left-0 right-0 px-16 rounded-2xl text-center bottom-0 w-full flex flex-col items-center justify-center">
              <MembersOnly />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
