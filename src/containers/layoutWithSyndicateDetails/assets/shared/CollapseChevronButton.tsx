import { useRouter } from 'next/router';
import React, { Dispatch, SetStateAction } from 'react';

export enum CollapsedSectionType {
  TOKENS = 'TOKENS',
  OFF_CHAIN_INVESTMENT = 'OFF_CHAIN_INVESTMENT',
  NFTS = 'NFTS'
}

// chevron button that hides/unhides a given section
export const CollapseChevronButton: React.FC<{
  isCollapsed: boolean;
  setIsCollapsed: Dispatch<SetStateAction<boolean>>;
  collapsedSection: CollapsedSectionType;
}> = ({ isCollapsed, setIsCollapsed, collapsedSection }) => {
  const router = useRouter();
  const {
    query: { clubAddress }
  } = router;

  return (
    <button
      className="py-2 pl-2"
      onClick={() => {
        // store collapsed section in local storage
        if (window.localStorage) {
          const existingClubsCollapsedStates =
            JSON.parse(
              localStorage.getItem('clubAssetsCollapsedState') as string
            ) || {};

          const currentClubCollapsedState =
            existingClubsCollapsedStates[clubAddress as string] || {};
          currentClubCollapsedState[collapsedSection] = !isCollapsed;

          existingClubsCollapsedStates[clubAddress as string] =
            currentClubCollapsedState;

          localStorage.setItem(
            'clubAssetsCollapsedState',
            JSON.stringify(existingClubsCollapsedStates)
          );
        }

        setIsCollapsed(!isCollapsed);
      }}
    >
      <img
        src="/images/chevron-down.svg"
        width="12"
        alt="down-arrow"
        className={`transition-all duration-500 transform ${
          isCollapsed ? 'rotate-180' : 'rotate-0'
        }`}
      />
    </button>
  );
};
