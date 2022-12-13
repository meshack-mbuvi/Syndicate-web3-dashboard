/**
https://developers.amplitude.com/docs/how-amplitude-works
 */
import { TransactionCategory } from '@/state/erc20transactions/types';
import { isDev } from '@/utils/environment';
import amplitude from 'amplitude-js';
import { useEffect } from 'react';

const AMPLITUDE_API_KEY = isDev
  ? process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY_DEVELOPMENT
  : process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY_PRODUCTION;

const initializeAmplitude = () => {
  // Initialize AmplitudeJS
  // @ts-expect-error TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
  amplitude.getInstance().init(AMPLITUDE_API_KEY, null, {
    deviceIdFromUrlParam: true,
    includeGclid: true,
    includeReferrer: true,
    includeUtm: true
  });
};
// hello

export function useAmplitude(): void {
  // Initialize Amplitude
  useEffect(initializeAmplitude, []);
}

// Event Properties
type EventProperty = {
  flow: Flow;
  transaction_status?: string;
  wallet_network?: string;
  contract_address?: string;
  deposit_window?: string;
  deposit_token?: string;
  deposit_amount?: string | number;
  token_gating?: boolean;
  transaction_category?: TransactionCategory;
  distribution_token?: string | (string | undefined)[];
  distribution_amount?: (string | undefined)[];
  file_type?: string;
  file_size?: string;
};

// User Properties
/*
club_address
collective_address
wallet_network
*/

// Event Property: Flow
export enum Flow {
  // Web App
  WEB_APP = 'Web App',

  // Investment Clubs
  CLUB_CREATE = 'Investment Clubs: Create Flow',
  CLUB_MANAGE = 'Investment Clubs: Manage Flow',
  CLUB_DEPOSIT = 'Investment Clubs: Deposit Flow',
  CLUB_LEGAL = 'Investment Clubs: Legal Flow',
  CLUB_DISTRIBUTE = 'Investment Clubs: Distributions Flow',

  // Collectives
  COLLECTIVE_CREATE = 'Collectives: Create Flow',
  COLLECTIVE_MANAGE = 'Collectives: Manage Flow',
  COLLECTIVE_CLAIM = 'Collectives: Claim Flow',

  // Uncategorized
  UNCATEGORIZED = 'Uncategorized'
}

export const amplitudeLogger = (
  eventName: string,
  eventProperties: EventProperty
): Promise<boolean> => {
  // TODO: Implementation of checking environment can be improved using netlify-plugin-contextual-env

  return new Promise((resolve, reject) =>
    amplitude
      .getInstance()
      // @ts-expect-error TS(2345): Argument of type '(value: boolean | PromiseLike... Remove this comment to see the full error message
      .logEvent(eventName, { ...eventProperties }, resolve, reject)
  );
};

export const fireAmplitudeRouteChangeEvents = (url: string): void => {
  const isURLForClub = url.includes('clubs');
  const isURLForCollective = url.includes('collectives');

  if (isURLForClub) {
    const clubAddress = url.split('/')[2]?.split('?')[0];
    const club_address = new amplitude.Identify().set(
      'club_address',
      clubAddress
    );
    amplitude.getInstance().identify(club_address);
  }

  if (isURLForCollective) {
    const collectiveAddress = url.split('/')[2]?.split('?')[0];
    const collective_address = new amplitude.Identify().set(
      'collective_address',
      collectiveAddress
    );
    amplitude.getInstance().identify(collective_address);
  }
};
