import { B3, H1, H2 } from '@/components/typography';
import { isEmpty } from 'lodash';
import React from 'react';
import ReactTooltip from 'react-tooltip';

export const CollectiveHeader: React.FC<{
  collectiveName: string;
  links?: { openSea: string; externalLink: string };
}> = (props) => {
  const { collectiveName, links } = props;

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

  return (
    <div className="mb-4 sm:mb-0 sm:flex items-center space-y-2 sm:space-y-0 sm:space-x-4">
      {title}
      {!isEmpty(links) && (
        <div className="flex items-center space-x-4">
          <a
            href={links.openSea}
            className="rounded-full bg-gray-syn7 hover:bg-gray-syn6 w-8 h-8"
            data-tip
            data-for="opensea"
          >
            <img
              src="/images/collectives/opensea.svg"
              alt="Opensea"
              className="mx-auto vertically-center"
            />
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
          >
            <img
              src="/images/collectives/external-link.svg"
              alt="External link"
              className="mx-auto vertically-center"
            />
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
