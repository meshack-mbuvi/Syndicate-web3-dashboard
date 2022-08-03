import { B3, H1, H2 } from '@/components/typography';
import { isEmpty } from 'lodash';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import ReactTooltip from 'react-tooltip';
import {
  ExternalLinkColor,
  ExternalLinkIcon,
  OpenSeaIcon,
  SettingsIcon
} from 'src/components/iconWrappers';

export const CollectiveHeader: React.FC<{
  collectiveName: string;
  links?: { openSea: string; externalLink: string };
  showModifySettings?: boolean;
}> = (props) => {
  const { collectiveName, links, showModifySettings = false } = props;

  const title = (
    <>
      {/* Desktop */}
      <div className="hidden sm:block">
        <H1 extraClasses="leading-10">{collectiveName}</H1>
      </div>
      {/* Mobile */}
      <div className="sm:hidden">
        <H2 extraClasses="leading-10">{collectiveName}</H2>
      </div>
    </>
  );

  const router = useRouter();
  const {
    query: { collectiveAddress }
  } = router;

  return (
    <div className="mb-4 sm:mb-0 sm:flex items-center space-y-2 sm:space-y-0 sm:space-x-4">
      {title}
      {!isEmpty(links) && (
        <div className="flex items-center space-x-4">
          {showModifySettings ? (
            <Link href={`/collectives/${collectiveAddress}/modify`}>
              <div
                className="rounded-full bg-gray-syn7 hover:bg-gray-syn6 w-8 h-8 cursor-pointer"
                data-tip
                data-for="customize"
              >
                <div className="flex justify-center items-center vertically-center">
                  <SettingsIcon />
                </div>
                <ReactTooltip
                  id="customize"
                  place="bottom"
                  effect="solid"
                  className="actionsTooltip"
                  arrowColor="#222529"
                  backgroundColor="#222529"
                >
                  <B3 extraClasses="text-white">Modify collective</B3>
                </ReactTooltip>
              </div>
            </Link>
          ) : null}

          <a
            href={links.openSea}
            className="rounded-full bg-gray-syn7 hover:bg-gray-syn6 w-8 h-8"
            data-tip
            data-for="opensea"
            target="_blank"
            rel="noreferrer"
          >
            <div className="flex items-center justify-center vertically-center">
              <OpenSeaIcon />
            </div>
            <ReactTooltip
              id="opensea"
              place="bottom"
              effect="solid"
              className="actionsTooltip"
              arrowColor="#222529"
              backgroundColor="#222529"
            >
              <B3 extraClasses="text-white">View on OpenSea</B3>
            </ReactTooltip>
          </a>

          <a
            href={links.externalLink}
            className="rounded-full bg-gray-syn7 hover:bg-gray-syn6 w-8 h-8"
            data-tip
            data-for="etherscan"
            target="_blank"
            rel="noreferrer"
          >
            <div className="flex justify-center items-center vertically-center">
              <ExternalLinkIcon iconcolor={ExternalLinkColor.GRAY4} />
            </div>

            <ReactTooltip
              id="etherscan"
              place="bottom"
              effect="solid"
              className="actionsTooltip"
              arrowColor="#222529"
              backgroundColor="#222529"
            >
              <B3 extraClasses="text-white">View on Etherscan</B3>
            </ReactTooltip>
          </a>
        </div>
      )}
    </div>
  );
};
