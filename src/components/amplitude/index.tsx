/**
https://developers.amplitude.com/docs/how-amplitude-works
 */
import amplitude from 'amplitude-js';
import { useEffect } from 'react';
import { isDev } from '@/utils/environment';

let AMPLITUDE_API_KEY;
if (isDev) {
  AMPLITUDE_API_KEY = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY_DEVELOPMENT;
} else {
  AMPLITUDE_API_KEY = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY_PRODUCTION;
}

const initializeAmplitude = () => {
  // Initialize AmplitudeJS
  amplitude.getInstance().init(AMPLITUDE_API_KEY, null, {
    deviceIdFromUrlParam: true,
    includeGclid: true,
    includeReferrer: true,
    includeUtm: true
  });
};

export function useAmplitude(): void {
  // Initialize Amplitude
  useEffect(initializeAmplitude, []);
}

// Event Properties
type EventProperty = {
  flow: Flow;
  transaction_status?: string;
  wallet_network?: any;
  wallet_address?: any;
  deposit_token?: any;
  deposit_window?: any;
  deposit_amount?: string | number;
  transaction_category?: string;
  transaction_note?: string;
  distribution_amount?: string | number;
};

// User Properties
/*
wallet_address
wallet_network
total_sessions
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

  // Collectives
  COLLECTIVE_CREATE = 'Collectives: Create Flow',
  COLLECTIVE_MANAGE = 'Collectives: Manage Flow',
  COLLECTIVE_CLAIM = 'Collectives: Claim Flow',

  // Uncategorized
  UNCATEGORIZED = 'Uncategorized',

  // Deprecated
  MGR_SET_DIST = 'MGR_SET_DIST',
  MGR_DISTRIBUTION = 'MANAGER_DISTRIBUTION'
}

export const amplitudeLogger = (
  eventName: string,
  eventProperties: EventProperty
): Promise<boolean> => {
  // TODO: Implementation of checking environment can be improved using netlify-plugin-contextual-env

  return new Promise((resolve, reject) =>
    amplitude
      .getInstance()
      .logEvent(eventName, { ...eventProperties }, resolve, reject)
  );
};
