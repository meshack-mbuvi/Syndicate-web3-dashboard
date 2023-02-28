/* eslint-disable jsx-a11y/anchor-is-valid */
import { amplitudeLogger, Flow } from '@/components/amplitude';
import { MAKE_DISTRIBUTION_CLICK } from '@/components/amplitude/eventNames';
import { useDemoMode } from '@/hooks/useDemoMode';
import { AppState } from '@/state';
import { useRouter } from 'next/router';
import React from 'react';
import { useSelector } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import clsx from 'clsx';

const MakeDistributionCard: React.FC<{ depositsEnabled: boolean }> = ({
  depositsEnabled
}) => {
  const {
    web3Reducer: {
      web3: { activeNetwork }
    }
  } = useSelector((state: AppState) => state);

  const isDemoMode = useDemoMode();

  const router = useRouter();
  const { clubAddress } = router.query;

  return (
    <a
      href={
        isDemoMode || depositsEnabled
          ? undefined
          : `/clubs/${clubAddress}/distribute?chain=${activeNetwork.network}`
      }
      onClick={() => {
        amplitudeLogger(MAKE_DISTRIBUTION_CLICK, {
          flow: Flow.CLUB_DISTRIBUTE
        });
      }}
    >
      <div
        className={clsx(
          'rounded-t-2xl space-x-4 flex items-stretch',
          depositsEnabled && 'cursor-not-allowed'
        )}
        data-tip
        data-for="tooltip"
      >
        <div className="flex-shrink-0">
          <img
            src={
              depositsEnabled
                ? '/images/distribute-gray.svg'
                : '/images/Distribute.svg'
            }
            className="mt-1"
            alt="arrow"
          />
        </div>
        <div className="space-y-1">
          <p
            className={`text-base leading-6 ${
              depositsEnabled ? 'text-gray-syn5' : 'text-white'
            }`}
          >
            Make a distribution
          </p>
          <p
            className={`text-sm leading-6  ${
              depositsEnabled ? 'text-gray-syn5' : 'text-gray-syn4'
            }`}
          >
            Send all or a portion of tokens to members
          </p>
        </div>
        {depositsEnabled && (
          <ReactTooltip
            id="tooltip"
            place="top"
            effect="solid"
            className="actionsTooltip"
            arrowColor="#222529"
            backgroundColor="#222529"
            offset={{ left: 120 }}
          >
            <span>Available once your club is closed to deposits.</span>
          </ReactTooltip>
        )}
      </div>
    </a>
  );
};

export default MakeDistributionCard;
