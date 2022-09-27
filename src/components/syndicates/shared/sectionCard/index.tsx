import Portal from '@/components/shared/Portal';
import { SkeletonLoader } from '@/components/skeletonLoader';
import { useClubDepositsAndSupply } from '@/hooks/clubs/useClubDepositsAndSupply';
import { AppState } from '@/state';
import React, { FC, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

// Description of SectionCard props
export interface SectionCardProps {
  /** Header text for the section card */
  header: string;
  /** Subtext to render on this component */
  content: any;
  /** Optional property used to determine whether to
   * render the info icon */
  infoIcon?: boolean;
  tooltip?: string;
  title?: string;
}

/**
 *
 * @param {object} props
 * @returns
 */

export const SectionCard: FC<SectionCardProps> = (props) => {
  const { header, content, tooltip, infoIcon = true } = props;
  const greenSubtext =
    header === 'Total Withdraws / Distributions To Date' ||
    header === 'Total Distributions / Deposits';

  const {
    erc20TokenSliceReducer: {
      erc20Token: { loading, address }
    }
  } = useSelector((state: AppState) => state);

  const { loadingClubDeposits } = useClubDepositsAndSupply(address);

  const [coord, setCoords] = useState({});
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const tooltipRef = useRef(null);

  const open = Boolean(anchorEl);
  return (
    <div className="relative">
      <Portal>
        <div
          className={`absolute z-10 pointer-events-none ${
            open ? 'visible' : 'invisible'
          } w-56`}
          style={{ ...coord }}
        >
          {!infoIcon ? null : tooltip ? (
            <div
              ref={tooltipRef}
              className="text-sm font-light tooltiptext w-fit-content bg-gray-9 p-4 rounded-lg text-gray-lightManatee max-w-xs"
            >
              {tooltip}
            </div>
          ) : null}
        </div>
      </Portal>
      <div
        onMouseEnter={(e) => {
          handlePopoverOpen(e);
          const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
          setCoords({
            left: rect.left, // add half the width of the button for centering
            top: `${rect.y + 60}px` // add scrollY offset, as soon as getBountingClientRect takes on screen coords
          });
        }}
        onMouseLeave={() => {
          handlePopoverClose();
        }}
      >
        {loading || loadingClubDeposits ? (
          <div className="space-y-2 w-32">
            <SkeletonLoader height="3" width="2/3" borderRadius="rounded-md" />
            <SkeletonLoader height="5" width="full" borderRadius="rounded-md" />
          </div>
        ) : (
          <>
            <div className="text-gray-syn4 leading-6 pb-2">
              {header?.toString()}
            </div>
            <div
              className={
                greenSubtext ? 'text-base text-green-screamin' : 'text-base'
              }
            >
              {content}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
