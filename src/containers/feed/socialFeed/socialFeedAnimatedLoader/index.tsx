import React from 'react';
import { showLoader } from 'src/helpers/syndicate/index';

/**
 * Renders an animated loader for social feed
 */
export const SocialFeedAnimatedLoader = () => {
  return <>{showLoader(9)}</>;
};
