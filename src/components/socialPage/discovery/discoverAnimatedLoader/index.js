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
    for (let i = 0; i < count; i++) {
      animations.push(
        <>
          <div className="wrapper-cell flex justify-between">
            <div className="flex flex-1">
              <div className="text">
                <div className="text-line"></div>
              </div>
            </div>
            <div className="discover-placeholder w-1 h-1"></div>
          </div>
          <HorizontalDivider />
        </>
      );
    }
    return animations;
  };

  return <>{showLoader(6)}</>;
};
