import {
  CollectiveActivity,
  CollectiveActivityType
} from '@/components/collectives/activity';
import { BadgeWithMembers } from '@/components/collectives/badgeWithMembers';
import { CollectiveCard } from '@/components/collectives/card';
import { PermissionType } from '@/components/collectives/shared/types';
import { LockIcon } from '@/components/iconWrappers';
import { SkeletonLoader } from '@/components/skeletonLoader';
import { B2, B3, H4 } from '@/components/typography';
import CollectivesContainer from '@/containers/collectives/CollectivesContainer';
import useFetchCollectiveMetadata from '@/hooks/collectives/create/useFetchNftMetadata';
import { usePermissionType } from '@/hooks/collectives/usePermissionType';
import { AppState } from '@/state';
import { setMemberJoinedEvents } from '@/state/collectiveDetails';
import { showWalletModal } from '@/state/wallet/actions';
import { floatedNumberWithCommas } from '@/utils/formattedNumbers';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
    collectiveDetailsReducer: {
      details: { collectiveName }
    }
  } = useSelector((state: AppState) => state);
  const links = {
    externalLink: '/',
    openSea: '/'
  };

  return (
    <CollectiveHeader collectiveName={collectiveName} links={links} {...args} />
  );
};

const CollectiveDescription = () => {
  const {
    collectiveDetailsReducer: {
      details: { metadataCid }
    }
  } = useSelector((state: AppState) => state);

  const { data: nftMetadata } = useFetchCollectiveMetadata(metadataCid);
  return (
    <div className="flex space-y-4 flex-col">
      <B3>{nftMetadata?.description}</B3>
    </div>
  );
};

const Activities: React.FC<{ permissionType }> = ({ permissionType }) => {
  const {
    web3Reducer: {
      web3: { account }
    },
    collectiveDetailsReducer: {
      details: { createdAt, ownerAddress },
      events: { memberJoined }
    }
  } = useSelector((state: AppState) => state);

  const dispatch = useDispatch();

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

  // add member join activities
  const activities = [...memberJoined];

  const handleConnectWallet = () => {
    dispatch(showWalletModal());
  };

  const activityPlaceholder = {
    activityType: CollectiveActivityType.RECEIVED,
    profile: {
      address: '0xc8a6282282fF1Ef834b3bds75e7a1536c1af242af'
    },
    timeStamp: '3h ago'
  };

  useEffect(() => {
    // clear member joined data from redux
    return () => {
      dispatch(setMemberJoinedEvents([]));
    };
  }, [dispatch]);

  return (
    <div className="flex flex-col mt-16">
      <div className="absolutely bg-gray-syn7 w-full h-0.25"></div>
      <H4 extraClasses="mt-6">Activity</H4>
      <div className={`flex relative flex-col mt-6 space-y-5`}>
        <div
          className={`flex relative flex-col mt-6 w-full space-y-5 ${
            permissionType === PermissionType.NON_MEMBER || !account
              ? 'opacity-70 filter blur-md'
              : ''
          }`}
        >
          {permissionType !== PermissionType.NON_MEMBER ? (
            activities.length || creationActivity.length ? (
              <div className="space-y-5">
                {creationActivity.map((activity, index) => (
                  <CollectiveActivity {...activity} key={index} />
                ))}
                {activities.length
                  ? activities.map((activity, index) => (
                      <CollectiveActivity {...activity} key={index} />
                    ))
                  : null}
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

        {permissionType === PermissionType.NON_MEMBER || !account ? (
          <div className="absolute top-0 left-0 right-0 px-16 rounded-2xl text-center bottom-0 w-full flex flex-col items-center justify-center">
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
  );
};

const CollectiveDetails: React.FC<ICollectiveDetails> = (details) => {
  const {
    collectiveDetailsReducer: {
      details: {
        mintPrice,
        mintEndTime,
        maxTotalSupply,
        totalSupply,
        collectiveCardType
      }
    }
  } = useSelector((state: AppState) => state);
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
            tokenSymbol: 'ETH',
            tokenIcon: '/images/chains/ethereum.svg'
          }}
        />
      </div>
      <Activities permissionType={permissionType} />
    </div>
  );
};

const MemberSidePanel: React.FC<{ permissionType }> = ({ permissionType }) => {
  const {
    collectiveDetailsReducer: {
      details: { ownerAddress, owners }
    }
  } = useSelector((state: AppState) => state);
  const router = useRouter();
  const { isReady } = router;

  const members =
    owners &&
    owners.map((owner) => {
      const { id } = owner;

      return {
        profilePicture: '/images/collectives/collectiveMemberAvatar.svg',
        accountAddress: id.split('-')[0]
      };
    });

  const admins = [
    {
      accountAddress: ownerAddress,
      profilePicture: '/images/collectives/collectiveMemberAvatar.svg'
    }
  ];

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
    collectiveDetailsReducer: {
      loadingState: { isFetchingCollective }
    }
  } = useSelector((state: AppState) => state);

  const permissionType = usePermissionType();

  // skeleton loader content for left content
  const leftColumnLoader = (
    <div className="space-y-10">
      <div className="flex items-center justify-start space-x-4 w-full">
        <SkeletonLoader width="3/5" height="8" />
        <SkeletonLoader width="8" height="8" borderRadius="rounded-full" />
        <SkeletonLoader width="8" height="8" borderRadius="rounded-full" />
        <SkeletonLoader width="8" height="8" borderRadius="rounded-full" />
      </div>
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
        hideWalletAndEllipsis={false}
        showCloseButton={false}
        headerTitle={'Collective NFT'}
        managerSettingsOpen={false}
        dotIndicatorOptions={[]}
        leftColumnComponent={
          <div>
            {isFetchingCollective ? (
              leftColumnLoader
            ) : (
              <CollectiveDetails permissionType={permissionType} />
            )}
          </div>
        }
        rightColumnComponent={
          isFetchingCollective ? (
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
