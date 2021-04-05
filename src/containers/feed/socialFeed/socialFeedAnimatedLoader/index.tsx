import React from "react";
import HorizontalDivider from "src/components/horizontalDivider";

/**
 * Renders an animated loader for social feed
 */
export const SocialFeedAnimatedLoader = () => {
  /**
   * This method creates a list of loader items
   * @param {number} count the number of loader items to be rendered
   * @returns {array} animations list of loader items
   */
  const showLoader = (count) => {
    const animations = [];
    for (let i = 0; i < count; i++) {
      animations.push(
        <div key={i}>
          <div className="wrapper-cell w-full flex justify-between sm:m-auto">
            <div className="flex flex-1">
              <div className="image"></div>
              <div className="text">
                <div className="text-line"></div>
                <div className="text-line w-1/2"></div>
              </div>
            </div>
            <div className="card-placeholder w-16 sm:w-24"></div>
          </div>
          <HorizontalDivider />
        </div>
      );
    }
    return animations;
  };

  return <>{showLoader(9)}</>;
};
