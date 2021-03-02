import React, { useState } from "react";

import PageHeader from "src/components/pageHeader";

import { SocialFeedAnimatedLoader } from "./socialFeedAnimatedLoader";

/**
 * Renders feeds on socialPage. During loading, loading animation is
 * shown until the content is loaded
 */
const SocialFeed = () => {
  const [isLoading] = useState(true);
  return (
    <div className="w-3/4 mr-4">
      <PageHeader>Social Feed</PageHeader>
      {isLoading ? (
        <SocialFeedAnimatedLoader />
      ) : (
        "We show the loaded contents here"
      )}
    </div>
  );
};

export default SocialFeed;
