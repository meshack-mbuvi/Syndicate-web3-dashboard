import { ChevronIcon, ChevronIconDirection } from '@/components/icons/chevron';
import { SimpleExternalLinkIcon } from '@/components/icons/externalLink';
import TransitionBetweenChildren from '@/components/transitionBetweenChildren';
import { B2, B4 } from '@/components/typography';
import { useEffect, useState } from 'react';
import { amplitudeLogger, Flow } from '@/components/amplitude';
import {
  GUILD_CLICK,
  LUMA_CLICK,
  SLIK_CLICK,
  SNAPSHOT_CLICK,
  SYNDICATE_CLICK
} from '@/components/amplitude/eventNames';

interface Props {
  slides: any[];
  useArrows?: boolean;
}

export const SmallCarousel: React.FC<Props> = ({
  slides,
  useArrows = true
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showSlideNavigator, setShowSlideNavigator] = useState(false);
  const duration = 2000;
  let interval;
  const incrementIndex = () => {
    setActiveIndex((activeIndex + slides.length + 1) % slides.length);
  };
  const decrementIndex = () => {
    setActiveIndex((activeIndex + slides.length - 1) % slides.length);
  };
  useEffect(() => {
    if (!showSlideNavigator) {
      interval = setInterval(() => {
        incrementIndex();
      }, duration);
    }
    return () => clearInterval(interval);
  });
  return (
    <div
      className="flex space-x-3 justify-between items-center border border-gray-syn7 h-38.25 p-6 max-w-88 rounded-2xl"
      onMouseOver={() => {
        clearInterval(interval);
        if (useArrows) {
          setShowSlideNavigator(true);
        }
      }}
      onFocus={() => {
        clearInterval(interval);
        if (useArrows) {
          setShowSlideNavigator(true);
        }
      }}
      onMouseLeave={() => {
        interval = setInterval(() => {
          incrementIndex();
        }, duration);
        if (useArrows) {
          setShowSlideNavigator(false);
        }
      }}
    >
      {/* Slides */}
      <TransitionBetweenChildren
        visibleChildIndex={activeIndex}
        extraClasses="h-full w-full"
      >
        {slides.map((slide, index) => {
          return (
            <div key={index} className="max-w-69 w-full">
              {slide}
            </div>
          );
        })}
      </TransitionBetweenChildren>

      {slides.length > 1 && (
        <div className="w-5 h-full">
          {showSlideNavigator ? (
            <div className="items-center flex-col flex justify-between overflow-hidden w-full bg-opacity-10 relative transform top-1/2 -translate-y-1/2">
              <button
                onClick={() => {
                  decrementIndex();
                }}
                className="relative transform left-1/2 -translate-x-1/2 mb-6"
              >
                <ChevronIcon
                  textColorClass="hover:text-white text-gray-syn4"
                  direction={ChevronIconDirection.UP}
                />
              </button>
              <button
                onClick={() => {
                  incrementIndex();
                }}
                className="relative transform left-1/2 -translate-x-1/2"
              >
                <ChevronIcon
                  textColorClass="hover:text-white text-gray-syn4"
                  direction={ChevronIconDirection.DOWN}
                />
              </button>
            </div>
          ) : (
            <div className="space-y-3 relative transform top-1/2 -translate-y-1/2">
              {slides.map((slide, index) => {
                return (
                  <button
                    key={index}
                    onClick={() => {
                      setActiveIndex(index);
                    }}
                    className={`block w-2 h-2 rounded-full bg-white ${
                      index === activeIndex ? 'opacity-100' : 'opacity-20'
                    } relative transform left-1/2 -translate-x-1/2`}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const collectiveSlides = [
  <a
    href="/clubs/create"
    key={0}
    className="hover-parent visibility-container"
    target="_blank"
    rel="noopener noreferrer"
    onClick={() => {
      amplitudeLogger(SYNDICATE_CLICK, {
        flow: Flow.COLLECTIVE_MANAGE
      });
    }}
  >
    <img
      src="/images/collectives/applications/invest.svg"
      alt=""
      className="w-8 h-8 mb-3"
    />
    <div className="space-y-1">
      <B2>
        Invest together with
        <span className="hover-child-invest inline-flex space-x-1 items-center ml-1">
          <span>Syndicate</span>
          <SimpleExternalLinkIcon
            textColorClass="hover-child-invest"
            extraClasses="visibility-hover invisible"
          />
        </span>
      </B2>
      <B4 extraClasses="text-gray-syn4">
        Transform any wallet into an investing DAO, token-gated by your
        collective
      </B4>
    </div>
  </a>,
  <a
    href="https://snapshot.org/#/"
    key={1}
    className="hover-parent visibility-container"
    target="_blank"
    rel="noopener noreferrer"
    onClick={() => {
      amplitudeLogger(SNAPSHOT_CLICK, {
        flow: Flow.COLLECTIVE_MANAGE
      });
    }}
  >
    <img
      src="/images/collectives/applications/governance.svg"
      alt=""
      className="w-8 h-8 mb-3"
    />
    <div className="space-y-1">
      <B2>
        Governance with
        <span className="hover-child-snapshot inline-flex space-x-1 items-center ml-1">
          <span>Snapshot</span>
          <SimpleExternalLinkIcon
            textColorClass="hover-child-snapshot"
            extraClasses="visibility-hover invisible"
          />
        </span>
      </B2>
      <B4 extraClasses="text-gray-syn4">
        Create gasless proposals and vote within your collective
      </B4>
    </div>
  </a>,
  <a
    href="https://guild.xyz/"
    key={2}
    className="hover-parent visibility-container"
    target="_blank"
    rel="noopener noreferrer"
    onClick={() => {
      amplitudeLogger(GUILD_CLICK, {
        flow: Flow.COLLECTIVE_MANAGE
      });
    }}
  >
    <img
      src="/images/collectives/applications/membership.svg"
      alt=""
      className="w-8 h-8 mb-3"
    />
    <div className="space-y-1">
      <B2>
        Membership with
        <span className="hover-child-guild inline-flex space-x-1 items-center ml-1">
          <span>Guild</span>
          <SimpleExternalLinkIcon
            textColorClass="hover-child-guild"
            extraClasses="visibility-hover invisible"
          />
        </span>
      </B2>
      <B4 extraClasses="text-gray-syn4">
        Automate membership management for social platforms like Discord
      </B4>
    </div>
  </a>,
  <a
    href="https://www.sliksafe.com/"
    key={3}
    className="hover-parent visibility-container"
    target="_blank"
    rel="noopener noreferrer"
    onClick={() => {
      amplitudeLogger(SLIK_CLICK, {
        flow: Flow.COLLECTIVE_MANAGE
      });
    }}
  >
    <img
      src="/images/collectives/applications/storage.svg"
      alt=""
      className="w-8 h-8 mb-3"
    />
    <div className="space-y-1">
      <B2>
        File storage with
        <span className="hover-child-slik inline-flex space-x-1 items-center ml-1">
          <span>Slik</span>
          <SimpleExternalLinkIcon
            textColorClass="hover-child-slik"
            extraClasses="visibility-hover invisible"
          />
        </span>
      </B2>
      <B4 extraClasses="text-gray-syn4">
        Backup & share important documents with end-to-end encryption
      </B4>
    </div>
  </a>,
  <a
    href="https://lu.ma/"
    key={4}
    className="hover-parent visibility-container"
    target="_blank"
    rel="noopener noreferrer"
    onClick={() => {
      amplitudeLogger(LUMA_CLICK, {
        flow: Flow.COLLECTIVE_MANAGE
      });
    }}
  >
    <img
      src="/images/collectives/applications/events.svg"
      alt=""
      className="w-8 h-8 mb-3"
    />
    <div className="space-y-1">
      <B2>
        Events with
        <span className="hover-child-luma inline-flex space-x-1 items-center ml-1">
          <span>Luma</span>
          <SimpleExternalLinkIcon
            textColorClass="hover-child-luma"
            extraClasses="visibility-hover invisible"
          />
        </span>
      </B2>
      <B4 extraClasses="text-gray-syn4">Host exclusive token-gated events</B4>
    </div>
  </a>
];
