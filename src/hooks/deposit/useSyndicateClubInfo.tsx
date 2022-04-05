import { useMemo } from 'react';

export type TokenDetails = {
  syndicateClubAddress: string;
  syndicateClubSymbol: string;
  syndicateClubLogo: string;
  syndicateClubName: string;
  syndicateClubDecimals: number;
};

// This should come from the syndicate details from the redux store
const CLUB_TOKEN: Record<keyof TokenDetails, string | number> = {
  syndicateClubAddress: '0xeb8f08a975Ab53E34D8a0330E0D34de942C95926',
  syndicateClubSymbol: 'sFWB',
  syndicateClubLogo: '/images/logo.svg',
  syndicateClubName: 'sFWB',
  syndicateClubDecimals: 6
};
const useSyndicateClubInfo = (): Record<
  keyof TokenDetails,
  string | number
> => {
  return useMemo(() => CLUB_TOKEN, []);
};

export default useSyndicateClubInfo;
