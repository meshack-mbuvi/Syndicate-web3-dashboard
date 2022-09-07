import { CtaButton } from '@/components/CTAButton';
import TransitionBetweenChildren from '@/components/transitionBetweenChildren';
import { B2, H3 } from '@/components/typography';
import { AppState } from '@/state';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { useState } from 'react';

enum HoverState {
  HOVERING = 1,
  NOT_HOVERING = 0
}

export enum EmptyStateType {
  COLLECTIVES = 'COLLECTIVES',
  CLUBS = 'CLUBS',
  ALL = 'ALL'
}

interface Props {
  emptyStateType?: EmptyStateType;
}

export const CreateClubOrCollective: React.FC<Props> = ({
  emptyStateType = EmptyStateType.ALL
}) => {
  const {
    web3Reducer: {
      web3: { activeNetwork }
    }
  } = useSelector((state: AppState) => state);

  const [clubHoverStateIndex, setClubHoverStateIndex] = useState(
    HoverState.NOT_HOVERING
  );
  const [collectivesHoverStateIndex, setCollectivesHoverStateIndex] = useState(
    HoverState.NOT_HOVERING
  );
  const animationDuration = 'duration-700';
  const router = useRouter();

  const goToCreateFlow = (isCreatingClub: boolean) => {
    router.push({
      pathname: `/${isCreatingClub ? 'clubs' : 'collectives'}/create`,
      query: { chain: activeNetwork.network }
    });
  };

  // empty state for clubs
  const clubsEmptyState = (
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
      role="button"
      tabIndex={0}
      onClick={() => goToCreateFlow(true)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') goToCreateFlow(true);
      }}
      className={`flex flex-row md:flex-col sm:space-x-8 md:space-x-0 border-gray-syn7 ${
        emptyStateType === EmptyStateType.ALL
          ? 'w-full pr-6 sm:pr-0 md:pr-14 md:max-w-88 '
          : 'max-w-112 md:text-center mt-14 md:mt-2'
      }`}
    >
      <div
        className={`hidden sm:block flex-shrink-0 relative ${
          clubHoverStateIndex === HoverState.HOVERING ? 'top-0' : 'top-4'
        } transition-all ${animationDuration}`}
      >
        <TransitionBetweenChildren
          visibleChildIndex={clubHoverStateIndex}
          extraClasses={`${
            emptyStateType === EmptyStateType.CLUBS && 'w-fit-content mx-auto'
          } w-52 md:w-60 h-64`}
        >
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
        </TransitionBetweenChildren>
      </div>

      <div>
        <div
          className={`relative ${
            clubHoverStateIndex === HoverState.HOVERING
              ? 'sm:top-0'
              : 'sm:top-4'
          } transition-all ${animationDuration}`}
        >
          <H3 regular>
            {emptyStateType === EmptyStateType.ALL
              ? 'Invest together'
              : 'You’re not in any investment clubs yet'}
          </H3>
          <B2 extraClasses="mt-2 text-gray-syn4">
            Transform any wallet into a web3 investment club, or import an
            existing treasury
          </B2>
        </div>

        <CtaButton
          voltCta
          extraClasses={`opacity-100 mt-6 ${
            clubHoverStateIndex === HoverState.HOVERING
              ? 'mt-6 opacity-100'
              : 'sm:mt-5 sm:opacity-0'
          } ${animationDuration} transition-all`}
          onClick={() => (window.location.pathname = '/clubs/create')}
        >
          Create an investment club
        </CtaButton>
      </div>
    </div>
  );

  // collectives empty state
  const collectivesEmptyState = (
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
      role="button"
      tabIndex={0}
      onClick={() => goToCreateFlow(false)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') goToCreateFlow(false);
      }}
      className={`flex flex-row md:flex-col sm:space-x-8 md:space-x-0 border-gray-syn7 ${
        emptyStateType === EmptyStateType.ALL
          ? 'w-full pr-6 sm:pr-0 md:pl-14 md:max-w-88 '
          : 'max-w-112 md:text-center  mt-14 md:mt-2'
      }`}
    >
      <div
        className={`hidden sm:block relative flex-shrink-0 ${
          collectivesHoverStateIndex === HoverState.HOVERING ? 'top-0' : 'top-4'
        } transition-all ${animationDuration}`}
      >
        <TransitionBetweenChildren
          visibleChildIndex={collectivesHoverStateIndex}
          extraClasses={`${
            emptyStateType === EmptyStateType.COLLECTIVES &&
            'w-fit-content mx-auto'
          } w-52 md:w-60 h-64`}
        >
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
        </TransitionBetweenChildren>
      </div>
      <div>
        <div
          className={`relative ${
            collectivesHoverStateIndex === HoverState.HOVERING
              ? 'sm:top-0'
              : 'sm:top-4'
          } transition-all ${animationDuration}`}
        >
          <H3 regular>
            {emptyStateType === EmptyStateType.ALL
              ? 'Form a collective'
              : 'You’re not in any collectives yet'}
          </H3>
          <B2
            extraClasses={`mt-2 text-gray-syn4 ${
              emptyStateType === EmptyStateType.COLLECTIVES && 'md:text-center'
            }`}
          >
            Organize your purpose-driven community and customize social
            experiences across web3
          </B2>
        </div>

        <CtaButton
          cherenkovCta
          extraClasses={`opacity-100 mt-6 ${
            collectivesHoverStateIndex === HoverState.HOVERING
              ? 'mt-6 opacity-100'
              : 'sm:mt-5 sm:opacity-0'
          } ${animationDuration} transition-all `}
          onClick={() => (window.location.pathname = '/collectives/create')}
        >
          Form a collective
        </CtaButton>
      </div>
    </div>
  );

  let emptyState;
  if (emptyStateType === EmptyStateType.ALL) {
    emptyState = (
      <>
        {clubsEmptyState}
        {collectivesEmptyState}
      </>
    );
  } else if (emptyStateType === EmptyStateType.CLUBS) {
    emptyState = <>{clubsEmptyState}</>;
  } else if (emptyStateType === EmptyStateType.COLLECTIVES) {
    emptyState = <>{collectivesEmptyState}</>;
  }

  return (
    <div className="flex flex-col md:flex-row md:divide-x md:justify-center space-y-36 md:space-y-0">
      {emptyState}
    </div>
  );
};
