import { CtaButton } from '@/components/CTAButton';
import FadeBetweenChildren from '@/components/fadeBetweenChildren';
import { B2, H3 } from '@/components/typography';
import { useState } from 'react';

enum HoverState {
  HOVERING = 1,
  NOT_HOVERING = 0
}

interface Props {
  handleClickCreateClub: () => void;
  handleClickCreateCollective: () => void;
}

export const CreateClubOrCollective: React.FC<Props> = ({
  handleClickCreateClub,
  handleClickCreateCollective
}) => {
  const [clubHoverStateIndex, setClubHoverStateIndex] = useState(
    HoverState.NOT_HOVERING
  );
  const [collectivesHoverStateIndex, setCollectivesHoverStateIndex] = useState(
    HoverState.NOT_HOVERING
  );
  const animationDuration = 'duration-700';
  return (
    <div className="flex divide-x">
      <div
        onMouseOver={() => {
          setClubHoverStateIndex(HoverState.HOVERING);
        }}
        onFocus={() => {
          setClubHoverStateIndex(HoverState.HOVERING);
        }}
        onMouseOut={() => {
          setClubHoverStateIndex(HoverState.NOT_HOVERING);
        }}
        onBlur={() => {
          setClubHoverStateIndex(HoverState.NOT_HOVERING);
        }}
        className="inline-block pr-14 border-gray-syn7 max-w-88"
      >
        <div
          className={`relative ${
            clubHoverStateIndex === HoverState.HOVERING ? 'top-0' : 'top-4'
          } transition-all ${animationDuration}`}
        >
          <FadeBetweenChildren visibleChildIndex={clubHoverStateIndex}>
            <img
              style={{ marginBottom: '30.42px' }}
              src="images/syndicateStatusIcons/newPortfolioEmptyIcon-green-volt.svg"
              alt="empty icon"
            />
            <img
              style={{ marginBottom: '30.42px' }}
              src="images/syndicateStatusIcons/newPortfolioEmptyIcon.svg"
              alt="empty icon"
            />
          </FadeBetweenChildren>
          <H3 regular>Invest together</H3>
          <B2 extraClasses="mt-2 text-gray-syn4">
            Transform any wallet into a web3 investment club, or import an
            existing treasury
          </B2>
        </div>
        <CtaButton
          voltCta
          extraClasses={`${
            clubHoverStateIndex === HoverState.HOVERING
              ? 'mt-6 opacity-100'
              : 'mt-5 opacity-0'
          } ${animationDuration} transition-all`}
          onClick={handleClickCreateClub}
        >
          Create an investment club
        </CtaButton>
      </div>
      <div
        onMouseOver={() => {
          setCollectivesHoverStateIndex(HoverState.HOVERING);
        }}
        onFocus={() => {
          setCollectivesHoverStateIndex(HoverState.HOVERING);
        }}
        onMouseOut={() => {
          setCollectivesHoverStateIndex(HoverState.NOT_HOVERING);
        }}
        onBlur={() => {
          setCollectivesHoverStateIndex(HoverState.NOT_HOVERING);
        }}
        className="inline-block pl-14 border-gray-syn7 max-w-88"
      >
        <div
          className={`relative ${
            collectivesHoverStateIndex === HoverState.HOVERING
              ? 'top-0'
              : 'top-4'
          } transition-all ${animationDuration}`}
        >
          <FadeBetweenChildren visibleChildIndex={collectivesHoverStateIndex}>
            <img
              style={{ marginBottom: '30.42px' }}
              src="images/new-collective.svg"
              alt="empty icon"
            />
            <img
              style={{ marginBottom: '30.42px' }}
              src="images/new-collective-cyan-cherenkov.svg"
              alt="empty icon"
            />
          </FadeBetweenChildren>
          <H3 regular>Form a collective</H3>
          <B2 extraClasses="mt-2 text-gray-syn4">
            Organize your purpose-driven community and customize social
            experiences across web3
          </B2>
        </div>
        <CtaButton
          cherenkovCta
          extraClasses={`${
            collectivesHoverStateIndex === HoverState.HOVERING
              ? 'mt-6 opacity-100'
              : 'mt-5 opacity-0'
          } ${animationDuration} transition-all`}
          onClick={handleClickCreateCollective}
        >
          Form a collective
        </CtaButton>
      </div>
    </div>
  );
};
