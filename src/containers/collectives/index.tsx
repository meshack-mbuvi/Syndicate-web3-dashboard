import {
  CollectiveActivity,
  CollectiveActivityType
} from '@/components/collectives/activity';
import { BadgeWithMembers } from '@/components/collectives/badgeWithMembers';
import {
  CollectiveCard,
  CollectiveCardType
} from '@/components/collectives/card';
import { PermissionType } from '@/components/collectives/shared/types';
import { LockIcon } from '@/components/iconWrappers';
import { B2, B3, H4 } from '@/components/typography';
import { AppState } from '@/state';
import { showWalletModal } from '@/state/wallet/actions';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TwoColumnLayout from '../twoColumnLayout';
import { CollectiveHeader } from './shared/collectiveHeader';
import { DiscordLink, WebSiteLink } from './shared/links';

interface IProps {
  showModifySettings: boolean;
}

interface ICollectiveDetails {
  permissionType: PermissionType;
}

const HeaderComponent: React.FC<IProps> = (args) => {
  const collectiveName = 'Alpha Beta Punks';
  const links = {
    externalLink: '/',
    openSea: '/'
  };

  return (
    <CollectiveHeader collectiveName={collectiveName} links={links} {...args} />
  );
};

const CollectiveDescription = () => {
  const website = 'https://alphabetapunks.com';
  const discord = 'https://discord.com/invite/sgBJhcHxr8';

  return (
    <div className="flex space-y-4 flex-col">
      <B3>
        Alpha Beta Punks dreamcatcher vice affogato sartorial roof party unicorn
        wolf. Heirloom disrupt PBR&B normcore flexitarian bitters tote bag
        coloring book cornhole. Portland fixie forage selvage, disrupt +1
        dreamcatcher meh ramps poutine stumptown letterpress lyft fam. Truffaut
        put a bird on it asymmetrical, gastropub master cleanse fingerstache
        succulents swag flexitarian bespoke thundercats kickstarter chartreuse.
      </B3>
      <WebSiteLink websiteUrl={website} />
      <DiscordLink discordLink={discord} />
    </div>
  );
};

const Activities: React.FC<{ permissionType }> = ({ permissionType }) => {
  const {
    web3Reducer: {
      web3: { account }
    }
  } = useSelector((state: AppState) => state);

  const dispatch = useDispatch();

  const activities = [];

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
            activities.length ? (
              activities.map((activity, index) => (
                <CollectiveActivity {...activity} key={index} />
              ))
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
    web3Reducer: {
      web3: { account }
    }
  } = useSelector((state: AppState) => state);
  const { permissionType } = details;

  return (
    <div className="flex flex-col">
      <div className="flex space-y-10 flex-col">
        <HeaderComponent
          showModifySettings={
            permissionType == PermissionType.ADMIN && account != ''
          }
        />
        <CollectiveDescription />
        <CollectiveCard
          cardType={CollectiveCardType.TIME_WINDOW}
          closeDate="Jun 11, 2021"
          passes={{ available: 1200, total: 4000 }}
          price={{
            tokenAmount: 0.5,
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
  const router = useRouter();
  const { isReady } = router;

  const members = [
    // {
    //   profilePicture: '/images/user.svg',
    //   accountAddress: '0xc8a6282282abcEf834b3bds75e7a1536c1af242af'
    // }
  ];

  const admins = [
    {
      accountAddress: '0xc8a6282282fF1Ef834b3bds75e7a1536c1af242af',
      profilePicture: ''
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
  const permissionType = PermissionType.ADMIN;
  return (
    <TwoColumnLayout
      hideWalletAndEllipsis={false}
      showCloseButton={false}
      headerTitle={'Collective NFT'}
      managerSettingsOpen={false}
      dotIndicatorOptions={[]}
      leftColumnComponent={
        <div>
          <CollectiveDetails permissionType={permissionType} />
        </div>
      }
      rightColumnComponent={<MemberSidePanel permissionType={permissionType} />}
    />
  );
};

export default Collective;
