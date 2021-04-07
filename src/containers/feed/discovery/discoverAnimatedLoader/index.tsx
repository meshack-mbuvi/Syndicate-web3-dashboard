import React from "react";
import HorizontalDivider from "src/components/horizontalDivider";

/**
 * Renders an animated loader for social feed
 */
export const DiscoverAnimatedLoader = () => {
  /**
   * This method creates a list of loader items
   * @param {number} count the number of loader items to be rendered
   * @returns {array} animations list of loader items
   */
  const showLoader = (count) => {
    const animations = [];
    for (let index = 0; index < count; index++) {
      animations.push(
        <React.Fragment key={index}>
          <div className="wrapper-cell flex justify-between">
            <div className="flex flex-1">
              <div className="text">
                <div className="text-line"></div>
              </div>
            </div>
            <div className="discover-placeholder w-6 h-6"></div>
          </div>
          <HorizontalDivider />
        </React.Fragment>
      );
    }
    return animations;
  };

  return <>{showLoader(6)}</>;
};
