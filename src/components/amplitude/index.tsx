/**
 * https://developers.amplitude.com/docs/how-amplitude-works
 */

import { getCookie } from "@/utils/cookies";
import amplitude from "amplitude-js";
import { useEffect } from "react";

const INTERCOM_ID = "intercom-id-qis66b83";

const isAmplitudeEnabled = () => {
  const isDeployPreview =
    window?.location?.hostname.indexOf("deploy-preview") > -1;
  return (
    window !== undefined &&
    process.env.NODE_ENV === "production" &&
    !isDeployPreview
  );
};

const initializeAmplitude = () => {
  if (isAmplitudeEnabled()) {
    // Initialize AmplitudeJS
    amplitude.getInstance().init(process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY);
  }
};

export function useAmplitude(): void {
  // initialize amplitude
  useEffect(initializeAmplitude, []);
}

export enum Flow {
  MBR_DEP = "MBR_DEP", // member deposit
  MGR_CREATE_SYN = "MGR_CREATE_SYN", // manager create syndicate
  MGR_SET_DIST = "MGR_SET_DIST", //manager set distributions
  MBR_WITHDRAW_DIST = "MBR_WITHDRAW_DIST", // member withdraw distribution
  MBR_WITHDRAW_DEP = "MBR_WITHDRAW_DEP", // member withdraw deposit
}

type EventProperty = {
  flow: Flow;
  trigger?: string;
  error?: Record<string, unknown>;
  amount?: string | number;
  description?: string;
  data?: Record<string, unknown>;
};

export const amplitudeLogger = (
  eventName: string,
  eventProperties: EventProperty,
): Promise<boolean> => {
  // TODO: Implementation of checking environment can be improved using netlify-plugin-contextual-env
  const intercomUserId = getCookie(INTERCOM_ID);

  if (isAmplitudeEnabled()) {
    return new Promise((resolve, reject) =>
      amplitude
        .getInstance()
        .logEvent(
          eventName,
          { ...eventProperties, intercomUserId },
          resolve,
          reject,
        ),
    );
  }

  console.log("[Amplitude]", eventName, {
    ...eventProperties,
    intercomUserId,
  });

  return Promise.resolve(true);
};
