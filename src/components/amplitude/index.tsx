/**
 * https://developers.amplitude.com/docs/how-amplitude-works
 */

import { useEffect } from "react";
import { getCookie } from "@/utils/cookies";

const INTERCOM_ID = "intercom-id-qis66b83";

export const initializeAmplitudeJS = (): void => {
  const isDeployPreview =
    window?.location?.hostname.indexOf("deploy-preview") > -1;
  if (window === undefined) {
    // An edge case when window is undefined
    return;
  } else if (
    window !== undefined &&
    process.env.NODE_ENV === "production" &&
    !isDeployPreview
  ) {
    // Initialize AmplitudeJS
    require("amplitude-js")
      .getInstance()
      .init(process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY);
  } else {
    return;
  }
};

export default function Amplitude() {
  // initialize amplitude
  useEffect(() => initializeAmplitudeJS(), []);
  return null;
}

export enum Flow {
  MBR_DEP = "MBR_DEP", // member deposit
  MGR_CREATE_SYN = "MGR_CREATE_SYN", // manager create syndicate
  MGR_SET_DIST = "MGR_SET_DIST", //manager set distributions
  MBR_WITHDRAW_DIST = 'MBR_WITHDRAW_DIST', // member withdraw distribution
  MBR_WITHDRAW_DEP = 'MBR_WITHDRAW_DEP',  // member withdraw deposit
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
  const isDeployPreview =
    window?.location?.hostname.indexOf("deploy-preview") > -1;

  const intercomUserId = getCookie(INTERCOM_ID);

  return new Promise((resolve) => {
    if (
      window !== undefined &&
      process.env.NODE_ENV === "production" &&
      !isDeployPreview
    ) {
      require("amplitude-js")
        .getInstance()
        .logEvent(eventName, { ...eventProperties, intercomUserId }, () => resolve(true));
    } else {
      console.log("[Amplitude]", eventName, { ...eventProperties, intercomUserId });
    }
  });
};
