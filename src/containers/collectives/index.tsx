import {
  CollectiveActivity,
  CollectiveActivityType
} from '@/components/collectives/activity';
import { BadgeWithMembers } from '@/components/collectives/badgeWithMembers';
import { CollectiveCard } from '@/components/collectives/card';
import MembersOnly from '@/components/collectives/membersOnly';
import { PermissionType } from '@/components/collectives/shared/types';
import Modal, { ModalStyle } from '@/components/modal';
import { Spinner } from '@/components/shared/spinner';
import { SkeletonLoader } from '@/components/skeletonLoader';
import { BlockExplorerLink } from '@/components/syndicates/shared/BlockExplorerLink';
import { B2, B3, H4 } from '@/components/typography';
import CollectivesContainer from '@/containers/collectives/CollectivesContainer';
import useFetchCollectiveMetadata from '@/hooks/collectives/create/useFetchNftMetadata';
import useERC721Collective from '@/hooks/collectives/useERC721Collective';
import useERC721CollectiveEvents from '@/hooks/collectives/useERC721CollectiveEvents';
import { usePermissionType } from '@/hooks/collectives/usePermissionType';
import { AppState } from '@/state';
import { getOpenSeaLink } from '@/utils/api/nfts';
import { floatedNumberWithCommas } from '@/utils/formattedNumbers';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import TwoColumnLayout from '../twoColumnLayout';
import { CollectiveHeader } from './shared/collectiveHeader';

interface IProps {
  showModifySettings: boolean;
}

interface ICollectiveDetails {
  permissionType: PermissionType;
}

const HeaderComponent: React.FC<IProps> = (args) => {
  const {
    web3Reducer: {
      web3: {
        activeNetwork: { chainId }
      }
    }
  } = useSelector((state: AppState) => state);

  const {
    collectiveDetails: { collectiveName, collectiveAddress },
    collectiveDetailsLoading
  } = useERC721Collective();

  const [openSeaLink, setOpenSeaLink] = useState<string>();

  useEffect(() => {
    if (collectiveDetailsLoading) return;
    async function getLink() {
      await getOpenSeaLink(collectiveAddress, chainId).then((link: string) => {
        setOpenSeaLink(link);
      });
    }
    getLink();
  }, [collectiveDetailsLoading, collectiveAddress, chainId]);

  const links = {
    externalLink: '/',
    openSea: openSeaLink
  };

  return (
    <CollectiveHeader
      collectiveName={collectiveName}
      // @ts-expect-error TS(2322): Type '{ externalLink: string; openSea: string | undefined; } is not assignable ... Remove this comment to see the full error message
      links={links}
      {...args}
    />
  );
};

const CollectiveDescription = () => {
  const {
    collectiveDetails: { metadataCid }
  } = useERC721Collective();

  const { data: nftMetadata } = useFetchCollectiveMetadata(metadataCid);
  return (
    <div className="flex space-y-4 flex-col">
      <B3>{nftMetadata?.description}</B3>
    </div>
  );
};

const Activities: React.FC<{ permissionType: any }> = ({ permissionType }) => {
  const {
    web3Reducer: {
      web3: {
        account,
        ethereumNetwork: { invalidEthereumNetwork }
      }
    }
  } = useSelector((state: AppState) => state);

  const {
    collectiveDetails: { createdAt, ownerAddress }
  } = useERC721Collective();

  const { collectiveEvents } = useERC721CollectiveEvents();

  // creation activity
  const creationActivity = [
    {
      activityType: CollectiveActivityType.CREATED,
      profile: {
        address: ownerAddress
      },
      timeStamp: createdAt
    }
  ];

  // add member join activities and sort by timestamp
  const activities = (collectiveEvents || []).sort((a, b) => {
    return +b.timeStamp - +a.timeStamp;
  });

  const activityPlaceholder = {
    activityType: CollectiveActivityType.RECEIVED,
    profile: {
      address: '0xc8a6282282fF1Ef834b3bds75e7a1536c1af242af'
    },
    timeStamp: '3h ago'
  };

  return (
    <div className="flex flex-col mt-16">
      <div className="absolutely bg-gray-syn7 w-full h-0.25"></div>
      <H4 extraClasses="mt-6">Activity</H4>
      <div className={`flex relative flex-col mt-6 space-y-5`}>
        <div
          className={`flex relative flex-col mt-6 w-full space-y-5 ${
            permissionType === PermissionType.NON_MEMBER ||
            !account ||
            invalidEthereumNetwork
              ? 'opacity-50 filter blur-md'
              : ''
          }`}
        >
          {permissionType !== PermissionType.NON_MEMBER &&
          !invalidEthereumNetwork ? (
            activities.length || creationActivity.length ? (
              <div className="space-y-5">
                {activities.length
                  ? activities.map((activity, index) => (
                      <CollectiveActivity {...activity} key={index} />
                    ))
                  : null}
                {creationActivity.map((activity, index) => (
                  <CollectiveActivity {...activity} key={index} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col m-auto h-full min-h-10 align-middle justify-center">
                <B2 extraClasses="mx-auto tracking-0.1px">No activity yet</B2>

                <B3 extraClasses="pt-4 text-gray-syn4 text-center w-60 tracking-0.1px">
                  On-chain activities of this collective will be shown here
                </B3>
              </div>
            )
          ) : (
            [...new Array(5).keys()].map((_, index) => (
              <CollectiveActivity {...activityPlaceholder} key={index} />
            ))
          )}
        </div>

        {permissionType === PermissionType.NON_MEMBER ||
        !account ||
        invalidEthereumNetwork ? (
          <div className="absolute top-0 left-0 right-0 px-16 rounded-2xl text-center bottom-0 w-full flex flex-col items-center justify-center">
            <MembersOnly />
          </div>
        ) : null}
      </div>
    </div>
  );
};

const CollectiveDetails: React.FC<ICollectiveDetails> = (details) => {
  const {
    web3Reducer: {
      web3: {
        activeNetwork: { nativeCurrency }
      }
    }
  } = useSelector((state: AppState) => state);

  const {
    collectiveDetails: {
      mintPrice,
      mintEndTime,
      maxTotalSupply,
      totalSupply,
      collectiveCardType
    }
  } = useERC721Collective();
  const { permissionType } = details;

  return (
    <div className="flex flex-col">
      <div className="flex space-y-10 flex-col">
        <HeaderComponent
          showModifySettings={permissionType == PermissionType.ADMIN}
        />
        <CollectiveDescription />
        <CollectiveCard
          cardType={collectiveCardType}
          closeDate={moment
            .unix(parseInt(mintEndTime))
            .format('MMMM DD[,] YYYY')}
          passes={{
            available: parseInt(maxTotalSupply),
            total: parseInt(totalSupply)
          }}
          price={{
            tokenAmount: floatedNumberWithCommas(mintPrice),
            tokenSymbol: nativeCurrency.symbol,
            tokenIcon: nativeCurrency.logo
          }}
        />
      </div>
      <Activities permissionType={permissionType} />
    </div>
  );
};

const MemberSidePanel: React.FC<{ permissionType: any }> = ({
  permissionType
}) => {
  const {
    collectiveDetails: { ownerAddress, owners }
  } = useERC721Collective();
  const router = useRouter();
  const { isReady } = router;

  const members = owners
    ? owners.map((member: any) => {
        return member?.owner?.walletAddress;
      })
    : [];

  const admins = [ownerAddress];

  const [collectiveLink, setCollectiveLink] = useState('');

  useEffect(() => {
    if (isReady) {
      setCollectiveLink(window.location.href);
    }
  }, [isReady]);

  return (
    <BadgeWithMembers
      admins={admins}
      members={members}
      inviteLink={collectiveLink}
      permissionType={permissionType}
    />
  );
};

const Collective: React.FC = () => {
  const {
    collectiveDetails: { collectiveName, collectiveAddress },
    collectiveDetailsLoading
  } = useERC721Collective();

  const permissionType = usePermissionType(collectiveAddress);

  // skeleton loader content for left content
  const leftColumnLoader = (
    <div className="space-y-10">
      {collectiveDetailsLoading && collectiveName ? (
        <HeaderComponent showModifySettings={false} />
      ) : (
        <div className="flex items-center justify-start space-x-4 w-full">
          <SkeletonLoader width="3/5" height="8" />
          <SkeletonLoader width="8" height="8" borderRadius="rounded-full" />
          <SkeletonLoader width="8" height="8" borderRadius="rounded-full" />
          <SkeletonLoader width="8" height="8" borderRadius="rounded-full" />
        </div>
      )}
      <div className="flex items-center justify-start flex-wrap">
        <div className="flex space-x-4 w-full">
          <SkeletonLoader width="1/3" height="5" />
          <SkeletonLoader width="2/3" height="5" />
        </div>
        <div className="flex space-x-4 w-full">
          <SkeletonLoader width="2/3" height="5" />
          <SkeletonLoader width="1/3" height="5" />
        </div>
        <div className="flex space-x-4 w-full">
          <SkeletonLoader width="1/3" height="5" />
          <SkeletonLoader width="2/3" height="5" />
        </div>
      </div>
      <SkeletonLoader width="full" height="24" borderRadius="rounded-2.5xl" />
      {collectiveDetailsLoading && collectiveName ? (
        <Modal
          show={true}
          modalStyle={ModalStyle.DARK}
          showCloseButton={false}
          customWidth="w-11/12 md:w-1/2 lg:w-1/3"
          // passing empty string to remove default classes
          customClassName=""
        >
          {/* -mx-4 is used to revert the mx-4 set on parent div on the modal */}
          <div className="flex flex-col justify-center py-10 -mx-4 px-8">
            {/* passing empty margin to remove the default margin set on spinner */}
            <Spinner height="h-16" width="w-16" margin="" />
            <p className="text-xl text-center mt-10 mb-4 leading-4 text-white font-whyte">
              Preparing collective
            </p>
            <div className="font-whyte text-center leading-5 text-base text-gray-lightManatee">
              This could take up to a few minutes. You can safely leave this
              page while you wait.
            </div>

            <div className="flex justify-center mt-4">
              <BlockExplorerLink
                resourceId={collectiveAddress}
                resource="address"
              />
            </div>
          </div>
        </Modal>
      ) : null}
    </div>
  );

  // skeleton loader for right column
  const rightColumnLoader = (
    <div className="space-y-12 mt-7">
      <div className="space-y-4">
        <SkeletonLoader width="1/3" height="5" />
        <SkeletonLoader width="full" height="12" />
      </div>
      <div className="space-y-4">
        <SkeletonLoader width="1/3" height="5" />
        <SkeletonLoader width="full" height="48" />
      </div>
    </div>
  );

  return (
    <CollectivesContainer>
      <TwoColumnLayout
        hideWallet={false}
        hideEllipsis={false}
        showCloseButton={false}
        headerTitle={collectiveName ? collectiveName : 'Collective NFT'}
        managerSettingsOpen={false}
        dotIndicatorOptions={[]}
        leftColumnComponent={
          <div>
            {collectiveDetailsLoading ? (
              leftColumnLoader
            ) : (
              <CollectiveDetails permissionType={permissionType} />
            )}
          </div>
        }
        rightColumnComponent={
          collectiveDetailsLoading ? (
            rightColumnLoader
          ) : (
            <MemberSidePanel {...{ permissionType }} />
          )
        }
      />
    </CollectivesContainer>
  );
};

export default Collective;
