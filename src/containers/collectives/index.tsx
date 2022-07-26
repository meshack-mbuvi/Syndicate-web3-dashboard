import { BadgeWithMembers } from '@/components/collectives/badgeWithMembers';
import {
  CollectiveCard,
  CollectiveCardType
} from '@/components/collectives/card';
import { B3 } from '@/components/typography';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import TwoColumnLayout from '../twoColumnLayout';
import { CollectiveHeader } from './shared/collectiveHeader';
import { DiscordLink, WebSiteLink } from './shared/links';

const HeaderComponent = () => {
  const collectiveName = 'Alpha Beta Punks';
  const links = {
    externalLink: '/',
    openSea: '/'
  };

  return (
    <CollectiveHeader
      collectiveName={collectiveName}
      links={links}
      showModifySettings={true}
    />
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

const CollectiveDetails = () => {
  return (
    <div className="flex space-y-10 flex-col">
      <HeaderComponent />
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
  );
};

const MemberSidePanel: React.FC = () => {
  const router = useRouter();
  const { isReady } = router;

  const [isOpenToNewMembers, setIsOpenToNewMembers] = useState(true);

  const members = [];

  const admins = [
    {
      username: '0xc8a6282282fF1Ef834b3bds75e7a1536c1af242af',
      profilePicture: '',
      alsoMemberOf: []
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
      isOpenToNewMembers={isOpenToNewMembers}
    />
  );
};

const Collective: React.FC = () => {
  return (
    <TwoColumnLayout
      hideWalletAndEllipsis={false}
      showCloseButton={false}
      headerTitle={'Collective NFT'}
      managerSettingsOpen={false}
      dotIndicatorOptions={[]}
      leftColumnComponent={
        <div>
          <CollectiveDetails />
        </div>
      }
      rightColumnComponent={<MemberSidePanel />}
    />
  );
};

export default Collective;
