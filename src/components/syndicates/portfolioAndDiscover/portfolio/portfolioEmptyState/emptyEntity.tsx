import { CTAButton, CTAType } from '@/components/CTAButton';
import TransitionBetweenChildren from '@/components/transition/transitionBetweenChildren';
import { B2, H3 } from '@/components/typography';
import { useState } from 'react';

export enum EntityType {
  CLUB,
  COLLECTIVE,
  DEAL
}

enum HoverState {
  HOVERING = 1,
  NOT_HOVERING = 0
}

interface Props {
  goToCreateFlow: () => void;
  entityType: EntityType;
  numEmpty: number;
}

const entityData = {
  [EntityType.CLUB]: {
    image: 'images/syndicateStatusIcons/newPortfolioEmptyIcon-green-volt.svg',
    imageHover: 'images/syndicateStatusIcons/newPortfolioEmptyIcon.svg',
    imageTitle: 'Invest together',
    imageTitle2: 'You’re not in any investment clubs yet',
    imageText:
      'Transform any wallet into a web3 investment club, or import an existing treasury',
    cta: 'Create an investment club',
    ctaType: CTAType.INVESTMENT_CLUB,
    ctaPath: '/clubs/create'
  },
  [EntityType.COLLECTIVE]: {
    image: 'images/new-collective.svg',
    imageHover: 'images/new-collective-cyan-cherenkov.svg',
    imageTitle: 'Form a collective',
    imageTitle2: 'You’re not in any collectives yet',
    imageText:
      'Organize your purpose-driven community and customize social experiences across web3',
    cta: 'Form a collective',
    ctaType: CTAType.COLLECTIVE,
    ctaPath: '/collectives/create'
  },
  [EntityType.DEAL]: {
    image: 'images/new-deal.svg',
    imageHover: 'images/new-deal-color.svg',
    imageTitle: 'Propose a deal',
    imageTitle2: 'You’re not in any deals yet',
    imageText:
      'Build traction for a new or prospective deal by capturing interest from others on chain',
    cta: 'Propose a deal',
    ctaType: CTAType.DEAL,
    ctaPath: '/deals/create'
  }
};

const EmptyEntity: React.FC<Props> = ({
  goToCreateFlow,
  entityType,
  numEmpty
}) => {
  const [hoverIndex, setHoverIndex] = useState(HoverState.NOT_HOVERING);
  const animationDuration = 'duration-700';

  const {
    image,
    imageHover,
    imageTitle,
    imageTitle2,
    imageText,
    cta,
    ctaType,
    ctaPath
  } = entityData[entityType];

  return (
    <div
      onMouseOver={() => {
        setHoverIndex(HoverState.HOVERING);
      }}
      onFocus={() => {
        setHoverIndex(HoverState.HOVERING);
      }}
      onMouseOut={() => {
        setHoverIndex(HoverState.NOT_HOVERING);
      }}
      onBlur={() => {
        setHoverIndex(HoverState.NOT_HOVERING);
      }}
      role="button"
      tabIndex={0}
      onClick={goToCreateFlow}
      onKeyDown={(e) => {
        if (e.key === 'Enter') goToCreateFlow();
      }}
      className={`flex flex-row md:items-center lg:items-start lg:flex-col sm:space-x-8 md:space-x-18 lg:space-x-0 border-gray-syn7`}
    >
      <div
        className={`hidden sm:block flex-shrink-0 relative ${
          hoverIndex === HoverState.HOVERING ? 'top-0' : 'top-4'
        } transition-all ${animationDuration}`}
      >
        <TransitionBetweenChildren
          visibleChildIndex={hoverIndex}
          extraClasses={`${
            numEmpty == 1 ? 'w-fit-content mx-auto' : ''
          } w-52 md:w-76 lg:w-64 h-64`}
        >
          <img
            style={{ marginBottom: '30.42px' }}
            src={image}
            alt="empty icon"
          />
          <img
            style={{ marginBottom: '30.42px' }}
            src={imageHover}
            alt="empty icon"
          />
        </TransitionBetweenChildren>
      </div>

      <div>
        <div
          className={`relative ${
            hoverIndex === HoverState.HOVERING ? 'sm:top-0' : 'sm:top-4'
          } transition-all ${animationDuration}`}
        >
          <H3 regular>{numEmpty == 3 ? imageTitle : imageTitle2}</H3>
          <B2 extraClasses="mt-2 text-gray-syn4">{imageText}</B2>
        </div>

        <CTAButton
          type={ctaType}
          fullWidth={true}
          extraClasses={`mt-6 sm:mt-12`}
          onClick={() => (window.location.pathname = ctaPath)}
        >
          {cta}
        </CTAButton>
      </div>
    </div>
  );
};

export default EmptyEntity;
