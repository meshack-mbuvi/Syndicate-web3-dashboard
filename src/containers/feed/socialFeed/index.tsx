import React, { useState } from "react";
import PageHeader from "src/components/pageHeader";

import { SocialFeedAnimatedLoader } from "./socialFeedAnimatedLoader";

/**
 * Renders feeds on socialPage. During loading, loading animation is
 * shown until the content is loaded
 */
const SocialFeed: React.FC = () => {
  const [isLoading] = useState(true);
  return (
    <div className="w-full sm:w-3/4 mr-4 mt-4">
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
