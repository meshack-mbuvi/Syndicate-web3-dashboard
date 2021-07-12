/**
 * https://developers.amplitude.com/docs/how-amplitude-works
 */

import { useEffect } from "react";

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

  return new Promise((resolve) => {
    if (
      window !== undefined &&
      process.env.NODE_ENV === "production" &&
      !isDeployPreview
    ) {
      require("amplitude-js")
        .getInstance()
        .logEvent(eventName, eventProperties, () => resolve(true));
    } else {
      console.log("[Amplitude]", eventName, eventProperties);
    }
  });
};
